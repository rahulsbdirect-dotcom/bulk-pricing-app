const db = require('../../../lib/db');
const { calculateCartTotal } = require('../../../lib/pricing');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }

    // Fetch product details and calculate totals
    const cartItemsWithPricing = [];

    for (const item of items) {
      const productQuery = `
        SELECT 
          p.id,
          p.name,
          p.base_price,
          p.stock_quantity,
          json_agg(
            json_build_object(
              'id', pt.id,
              'min_quantity', pt.min_quantity,
              'max_quantity', pt.max_quantity,
              'unit_price', pt.unit_price,
              'discount_percentage', pt.discount_percentage
            ) ORDER BY pt.min_quantity
          ) as pricing_tiers
        FROM products p
        LEFT JOIN pricing_tiers pt ON p.id = pt.product_id
        WHERE p.id = $1 AND p.is_active = true
        GROUP BY p.id
      `;

      const result = await db.query(productQuery, [item.productId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: `Product ${item.productId} not found`
        });
      }

      const product = result.rows[0];

      cartItemsWithPricing.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        tiers: product.pricing_tiers
      });
    }

    const cartTotal = calculateCartTotal(cartItemsWithPricing);

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(cartTotal.total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: userId || 'guest',
        itemCount: cartTotal.itemCount
      }
    });

    // Create order in database
    const orderResult = await db.query(
      `INSERT INTO orders (user_id, total_amount, status, stripe_payment_intent_id, shipping_address)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId || null, cartTotal.total, 'pending', paymentIntent.id, shippingAddress]
    );

    const order = orderResult.rows[0];

    // Insert order items
    for (const item of cartTotal.items) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.productId, item.quantity, item.unitPrice, item.subtotal]
      );
    }

    res.status(201).json({
      success: true,
      order: {
        id: order.id,
        total: order.total_amount,
        status: order.status,
        clientSecret: paymentIntent.client_secret
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
}
