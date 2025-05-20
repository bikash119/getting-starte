import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getallSalesDeals, addNewDeal, updateDeal, findDealByName, addOrUpdate } from '../SalesDeal';
import getSupbaseClient from '../supabase';

// Mock the getSupbaseClient function and its return values
vi.mock('../supabase', () => {
  // Create a mock client with all the methods we need
  const mockClient = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
  };

  return {
    default: vi.fn().mockReturnValue(mockClient),
  };
});

describe('SalesDeal Service', () => {
  const mockEnv = { SUPABASE_URL: 'test-url', SUPABASE_KEY: 'test-key' };
  
  // Get the mocked functions
  const mockSupabaseClient = getSupbaseClient as unknown as ReturnType<typeof vi.fn>;
  const mockClient = mockSupabaseClient() as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getallSalesDeals', () => {
    it('should return all sales deals on success', async () => {
      const mockDeals = [
        { id: 1, name: 'Deal 1', value: 100 },
        { id: 2, name: 'Deal 2', value: 200 },
      ];

      mockClient.select.mockResolvedValueOnce({ data: mockDeals, error: null });

      const result = await getallSalesDeals(mockEnv);

      expect(mockSupabaseClient).toHaveBeenCalledWith(mockEnv);
      expect(mockClient.from).toHaveBeenCalledWith('sales_deals');
      expect(mockClient.select).toHaveBeenCalled();
      expect(result).toEqual(mockDeals);
    });

    it('should throw an error when the query fails', async () => {
      const mockError = { message: 'Database error' };
      mockClient.select.mockResolvedValueOnce({ data: null, error: mockError });

      await expect(getallSalesDeals(mockEnv)).rejects.toThrow('Database error');
    });
  });

  describe('addNewDeal', () => {
    it('should add a new deal and return it on success', async () => {
      const newDeal = { name: 'New Deal', value: 300 };
      const mockInsertResult = [{ id: 3, ...newDeal }];

      mockClient.select.mockResolvedValueOnce({ data: mockInsertResult, error: null });

      const result = await addNewDeal(mockEnv, newDeal);

      expect(mockSupabaseClient).toHaveBeenCalledWith(mockEnv);
      expect(mockClient.from).toHaveBeenCalledWith('sales_deals');
      expect(mockClient.insert).toHaveBeenCalledWith({ name: newDeal.name, value: newDeal.value });
      expect(mockClient.select).toHaveBeenCalled();
      expect(result).toEqual(mockInsertResult[0]);
    });

    it('should throw an error when the insert fails', async () => {
      const newDeal = { name: 'Error Deal', value: 400 };
      const mockError = { message: 'Insert error' };

      mockClient.select.mockResolvedValueOnce({ data: null, error: mockError });

      await expect(addNewDeal(mockEnv, newDeal)).rejects.toThrow('Insert error');
    });

    it('should return undefined when no data is returned', async () => {
      const newDeal = { name: 'No Result Deal', value: 500 };

      mockClient.select.mockResolvedValueOnce({ data: [], error: null });

      const result = await addNewDeal(mockEnv, newDeal);

      expect(result).toBeUndefined();
    });
  });

  // Add more tests for other functions as needed
});