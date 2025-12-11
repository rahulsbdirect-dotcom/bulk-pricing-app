// Test script for pricing calculations
const { calculatePrice, calculateCartTotal, formatPricingTiers } = require('../lib/pricing');

// Sample pricing tiers
const sampleTiers = [
  { id: 1, min_quantity: 1, max_quantity: 10, unit_price: '10.00', discount_percentage: 0 },
  { id: 2, min_quantity: 11, max_quantity: 50, unit_price: '8.50', discount_percentage: 15 },
  { id: 3, min_quantity: 51, max_quantity: 100, unit_price: '7.00', discount_percentage: 30 },
  { id: 4, min_quantity: 101, max_quantity: null, unit_price: '6.00', discount_percentage: 40 }
];

console.log('=== Bulk Pricing Calculator Test ===\n');

// Test 1: Single quantity
console.log('Test 1: Buying 5 units');
const test1 = calculatePrice(5, sampleTiers);
console.log(test1);
console.log(`Expected: $10/unit, Total: $50.00\n`);

// Test 2: First tier boundary
console.log('Test 2: Buying 11 units (tier 2)');
const test2 = calculatePrice(11, sampleTiers);
console.log(test2);
console.log(`Expected: $8.50/unit, Total: $93.50, Savings: $16.50\n`);

// Test 3: Mid tier
console.log('Test 3: Buying 75 units (tier 3)');
const test3 = calculatePrice(75, sampleTiers);
console.log(test3);
console.log(`Expected: $7.00/unit, Total: $525.00, Savings: $225.00\n`);

// Test 4: Highest tier
console.log('Test 4: Buying 200 units (tier 4)');
const test4 = calculatePrice(200, sampleTiers);
console.log(test4);
console.log(`Expected: $6.00/unit, Total: $1200.00, Savings: $800.00\n`);

// Test 5: Cart with multiple products
console.log('Test 5: Cart with multiple products');
const cartItems = [
  {
    productId: 1,
    productName: 'Premium Widget',
    quantity: 25,
    tiers: sampleTiers
  },
  {
    productId: 2,
    productName: 'Standard Gadget',
    quantity: 60,
    tiers: sampleTiers
  }
];

const cartTotal = calculateCartTotal(cartItems);
console.log(cartTotal);
console.log('\n=== Test Complete ===');

// Test 6: Format pricing tiers for display
console.log('\nTest 6: Formatted pricing tiers');
const formatted = formatPricingTiers(sampleTiers);
console.log(formatted);
