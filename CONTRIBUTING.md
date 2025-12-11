# Contributing to Bulk Pricing App

Thank you for considering contributing! Here's how you can help.

## How to Contribute

### Reporting Bugs

1. Check if the bug is already reported in [Issues](https://github.com/rahulsbdirect-dotcom/bulk-pricing-app/issues)
2. If not, create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check existing feature requests
2. Create new issue with `enhancement` label
3. Describe the feature and use case
4. Explain why it would be valuable

### Pull Requests

#### Setup Development Environment

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/bulk-pricing-app.git
cd bulk-pricing-app

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Fill in your credentials

# Run development server
npm run dev
```

#### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our code style

3. Test your changes:
   ```bash
   npm run test
   npm run lint
   ```

4. Commit with clear message:
   ```bash
   git commit -m "Add: feature description"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create Pull Request on GitHub

#### PR Guidelines

- **Title**: Clear and descriptive
- **Description**: What changes and why
- **Testing**: How you tested
- **Screenshots**: For UI changes
- **Breaking Changes**: Clearly marked

## Code Style

### JavaScript/React

- Use functional components with hooks
- Prefer `const` over `let`
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Example:

```javascript
// Good
const calculateTotalPrice = (quantity, unitPrice) => {
  return quantity * unitPrice;
};

// Avoid
const calc = (q, p) => q * p;
```

### File Structure

```
component/
├── ComponentName.js      # Component logic
└── ComponentName.test.js # Tests
```

### API Routes

- Validate all inputs
- Use try-catch for error handling
- Return consistent response format:

```javascript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: 'Error message' }
```

## Database Changes

If modifying schema:

1. Update `database/schema.sql`
2. Create migration script in `database/migrations/`
3. Document changes in PR

## Testing

### Manual Testing

Test these scenarios:
- [ ] Add products to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Checkout flow
- [ ] Different pricing tiers
- [ ] Mobile responsiveness

### Automated Tests

```bash
npm run test
```

## Documentation

Update docs when:
- Adding new features
- Changing APIs
- Modifying setup process
- Adding dependencies

## Questions?

- Open a [Discussion](https://github.com/rahulsbdirect-dotcom/bulk-pricing-app/discussions)
- Email: rahul.sbdirect@gmail.com

## License

By contributing, you agree your contributions will be licensed under MIT License.
