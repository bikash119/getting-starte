// This file is used to set up the test environment for Vitest
// It will be run before each test file

// Mock environment variables
import { vi } from 'vitest';

// Set up global environment variables
vi.stubGlobal('import.meta.env', {
  VITE_SUPABASE_URL: 'https://example-supabase-url.supabase.co',
  VITE_SUPABASE_KEY: 'example-supabase-key',
});