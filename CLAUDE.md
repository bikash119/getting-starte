# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Router application with a backend API for managing sales deals. The application allows users to view sales deals in a chart and add/update sales deals through a form. The data is stored in a Supabase database.

## Technology Stack

- **Frontend**:
  - React 19
  - React Router 7 (for routing and server-side rendering)
  - TailwindCSS 4 (for styling)
  - React Charts (for data visualization)

- **Backend**:
  - Hono (API framework)
  - Supabase (database)
  - Zod (schema validation)

- **Infrastructure**:
  - Cloudflare Workers (deployment)
  - Docker (containerization)

- **Development**:
  - TypeScript (type safety)
  - Vite (build tool)
  - Wrangler (Cloudflare Workers CLI)

## Project Structure

- `/app`: React components and routes
  - `routes/`: Route components with loaders and actions
  - `welcome/`: UI components for the main page

- `/api`: Cloudflare Worker code
  - `routes/`: API route definitions
  - `services/`: Business logic and database operations
  - `type/`: TypeScript and Zod type definitions

- `/data`: Static data files

- `/public`: Static assets served by the application

## Development Commands

```bash
# Install dependencies
npm install

# Start the development server with HMR
npm run dev

# Build the application for production
npm run build

# Preview the production build locally
npm run preview

# Deploy to Cloudflare Workers
npm run deploy

# Deploy to production environment
npm run deploy:prod

# Generate TypeScript types
npm run typegen

# Run TypeScript type checking
npm run typecheck
```

## Code Style

- **TypeScript**: Use TypeScript with strict typing for all files
- **Path aliases**: 
  - `~/*` maps to `./app/*`
  - `api/*` for referencing API code

- **React Components**: 
  - Use functional components with hooks
  - Type props using TypeScript interfaces or Zod schemas

- **API Routes**:
  - Use Hono router for API endpoints
  - Implement proper error handling and status codes

## Runtime Type Safety

The application uses Zod extensively for runtime type validation:

- **Schema Definitions**: Defined in `api/type/deals.ts`
- **Request Validation**: Form data and API requests are validated using Zod schemas
- **Response Validation**: API responses are validated against expected schemas
- **TypeScript Integration**: Zod schemas are used to generate TypeScript types with `z.infer<typeof Schema>`

Example of Zod usage:
```typescript
// Schema definition
const Deal = z.object({
  name: z.string(),
  value: z.number()
})

// Type generation
type DealSchema = z.infer<typeof Deal>

// Validation
const deal = Deal.parse(formData)
```

## Architecture

### Frontend Data Flow
1. Initial page load: `loader` function in `home.tsx` fetches data from Supabase
2. Form submission: `clientAction` function processes form data and sends it to the API
3. React Router handles data revalidation and UI updates

### Backend Data Flow
1. API endpoints in `api/routes/DealRoutes.ts` handle HTTP requests
2. Service functions in `api/services/SalesDeal.ts` perform business logic
3. Supabase client in `api/services/supabase.ts` interacts with the database

## Environment Configuration

The application requires the following environment variables:
- `SUPABASE_URL`: The URL of your Supabase instance
- `SUPABASE_KEY`: The API key for your Supabase instance

These can be provided as environment variables or through Cloudflare Workers configuration.

## Common Development Patterns

### Adding a New API Endpoint
1. Create a new route in `api/routes/`
2. Add service functions in `api/services/`
3. Define types in `api/type/`
4. Register the route in `api/app.ts`

### Adding a New Page
1. Create a new file in `app/routes/`
2. Define loader and action functions as needed
3. Add the page to the routes in `app/routes.ts`

### Working with Database
- Use the Supabase client from `api/services/supabase.ts`
- Follow the existing patterns for CRUD operations
- Validate data with Zod schemas before sending to the database