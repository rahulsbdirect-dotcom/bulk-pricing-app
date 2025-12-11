const db = require('../../../lib/db');

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Get order with items
      const orderQuery = `
        SELECT 
          o.id,
          o.user_id,
          o.total_amount,
          o.status,
          o.shipping_address,
          o.created_at,
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'product_name', p.name,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price,
              'subtotal', oi.subtotal
            )
          ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.id = $1
        GROUP BY o.id
      `;

      const result = await db.query(orderQuery, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        order: result.rows[0]
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch order'
      });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { status } = req.body;

      const result = await db.query(
        `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 RETURNING *`,
        [status, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        order: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update order'
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
