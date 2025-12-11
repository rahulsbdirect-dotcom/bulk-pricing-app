# Quick Start Guide

Get your bulk pricing app running in 5 minutes!

## Prerequisites

- Node.js 14+ installed
- PostgreSQL database (or use Docker)
- Stripe account (free test account)

## Option 1: Automated Setup (Recommended)

### Step 1: Clone & Setup

```bash
git clone https://github.com/rahulsbdirect-dotcom/bulk-pricing-app.git
cd bulk-pricing-app
chmod +x scripts/setup.sh
./scripts/setup.sh
```

The script will:
- ✅ Install dependencies
- ✅ Create .env file
- ✅ Optionally start PostgreSQL with Docker
- ✅ Test pricing calculations

### Step 2: Configure Environment

Edit `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/bulk_pricing_db
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
JWT_SECRET=your_random_secret_key
```

Get Stripe keys from: https://dashboard.stripe.com/test/apikeys

### Step 3: Setup Database

```bash
npm run db:migrate
```

### Step 4: Start App

```bash
npm run dev
```

Open http://localhost:3000 🎉

---

## Option 2: Docker (Easiest)

### One Command Setup

```bash
git clone https://github.com/rahulsbdirect-dotcom/bulk-pricing-app.git
cd bulk-pricing-app

# Add your Stripe keys to .env
cp .env.example .env
# Edit .env and add STRIPE keys

# Start everything
docker-compose up
```

That's it! App runs on http://localhost:3000

Database automatically created and migrated.

---

## Option 3: Manual Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

**Using Supabase (Free):**
1. Go to https://supabase.com
2. Create new project
3. Copy connection string
4. Go to SQL Editor
5. Paste contents of `database/schema.sql`
6. Execute

**Using Local PostgreSQL:**
```bash
createdb bulk_pricing_db
psql bulk_pricing_db < database/schema.sql
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials.

### 4. Run App

```bash
npm run dev
```

---

## Testing the App

### 1. Browse Products

Visit http://localhost:3000 to see 3 sample products with bulk pricing.

### 2. Test Pricing Tiers

Try different quantities:
- **1-10 units**: Base price
- **11-50 units**: 15% discount
- **51-100 units**: 30% discount
- **101+ units**: 40% discount

### 3. Test Checkout

Use Stripe test card:
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

---

## Common Issues

### Port 3000 already in use

```bash
# Use different port
PORT=3001 npm run dev
```

### Database connection failed

Check:
- PostgreSQL is running
- DATABASE_URL is correct
- Firewall allows connection

### Stripe payment failed

Verify:
- Using test mode keys (start with `sk_test_` and `pk_test_`)
- Keys match (both from same Stripe account)

---

## Next Steps

### Add Your Products

```sql
INSERT INTO products (name, description, base_price, image_url, stock_quantity)
VALUES ('Your Product', 'Description', 29.99, 'https://...', 1000);

-- Add pricing tiers
INSERT INTO pricing_tiers (product_id, min_quantity, max_quantity, unit_price, discount_percentage)
VALUES 
  (4, 1, 10, 29.99, 0),
  (4, 11, 50, 25.99, 13),
  (4, 51, NULL, 22.99, 23);
```

### Customize Design

Edit:
- `pages/index.js` - Homepage layout
- `components/ProductCard.js` - Product display
- `components/Cart.js` - Cart design
- `styles/globals.css` - Global styles

### Deploy to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Vercel deployment (1-click)
- Railway deployment
- Custom domain setup
- SSL configuration

---

## Resources

- **Full Documentation**: [README.md](README.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **API Reference**: Check `pages/api/` folder
- **Database Schema**: `database/schema.sql`

---

## Need Help?

- 📖 Read the [README](README.md)
- 🐛 Report issues on [GitHub](https://github.com/rahulsbdirect-dotcom/bulk-pricing-app/issues)
- 💬 Ask questions in [Discussions](https://github.com/rahulsbdirect-dotcom/bulk-pricing-app/discussions)
- 📧 Email: rahul.sbdirect@gmail.com

---

**Happy coding! 🚀**
