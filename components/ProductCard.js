import { useState } from 'react';

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState(null);

  const calculatePrice = (qty) => {
    const tier = product.pricing_tiers.find(t => {
      const meetsMin = qty >= t.min_quantity;
      const meetsMax = t.max_quantity === null || qty <= t.max_quantity;
      return meetsMin && meetsMax;
    });

    if (tier) {
      setSelectedTier(tier);
      return {
        unitPrice: parseFloat(tier.unit_price),
        total: qty * parseFloat(tier.unit_price),
        discount: tier.discount_percentage
      };
    }
    return null;
  };

  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value) || 1;
    setQuantity(qty);
    calculatePrice(qty);
  };

  const pricing = calculatePrice(quantity);

  return (
    <div className="product-card">
      <img src={product.image_url} alt={product.name} />
      
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        
        <div className="pricing-tiers">
          <h4>Volume Pricing:</h4>
          {product.pricing_tiers.map((tier, index) => (
            <div 
              key={index} 
              className={`tier ${selectedTier?.id === tier.id ? 'active' : ''}`}
            >
              <span className="range">
                {tier.max_quantity 
                  ? `${tier.min_quantity}-${tier.max_quantity} units`
                  : `${tier.min_quantity}+ units`
                }
              </span>
              <span className="price">${parseFloat(tier.unit_price).toFixed(2)}/unit</span>
              {tier.discount_percentage > 0 && (
                <span className="discount">{tier.discount_percentage}% off</span>
              )}
            </div>
          ))}
        </div>

        <div className="purchase-section">
          <div className="quantity-selector">
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.stock_quantity}
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>

          {pricing && (
            <div className="price-display">
              <div className="unit-price">
                ${pricing.unitPrice.toFixed(2)} per unit
              </div>
              <div className="total-price">
                Total: ${pricing.total.toFixed(2)}
              </div>
              {pricing.discount > 0 && (
                <div className="savings">
                  Save {pricing.discount}%!
                </div>
              )}
            </div>
          )}

          <button 
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product, quantity)}
          >
            Add to Cart
          </button>
        </div>

        <div className="stock-info">
          {product.stock_quantity} units in stock
        </div>
      </div>

      <style jsx>{`
        .product-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          background: white;
          transition: box-shadow 0.3s;
        }

        .product-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .product-info {
          padding: 20px;
        }

        h3 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 1.3rem;
        }

        .description {
          color: #666;
          margin-bottom: 15px;
          font-size: 0.9rem;
        }

        .pricing-tiers {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 15px;
        }

        .pricing-tiers h4 {
          margin: 0 0 10px 0;
          font-size: 0.9rem;
          color: #555;
        }

        .tier {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          margin-bottom: 5px;
          border-radius: 4px;
          font-size: 0.85rem;
        }

        .tier.active {
          background: #e3f2fd;
          border: 1px solid #2196f3;
        }

        .range {
          color: #555;
        }

        .price {
          font-weight: bold;
          color: #2196f3;
        }

        .discount {
          background: #4caf50;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
        }

        .purchase-section {
          margin-top: 15px;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .quantity-selector label {
          font-weight: 500;
          color: #555;
        }

        .quantity-selector input {
          width: 80px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .price-display {
          background: #fff3e0;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 15px;
        }

        .unit-price {
          font-size: 0.9rem;
          color: #666;
        }

        .total-price {
          font-size: 1.3rem;
          font-weight: bold;
          color: #ff6f00;
          margin: 5px 0;
        }

        .savings {
          color: #4caf50;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .add-to-cart-btn {
          width: 100%;
          padding: 12px;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }

        .add-to-cart-btn:hover {
          background: #1976d2;
        }

        .stock-info {
          margin-top: 10px;
          font-size: 0.85rem;
          color: #666;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
