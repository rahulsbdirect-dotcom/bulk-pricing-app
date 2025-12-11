import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Cart({ items, onUpdateQuantity, onRemove }) {
  const [cartTotal, setCartTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (items.length > 0) {
      calculateCart();
    } else {
      setCartTotal(null);
    }
  }, [items]);

  const calculateCart = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        })
      });

      const data = await response.json();
      if (data.success) {
        setCartTotal(data.cart);
      }
    } catch (error) {
      console.error('Error calculating cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          shippingAddress: 'Sample Address' // In production, collect from user
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const stripe = await stripePromise;
        
        // Redirect to Stripe Checkout
        const { error } = await stripe.confirmCardPayment(data.order.clientSecret);
        
        if (error) {
          alert('Payment failed: ' + error.message);
        } else {
          alert('Order placed successfully! Order ID: ' + data.order.id);
          // Clear cart
          items.forEach(item => onRemove(item.productId));
        }
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <div className="empty-cart">
          <p>Your cart is empty</p>
        </div>

        <style jsx>{`
          .cart-container {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            position: sticky;
            top: 20px;
          }

          h2 {
            margin: 0 0 20px 0;
            color: #333;
          }

          .empty-cart {
            text-align: center;
            padding: 40px 20px;
            color: #999;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart ({items.length})</h2>

      <div className="cart-items">
        {items.map(item => (
          <div key={item.productId} className="cart-item">
            <div className="item-info">
              <h4>{item.productName}</h4>
              <div className="quantity-control">
                <button onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}>
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                  min="1"
                />
                <button onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}>
                  +
                </button>
              </div>
            </div>
            <button className="remove-btn" onClick={() => onRemove(item.productId)}>
              ×
            </button>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading">Calculating...</div>
      ) : cartTotal && (
        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${cartTotal.total.toFixed(2)}</span>
          </div>
          {cartTotal.totalSavings > 0 && (
            <div className="summary-row savings">
              <span>You Save:</span>
              <span>-${cartTotal.totalSavings.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>Total:</span>
            <span>${cartTotal.total.toFixed(2)}</span>
          </div>

          <button 
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={checkoutLoading}
          >
            {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>
      )}

      <style jsx>{`
        .cart-container {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          position: sticky;
          top: 20px;
        }

        h2 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .cart-items {
          margin-bottom: 20px;
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #f0f0f0;
        }

        .item-info h4 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 0.95rem;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .quantity-control button {
          width: 30px;
          height: 30px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1.2rem;
        }

        .quantity-control button:hover {
          background: #f5f5f5;
        }

        .quantity-control input {
          width: 50px;
          padding: 5px;
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .remove-btn {
          background: #f44336;
          color: white;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.5rem;
          line-height: 1;
        }

        .remove-btn:hover {
          background: #d32f2f;
        }

        .cart-summary {
          border-top: 2px solid #e0e0e0;
          padding-top: 15px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 0.95rem;
        }

        .summary-row.savings {
          color: #4caf50;
          font-weight: bold;
        }

        .summary-row.total {
          font-size: 1.3rem;
          font-weight: bold;
          color: #333;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
        }

        .checkout-btn {
          width: 100%;
          padding: 15px;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          margin-top: 15px;
          transition: background 0.3s;
        }

        .checkout-btn:hover:not(:disabled) {
          background: #45a049;
        }

        .checkout-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .loading {
          text-align: center;
          padding: 20px;
          color: #666;
        }
      `}</style>
    </div>
  );
}
