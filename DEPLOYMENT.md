# Deployment Guide

Complete guide to deploy your Bulk Pricing App to production.

## Quick Deploy Options

### Option 1: Vercel + Supabase (Recommended - Easiest)

#### Step 1: Setup Supabase Database

1. Go to [Supabase](https://supabase.com) and create account
2. Create new project
3. Go to SQL Editor and run `database/schema.sql`
4. Get connection string from Settings > Database
5. Copy the connection string (starts with `postgresql://`)

#### Step 2: Deploy to Vercel

1. Push code to GitHub (already done ✓)
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select `rahulsbdirect-dotcom/bulk-pricing-app`
5. Add environment variables:
   ```
   DATABASE_URL=your_supabase_connection_string
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   JWT_SECRET=your_random_secret_key
   ```
6. Click Deploy

**Done! Your app will be live at `https://your-app.vercel.app`**

---

### Option 2: Railway (Full Stack Platform)

#### Step 1: Setup Railway

1. Go to [Railway](https://railway.app)
2. Create new project
3. Add PostgreSQL database service
4. Add GitHub repo service

#### Step 2: Configure Environment

Railway will auto-detect Next.js. Add these variables:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
JWT_SECRET=your_random_secret_key
```

#### Step 3: Run Database Migration

In Railway PostgreSQL service:
1. Go to "Data" tab
2. Click "Query"
3. Paste contents of `database/schema.sql`
4. Execute

**Done! Railway provides automatic HTTPS domain**

---

### Option 3: DigitalOcean App Platform

#### Step 1: Create App

1. Go to [DigitalOcean](https://digitalocean.com)
2. Create App from GitHub repo
3. Select `rahulsbdirect-dotcom/bulk-pricing-app`

#### Step 2: Add Database

1. Add PostgreSQL database component
2. Note the connection string

#### Step 3: Configure

Add environment variables in App settings:
```env
DATABASE_URL=${db.DATABASE_URL}
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
JWT_SECRET=your_random_secret_key
```

#### Step 4: Run Migration

Connect to database and run `database/schema.sql`

---

## Stripe Setup

### Get Stripe API Keys

1. Create account at [Stripe](https://stripe.com)
2. Go to Developers > API keys
3. Copy:
   - **Secret key** (starts with `sk_test_`)
   - **Publishable key** (starts with `pk_test_`)

### Test Mode vs Live Mode

**Test Mode** (Development):
- Use test API keys
- Test card: `4242 4242 4242 4242`
- No real charges

**Live Mode** (Production):
- Switch to live API keys in Stripe dashboard
- Real payments processed
- Requires business verification

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `STRIPE_SECRET_KEY` | Stripe secret API key | `sk_test_...` or `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` or `pk_live_...` |
| `JWT_SECRET` | Secret for JWT tokens | Any random string (32+ chars) |
| `NEXT_PUBLIC_API_URL` | API base URL | `https://your-domain.com/api` |

---

## Database Migration

### Initial Setup

Run the schema file to create all tables:

```bash
psql $DATABASE_URL -f database/schema.sql
```

### Verify Tables

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should show: users, products, pricing_tiers, orders, order_items
```

### Sample Data

The schema includes 3 sample products with pricing tiers. To add more:

```sql
INSERT INTO products (name, description, base_price, image_url, stock_quantity) 
VALUES ('Your Product', 'Description', 20.00, 'https://...', 500);

-- Get the product ID, then add pricing tiers
INSERT INTO pricing_tiers (product_id, min_quantity, max_quantity, unit_price, discount_percentage)
VALUES 
  (4, 1, 10, 20.00, 0),
  (4, 11, 50, 18.00, 10),
  (4, 51, NULL, 15.00, 25);
```

---

## Custom Domain Setup

### Vercel

1. Go to Project Settings > Domains
2. Add your domain (e.g., `shop.yourdomain.com`)
3. Add DNS records as shown
4. Wait for SSL certificate (automatic)

### Railway

1. Go to Settings > Domains
2. Click "Add Custom Domain"
3. Add CNAME record to your DNS
4. SSL auto-configured

---

## Performance Optimization

### Database Indexing

Already included in schema:
- Product lookups
- Order queries
- User searches

### Caching Strategy

Add Redis for cart caching (optional):

```javascript
// lib/cache.js
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

async function cacheCart(userId, cart) {
  await client.setEx(`cart:${userId}`, 3600, JSON.stringify(cart));
}
```

### CDN for Images

Use Cloudinary or AWS S3 for product images:

1. Upload images to CDN
2. Update `image_url` in products table
3. Configure `next.config.js` domains

---

## Monitoring & Logging

### Vercel Analytics

Enable in Project Settings > Analytics

### Error Tracking

Add Sentry:

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.config.js
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Database Monitoring

Supabase provides built-in monitoring:
- Query performance
- Connection pooling
- Slow query logs

---

## Security Checklist

- [ ] Use environment variables for secrets
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Validate all user inputs
- [ ] Use prepared statements (already implemented)
- [ ] Rate limit API endpoints
- [ ] Enable CORS properly
- [ ] Use Stripe webhooks for payment confirmation
- [ ] Implement user authentication
- [ ] Add CSRF protection

---

## Scaling Considerations

### Database

**Connection Pooling:**
```javascript
const pool = new Pool({
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

**Read Replicas:**
- Use Supabase read replicas for heavy read operations
- Separate read/write connections

### Application

**Horizontal Scaling:**
- Vercel: Automatic
- Railway: Increase replicas in settings
- DigitalOcean: Scale app instances

**Caching:**
- Add Redis for session/cart storage
- Use CDN for static assets
- Implement API response caching

---

## Backup Strategy

### Database Backups

**Supabase:**
- Automatic daily backups (Pro plan)
- Point-in-time recovery

**Manual Backup:**
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

**Restore:**
```bash
psql $DATABASE_URL < backup_20250101.sql
```

---

## Troubleshooting

### Common Issues

**Database Connection Failed:**
- Check `DATABASE_URL` format
- Verify SSL settings
- Check firewall rules

**Stripe Payment Failed:**
- Verify API keys match (test vs live)
- Check webhook configuration
- Review Stripe dashboard logs

**Build Failed:**
- Check Node.js version (14+)
- Verify all dependencies installed
- Review build logs

### Debug Mode

Enable verbose logging:

```javascript
// next.config.js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

---

## Production Checklist

Before going live:

- [ ] Test all payment flows
- [ ] Verify email notifications work
- [ ] Test on mobile devices
- [ ] Check page load speeds
- [ ] Review security headers
- [ ] Set up monitoring/alerts
- [ ] Configure backup strategy
- [ ] Test error handling
- [ ] Review privacy policy/terms
- [ ] Enable SSL certificate
- [ ] Configure custom domain
- [ ] Switch Stripe to live mode

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**Need Help?**
- GitHub Issues: https://github.com/rahulsbdirect-dotcom/bulk-pricing-app/issues
- Email: rahul.sbdirect@gmail.com
