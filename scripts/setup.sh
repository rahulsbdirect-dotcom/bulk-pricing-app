#!/bin/bash

# Bulk Pricing App - Quick Setup Script

echo "🚀 Bulk Pricing App - Quick Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Setup environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file and add your credentials:"
    echo "   - DATABASE_URL (PostgreSQL connection string)"
    echo "   - STRIPE_SECRET_KEY"
    echo "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    echo "   - JWT_SECRET"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check if database URL is set
if grep -q "your_database_url_here" .env 2>/dev/null; then
    echo "⚠️  Database URL not configured in .env"
    echo ""
    echo "Choose database setup option:"
    echo "1) I have a PostgreSQL database ready"
    echo "2) Use Docker to run PostgreSQL locally"
    echo "3) Skip database setup for now"
    echo ""
    read -p "Enter choice (1-3): " db_choice
    
    case $db_choice in
        1)
            echo ""
            read -p "Enter your PostgreSQL connection string: " db_url
            sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=$db_url|" .env
            echo "✅ Database URL updated"
            ;;
        2)
            if command -v docker &> /dev/null; then
                echo "🐳 Starting PostgreSQL with Docker..."
                docker-compose up -d postgres
                echo "✅ PostgreSQL started on localhost:5432"
                echo "   Database: bulk_pricing_db"
                echo "   User: bulkpricing"
                echo "   Password: changeme123"
                sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgresql://bulkpricing:changeme123@localhost:5432/bulk_pricing_db|" .env
            else
                echo "❌ Docker not found. Please install Docker first."
            fi
            ;;
        3)
            echo "⏭️  Skipping database setup"
            ;;
    esac
    echo ""
fi

# Test pricing calculations
echo "🧪 Testing pricing calculations..."
node scripts/test-pricing.js

if [ $? -eq 0 ]; then
    echo "✅ Pricing tests passed"
else
    echo "⚠️  Pricing tests had issues (non-critical)"
fi

echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file with your credentials"
echo "2. Run database migrations: npm run db:migrate"
echo "3. Start development server: npm run dev"
echo "4. Open http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Getting started guide"
echo "   - DEPLOYMENT.md - Production deployment"
echo "   - CONTRIBUTING.md - How to contribute"
echo ""
echo "Need help? Open an issue on GitHub"
echo ""
