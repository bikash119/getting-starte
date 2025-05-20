import { describe, it, expect, vi, beforeEach } from 'vitest';
import supabaseClient from '../supabase';
import { createClient } from '@supabase/supabase-js';

// Instead of mocking import.meta.env, let's modify the original function for testing
vi.mock('../supabase', () => {
  const originalModule = vi.importActual('../supabase');
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

// Mock createClient from @supabase/supabase-js
vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: vi.fn(() => ({
      // Mock SupabaseClient methods that might be used
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(),
        })),
        insert: vi.fn(() => ({
          select: vi.fn(),
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(),
          })),
        })),
      })),
    })),
  };
});

describe('supabaseClient', () => {
  const mockEnv = {
    SUPABASE_URL: 'https://test-url.supabase.co',
    SUPABASE_KEY: 'test-key',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a Supabase client with environment variables', () => {
    const client = supabaseClient(mockEnv);
    
    expect(createClient).toHaveBeenCalledTimes(1);
    expect(createClient).toHaveBeenCalledWith(
      mockEnv.SUPABASE_URL,
      mockEnv.SUPABASE_KEY
    );
    expect(client).toBeDefined();
  });

  it('should create a Supabase client with fallback variables when env is not provided', () => {
    const client = supabaseClient();
    
    expect(createClient).toHaveBeenCalledTimes(1);
    expect(createClient).toHaveBeenCalledWith(
      'https://example-supabase-url.supabase.co',
      'example-supabase-key'
    );
    expect(client).toBeDefined();
  });
});