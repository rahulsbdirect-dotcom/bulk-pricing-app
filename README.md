# Bulk Pricing E-Commerce App

A full-stack bulk pricing application built with Next.js, PostgreSQL, and Stripe integration.

## Features

- **Dynamic Bulk Pricing**: Automatic price calculation based on quantity tiers
- **Real-time Cart Calculation**: Instant price updates as quantities change
- **Stripe Payment Integration**: Secure payment processing
- **Product Management**: Full CRUD operations for products and pricing tiers
- **Order Management**: Complete order lifecycle tracking
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Frontend
- Next.js 14
- React 18
- CSS-in-JS (styled-jsx)

### Backend
- Next.js API Routes
- PostgreSQL database
- Node.js

### Payment
- Stripe Payment Intents API

## Database Schema

### Tables
1. **users** - User authentication and profiles
2. **products** - Product catalog
3. **pricing_tiers** - Volume-based pricing rules
4. **orders** - Order records
5. **order_items** - Order line items

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/rahulsbdirect-dotcom/bulk-pricing-app.git
cd bulk-pricing-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

Create a PostgreSQL database and run the schema:
```bash
psql -U your_username -d your_database -f database/schema.sql
```

### 4. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `JWT_SECRET` - Secret for JWT tokens

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - List all products with pricing tiers
- `POST /api/products` - Create new product

### Cart
- `POST /api/cart/calculate` - Calculate cart total with bulk pricing

### Orders
- `POST /api/orders/create` - Create order and payment intent
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id` - Update order status

## Pricing Logic

The app uses a tiered pricing system:

```javascript
// Example pricing tiers
[
  { min: 1, max: 10, price: $10.00 },    // 0% discount
  { min: 11, max: 50, price: $8.50 },    // 15% discount
  { min: 51, max: 100, price: $7.00 },   // 30% discount
  { min: 101, max: null, price: $6.00 }  // 40% discount
]
```

## Deployment

### Option 1: Vercel (Recommended for Next.js)
```bash
npm install -g vercel
vercel
```

### Option 2: Railway
```bash
# Connect via Railway CLI or dashboard
railway up
```

### Option 3: Docker
```bash
docker build -t bulk-pricing-app .
docker run -p 3000:3000 bulk-pricing-app
```

## Environment Setup

### Stripe Setup
1. Create account at https://stripe.com
2. Get API keys from Dashboard > Developers > API keys
3. Add to `.env` file

### Database Setup (Supabase)
1. Create project at https://supabase.com
2. Get connection string from Settings > Database
3. Run schema.sql in SQL Editor

## Project Structure

```
bulk-pricing-app/
├── components/          # React components
│   ├── ProductCard.js
│   └── Cart.js
├── pages/
│   ├── api/            # API routes
│   │   ├── products/
│   │   ├── cart/
│   │   └── orders/
│   └── index.js        # Homepage
├── lib/
│   ├── db.js           # Database connection
│   └── pricing.js      # Pricing utilities
├── database/
│   └── schema.sql      # Database schema
└── package.json
```

## Key Features Explained

### 1. Dynamic Pricing Calculation
The `lib/pricing.js` module handles all pricing logic:
- Finds applicable tier based on quantity
- Calculates unit price and total
- Computes savings vs base price

### 2. Cart Management
Real-time cart updates with:
- Quantity adjustments
- Automatic price recalculation
- Stock validation

### 3. Stripe Integration
Secure payment flow:
- Payment Intent creation
- Client-side confirmation
- Order status tracking

## Testing

### Test Products
The schema includes 3 sample products with different pricing tiers.

### Test Stripe Payments
Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - feel free to use for commercial projects

## Support

For issues and questions:
- GitHub Issues: https://github.com/rahulsbdirect-dotcom/bulk-pricing-app/issues
- Email: rahul.sbdirect@gmail.com

## Roadmap

- [ ] User authentication
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Invoice generation
- [ ] Multi-currency support
- [ ] Inventory management
- [ ] Analytics dashboard

---

Built with ❤️ using Next.js and Stripe
