// Database migration script
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function runMigration() {
  console.log('🔄 Running database migration...\n');

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.error('Please set it in your .env file\n');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Test connection
    console.log('📡 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected\n');

    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    console.log('📖 Reading schema file...');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema file loaded\n');

    // Execute schema
    console.log('🔨 Creating tables...');
    await pool.query(schema);
    console.log('✅ Tables created successfully\n');

    // Verify tables
    console.log('🔍 Verifying tables...');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('✅ Tables found:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    // Check sample data
    console.log('\n📊 Checking sample data...');
    const productCount = await pool.query('SELECT COUNT(*) FROM products');
    console.log(`✅ Products: ${productCount.rows[0].count}`);

    const tierCount = await pool.query('SELECT COUNT(*) FROM pricing_tiers');
    console.log(`✅ Pricing tiers: ${tierCount.rows[0].count}`);

    console.log('\n================================');
    console.log('✅ Migration completed successfully!');
    console.log('================================\n');

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Load environment variables
require('dotenv').config();

// Run migration
runMigration();
