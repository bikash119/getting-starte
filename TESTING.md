# Testing Documentation

This project uses Vitest for unit testing. The tests are focused on ensuring the correctness of the application's core functionality.

## Test Setup

The testing environment is configured in `vitest.config.ts` and `vitest.setup.ts`. 

- **vitest.config.ts**: Configures Vitest with path aliases and test environment settings.
- **vitest.setup.ts**: Sets up global mocks and environment variables for testing.

## Running Tests

To run the tests, use the following commands:

```bash
# Run all tests once
npm run test

# Run tests in watch mode (for development)
npm run test:watch
```

## Test Structure

Tests are organized in `__tests__` directories alongside the code they're testing:

```
api/
  ├── services/
  │   ├── __tests__/
  │   │   ├── supabase.test.ts
  │   │   └── SalesDeal.test.ts
  │   ├── supabase.ts
  │   └── SalesDeal.ts
  └── type/
      ├── __tests__/
      │   └── deals.test.ts
      └── deals.ts
```

## Mocking

Tests use Vitest's mocking capabilities to isolate the units being tested:

- External dependencies (like `@supabase/supabase-js`) are mocked to prevent actual API calls.
- Environment variables are mocked to ensure consistent test results.

### Example: Mocking Supabase Client

```typescript
vi.mock('../supabase', () => {
  return {
    default: vi.fn((env) => {
      if (env) {
        return createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
      } else {
        return createClient(
          'https://example-supabase-url.supabase.co',
          'example-supabase-key'
        );
      }
    })
  };
});

vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: vi.fn(() => ({
      from: vi.fn(...),
      // Other methods...
    })),
  };
});
```

## Test Coverage

The tests currently cover:

1. **Supabase Client**
   - Creation with environment variables
   - Fallback to import.meta.env when no environment is provided

2. **Sales Deal Service**
   - Retrieving all sales deals
   - Adding new deals
   - Error handling

3. **Zod Schemas**
   - Validation of Deal schema
   - Validation of DealWithId schema
   - Validation of DealsResponse schema

## Future Improvements

As the project follows TDD (Test-Driven Development) going forward, additional tests should be written before implementing new features. Some recommended areas for future test coverage:

1. React components
2. React Router loaders and actions
3. API routes
4. Form validation
5. Chart rendering and data formatting

## Best Practices

When adding new tests:

1. Mock external dependencies
2. Test both success and failure cases
3. Verify all edge cases
4. Keep tests focused on a single unit of functionality
5. Use descriptive test names following the pattern "it should..."
6. Write tests before implementing new features (TDD)