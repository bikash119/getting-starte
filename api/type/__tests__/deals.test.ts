import { describe, it, expect } from 'vitest';
import { Deal, DealWithId, DealsResponse } from '../deals';
import { z } from 'zod';

describe('Deal Schema', () => {
  it('should validate a valid deal', () => {
    const validDeal = {
      name: 'Test Deal',
      value: 1000
    };

    const result = Deal.safeParse(validDeal);
    expect(result.success).toBe(true);
  });

  it('should fail when name is missing', () => {
    const invalidDeal = {
      value: 1000
    };

    const result = Deal.safeParse(invalidDeal);
    expect(result.success).toBe(false);
  });

  it('should fail when value is not a number', () => {
    const invalidDeal = {
      name: 'Test Deal',
      value: 'not a number'
    };

    const result = Deal.safeParse(invalidDeal);
    expect(result.success).toBe(false);
  });

  it('should accept extra properties by default', () => {
    const dealWithExtra = {
      name: 'Test Deal',
      value: 1000,
      extraProp: 'this is allowed by default in Zod'
    };

    const result = Deal.safeParse(dealWithExtra);
    expect(result.success).toBe(true);
  });
});

describe('DealWithId Schema', () => {
  it('should validate a valid deal with ID', () => {
    const validDealWithId = {
      id: 1,
      name: 'Test Deal',
      value: 1000
    };

    const result = DealWithId.safeParse(validDealWithId);
    expect(result.success).toBe(true);
  });

  it('should fail when id is missing', () => {
    const dealWithoutId = {
      name: 'Test Deal',
      value: 1000
    };

    const result = DealWithId.safeParse(dealWithoutId);
    expect(result.success).toBe(false);
  });

  it('should fail when id is not a number', () => {
    const dealWithInvalidId = {
      id: 'not a number',
      name: 'Test Deal',
      value: 1000
    };

    const result = DealWithId.safeParse(dealWithInvalidId);
    expect(result.success).toBe(false);
  });
});

describe('DealsResponse Schema', () => {
  it('should validate a valid response with deals array', () => {
    const validResponse = {
      deals: [
        { id: 1, name: 'Deal 1', value: 100 },
        { id: 2, name: 'Deal 2', value: 200 }
      ],
      message: 'Deals retrieved successfully'
    };

    const result = DealsResponse.safeParse(validResponse);
    expect(result.success).toBe(true);
  });

  it('should validate a response with empty deals array', () => {
    const emptyResponse = {
      deals: [],
      message: 'No deals found'
    };

    const result = DealsResponse.safeParse(emptyResponse);
    expect(result.success).toBe(true);
  });

  it('should validate a response without message', () => {
    const responseWithoutMessage = {
      deals: [
        { id: 1, name: 'Deal 1', value: 100 }
      ]
    };

    const result = DealsResponse.safeParse(responseWithoutMessage);
    expect(result.success).toBe(true);
  });

  it('should fail when deals is not an array', () => {
    const invalidResponse = {
      deals: 'not an array',
      message: 'Invalid deals'
    };

    const result = DealsResponse.safeParse(invalidResponse);
    expect(result.success).toBe(false);
  });

  it('should fail when array contains invalid deals', () => {
    const responseWithInvalidDeals = {
      deals: [
        { id: 1, name: 'Deal 1', value: 100 },
        { id: 'not a number', name: 'Deal 2', value: 200 }
      ],
      message: 'Some deals are invalid'
    };

    const result = DealsResponse.safeParse(responseWithInvalidDeals);
    expect(result.success).toBe(false);
  });
});