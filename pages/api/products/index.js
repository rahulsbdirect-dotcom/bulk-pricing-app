const db = require('../../../lib/db');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Get all active products with their pricing tiers
      const productsQuery = `
        SELECT 
          p.id,
          p.name,
          p.description,
          p.base_price,
          p.image_url,
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
        WHERE p.is_active = true
        GROUP BY p.id
        ORDER BY p.id
      `;

      const result = await db.query(productsQuery);

      res.status(200).json({
        success: true,
        products: result.rows
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch products'
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, base_price, image_url, stock_quantity, pricing_tiers } = req.body;

      // Insert product
      const productResult = await db.query(
        `INSERT INTO products (name, description, base_price, image_url, stock_quantity)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, description, base_price, image_url, stock_quantity]
      );

      const product = productResult.rows[0];

      // Insert pricing tiers
      if (pricing_tiers && pricing_tiers.length > 0) {
        for (const tier of pricing_tiers) {
          await db.query(
            `INSERT INTO pricing_tiers (product_id, min_quantity, max_quantity, unit_price, discount_percentage)
             VALUES ($1, $2, $3, $4, $5)`,
            [product.id, tier.min_quantity, tier.max_quantity, tier.unit_price, tier.discount_percentage]
          );
        }
      }

      res.status(201).json({
        success: true,
        product
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create product'
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
