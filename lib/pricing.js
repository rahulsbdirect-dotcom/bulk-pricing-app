// Pricing calculation utilities

/**
 * Calculate price based on quantity and pricing tiers
 * @param {number} quantity - Quantity to purchase
 * @param {Array} tiers - Array of pricing tier objects
 * @returns {Object} - Pricing details
 */
function calculatePrice(quantity, tiers) {
  if (!tiers || tiers.length === 0) {
    throw new Error('No pricing tiers available');
  }

  // Sort tiers by min_quantity
  const sortedTiers = [...tiers].sort((a, b) => a.min_quantity - b.min_quantity);

  // Find applicable tier
  const applicableTier = sortedTiers.find(tier => {
    const meetsMin = quantity >= tier.min_quantity;
    const meetsMax = tier.max_quantity === null || quantity <= tier.max_quantity;
    return meetsMin && meetsMax;
  });

  if (!applicableTier) {
    throw new Error('No applicable pricing tier found for quantity: ' + quantity);
  }

  const unitPrice = parseFloat(applicableTier.unit_price);
  const subtotal = quantity * unitPrice;
  const savings = quantity * (parseFloat(tiers[0].unit_price) - unitPrice);

  return {
    quantity,
    unitPrice,
    subtotal: parseFloat(subtotal.toFixed(2)),
    savings: parseFloat(savings.toFixed(2)),
    discountPercentage: applicableTier.discount_percentage || 0,
    tierId: applicableTier.id
  };
}

/**
 * Calculate cart total with multiple products
 * @param {Array} cartItems - Array of {productId, quantity, tiers}
 * @returns {Object} - Cart totals
 */
function calculateCartTotal(cartItems) {
  let total = 0;
  let totalSavings = 0;
  const itemDetails = [];

  for (const item of cartItems) {
    const pricing = calculatePrice(item.quantity, item.tiers);
    total += pricing.subtotal;
    totalSavings += pricing.savings;
    
    itemDetails.push({
      productId: item.productId,
      productName: item.productName,
      ...pricing
    });
  }

  return {
    items: itemDetails,
    total: parseFloat(total.toFixed(2)),
    totalSavings: parseFloat(totalSavings.toFixed(2)),
    itemCount: cartItems.length
  };
}

/**
 * Get pricing tiers display for a product
 * @param {Array} tiers - Pricing tiers
 * @returns {Array} - Formatted tier display
 */
function formatPricingTiers(tiers) {
  return tiers.map(tier => ({
    range: tier.max_quantity 
      ? `${tier.min_quantity}-${tier.max_quantity} units`
      : `${tier.min_quantity}+ units`,
    price: `$${parseFloat(tier.unit_price).toFixed(2)}`,
    discount: tier.discount_percentage ? `${tier.discount_percentage}% off` : 'Base price',
    unitPrice: parseFloat(tier.unit_price)
  }));
}

module.exports = {
  calculatePrice,
  calculateCartTotal,
  formatPricingTiers
};
