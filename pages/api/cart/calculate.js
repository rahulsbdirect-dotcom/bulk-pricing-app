const { calculateCartTotal } = require('../../../lib/pricing');
const db = require('../../../lib/db');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items } = req.body; // items: [{productId, quantity}]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid cart items'
      });
    }

    // Fetch product details and pricing tiers for all items
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

      // Check stock
      if (item.quantity > product.stock_quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}`
        });
      }

      cartItemsWithPricing.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        tiers: product.pricing_tiers
      });
    }

    // Calculate totals
    const cartTotal = calculateCartTotal(cartItemsWithPricing);

    res.status(200).json({
      success: true,
      cart: cartTotal
    });
  } catch (error) {
    console.error('Error calculating cart:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to calculate cart total'
    });
  }
}
