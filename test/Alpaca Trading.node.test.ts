/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { AlpacaTrading } from '../nodes/Alpaca Trading/Alpaca Trading.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('AlpacaTrading Node', () => {
  let node: AlpacaTrading;

  beforeAll(() => {
    node = new AlpacaTrading();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Alpaca Trading');
      expect(node.description.name).toBe('alpacatrading');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        apiSecret: 'test-secret',
        baseUrl: 'https://paper-api.alpaca.markets'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  it('should get account information successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAccount');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: '123',
      account_number: 'ACC123',
      status: 'ACTIVE'
    });

    const items = [{ json: {} }];
    const result = await executeAccountOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.id).toBe('123');
  });

  it('should get portfolio history successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getPortfolioHistory')
      .mockReturnValueOnce('1M')
      .mockReturnValueOnce('1D')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(false);
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      timestamp: [1234567890],
      equity: [10000],
      profit_loss: [500]
    });

    const items = [{ json: {} }];
    const result = await executeAccountOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.timestamp).toEqual([1234567890]);
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAccount');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];
    const result = await executeAccountOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAccount');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];
    
    await expect(executeAccountOperations.call(mockExecuteFunctions, items))
      .rejects.toThrow('API Error');
  });

  it('should update account configurations successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateAccountConfigurations')
      .mockReturnValueOnce('none')
      .mockReturnValueOnce('all')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce('4');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      dtbp: 'none',
      trade_confirm_email: 'all'
    });

    const items = [{ json: {} }];
    const result = await executeAccountOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.dtbp).toBe('none');
  });
});

describe('Order Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        apiSecret: 'test-secret',
        baseUrl: 'https://paper-api.alpaca.markets'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  it('should create an order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'createOrder',
        symbol: 'AAPL',
        qty: 10,
        side: 'buy',
        type: 'market',
        time_in_force: 'day',
        limit_price: 0,
        stop_price: 0,
        extended_hours: false,
        client_order_id: '',
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'order123',
      symbol: 'AAPL',
      qty: '10',
      side: 'buy',
      status: 'accepted'
    });

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.id).toBe('order123');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://paper-api.alpaca.markets/v2/orders',
      headers: {
        'APCA-API-KEY-ID': 'test-key',
        'APCA-API-SECRET-KEY': 'test-secret',
        'Content-Type': 'application/json',
      },
      body: {
        symbol: 'AAPL',
        qty: 10,
        side: 'buy',
        type: 'market',
        time_in_force: 'day',
      },
      json: true,
    });
  });

  it('should get all orders successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'getAllOrders',
        status: 'open',
        limit: 50,
        after: '',
        until: '',
        direction: 'desc',
        nested: true,
        symbols: '',
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([
      { id: 'order1', symbol: 'AAPL' },
      { id: 'order2', symbol: 'GOOGL' }
    ]);

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(Array.isArray(result[0].json)).toBe(true);
    expect(result[0].json).toHaveLength(2);
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('createOrder');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('createOrder');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(
      executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });
});

describe('Position Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				apiSecret: 'test-api-secret',
				baseUrl: 'https://paper-api.alpaca.markets'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn()
			},
		};
	});

	it('should get all positions successfully', async () => {
		const mockPositions = [{ symbol: 'AAPL', qty: '10', market_value: '1500' }];
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllPositions');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockPositions);

		const result = await executePositionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockPositions);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://paper-api.alpaca.markets/v2/positions',
			headers: {
				'APCA-API-KEY-ID': 'test-api-key',
				'APCA-API-SECRET-KEY': 'test-api-secret',
			},
			json: true,
		});
	});

	it('should get specific position successfully', async () => {
		const mockPosition = { symbol: 'AAPL', qty: '10', market_value: '1500' };
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getPosition')
			.mockReturnValueOnce('AAPL');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockPosition);

		const result = await executePositionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockPosition);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://paper-api.alpaca.markets/v2/positions/AAPL',
			headers: {
				'APCA-API-KEY-ID': 'test-api-key',
				'APCA-API-SECRET-KEY': 'test-api-secret',
			},
			json: true,
		});
	});

	it('should close all positions successfully', async () => {
		const mockResponse = [{ symbol: 'AAPL', status: 'closed' }];
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('closeAllPositions')
			.mockReturnValueOnce(true);
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executePositionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'DELETE',
			url: 'https://paper-api.alpaca.markets/v2/positions',
			headers: {
				'APCA-API-KEY-ID': 'test-api-key',
				'APCA-API-SECRET-KEY': 'test-api-secret',
			},
			qs: { cancel_orders: true },
			json: true,
		});
	});

	it('should close specific position successfully', async () => {
		const mockResponse = { symbol: 'AAPL', status: 'closed' };
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('closePosition')
			.mockReturnValueOnce('AAPL')
			.mockReturnValueOnce('5')
			.mockReturnValueOnce('');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executePositionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'DELETE',
			url: 'https://paper-api.alpaca.markets/v2/positions/AAPL',
			headers: {
				'APCA-API-KEY-ID': 'test-api-key',
				'APCA-API-SECRET-KEY': 'test-api-secret',
			},
			qs: { qty: '5' },
			json: true,
		});
	});

	it('should handle API errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllPositions');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executePositionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ error: 'API Error' });
	});

	it('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

		await expect(
			executePositionOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('Unknown operation: unknownOperation');
	});
});

describe('Asset Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        apiSecret: 'test-secret',
        baseUrl: 'https://paper-api.alpaca.markets'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getAllAssets operation', () => {
    it('should successfully get all assets', async () => {
      const mockResponse = [
        {
          id: '123',
          class: 'us_equity',
          exchange: 'NASDAQ',
          symbol: 'AAPL',
          name: 'Apple Inc.',
          status: 'active'
        }
      ];

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllAssets')
        .mockReturnValueOnce('active')
        .mockReturnValueOnce('us_equity')
        .mockReturnValueOnce('NASDAQ');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://paper-api.alpaca.markets/v2/assets?status=active&asset_class=us_equity&exchange=NASDAQ',
        headers: {
          'APCA-API-KEY-ID': 'test-key',
          'APCA-API-SECRET-KEY': 'test-secret',
          'Content-Type': 'application/json'
        },
        json: true
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle errors in getAllAssets operation', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllAssets')
        .mockReturnValueOnce('active')
        .mockReturnValueOnce('us_equity')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getAsset operation', () => {
    it('should successfully get a specific asset', async () => {
      const mockResponse = {
        id: '123',
        class: 'us_equity',
        exchange: 'NASDAQ',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        status: 'active'
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAsset')
        .mockReturnValueOnce('AAPL');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://paper-api.alpaca.markets/v2/assets/AAPL',
        headers: {
          'APCA-API-KEY-ID': 'test-key',
          'APCA-API-SECRET-KEY': 'test-secret',
          'Content-Type': 'application/json'
        },
        json: true
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle errors in getAsset operation', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAsset')
        .mockReturnValueOnce('INVALID');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Asset not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Asset not found' },
        pairedItem: { item: 0 }
      }]);
    });
  });
});

describe('MarketData Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKeyId: 'test-key-id',
        apiSecretKey: 'test-secret-key',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  it('should get stock bars successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getStockBars')
      .mockReturnValueOnce('AAPL')
      .mockReturnValueOnce('1Day')
      .mockReturnValueOnce('2024-01-01')
      .mockReturnValueOnce('2024-01-02')
      .mockReturnValueOnce({});

    const mockResponse = {
      bars: {
        AAPL: [
          {
            t: '2024-01-01T00:00:00Z',
            o: 150.0,
            h: 155.0,
            l: 149.0,
            c: 154.0,
            v: 1000000,
          },
        ],
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://data.alpaca.markets/v2/stocks/AAPL/bars',
      headers: {
        'APCA-API-KEY-ID': 'test-key-id',
        'APCA-API-SECRET-KEY': 'test-secret-key',
        'Content-Type': 'application/json',
      },
      qs: {
        timeframe: '1Day',
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-01-02T00:00:00.000Z',
      },
      json: true,
    });
  });

  it('should get stock quotes successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getStockQuotes')
      .mockReturnValueOnce('AAPL')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce({});

    const mockResponse = {
      quotes: {
        AAPL: [
          {
            t: '2024-01-01T09:30:00Z',
            ax: 'NYSE',
            ap: 150.5,
            as: 100,
            bx: 'NYSE',
            bp: 150.0,
            bs: 200,
          },
        ],
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getStockBars')
      .mockReturnValueOnce('AAPL')
      .mockReturnValueOnce('1Day')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce({});

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('API Error'),
    );

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getStockBars')
      .mockReturnValueOnce('AAPL')
      .mockReturnValueOnce('1Day')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce({});

    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('API Error'),
    );

    await expect(
      executeMarketDataOperations.call(mockExecuteFunctions, [{ json: {} }]),
    ).rejects.toThrow('API Error');
  });

  it('should get crypto bars successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCryptoBars')
      .mockReturnValueOnce('BTC/USD')
      .mockReturnValueOnce('1Hour')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce({});

    const mockResponse = {
      bars: {
        'BTC/USD': [
          {
            t: '2024-01-01T00:00:00Z',
            o: 45000.0,
            h: 46000.0,
            l: 44500.0,
            c: 45500.0,
            v: 100.5,
          },
        ],
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });
});

describe('Watchlist Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        keyId: 'test-key-id',
        secretKey: 'test-secret-key',
        baseUrl: 'https://paper-api.alpaca.markets',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAllWatchlists', () => {
    it('should get all watchlists successfully', async () => {
      const mockWatchlists = [{ id: '1', name: 'My Watchlist', symbols: ['AAPL', 'GOOGL'] }];
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllWatchlists');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockWatchlists);

      const result = await executeWatchlistOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockWatchlists, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://paper-api.alpaca.markets/v2/watchlists',
        headers: {
          'APCA-API-KEY-ID': 'test-key-id',
          'APCA-API-SECRET-KEY': 'test-secret-key',
        },
        json: true,
      });
    });

    it('should handle errors when getting watchlists', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllWatchlists');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeWatchlistOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('createWatchlist', () => {
    it('should create a watchlist successfully', async () => {
      const mockWatchlist = { id: '1', name: 'My Watchlist', symbols: ['AAPL', 'GOOGL'] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createWatchlist')
        .mockReturnValueOnce('My Watchlist')
        .mockReturnValueOnce('AAPL,GOOGL');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockWatchlist);

      const result = await executeWatchlistOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockWatchlist, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://paper-api.alpaca.markets/v2/watchlists',
        headers: {
          'APCA-API-KEY-ID': 'test-key-id',
          'APCA-API-SECRET-KEY': 'test-secret-key',
        },
        body: {
          name: 'My Watchlist',
          symbols: ['AAPL', 'GOOGL'],
        },
        json: true,
      });
    });
  });

  describe('getWatchlist', () => {
    it('should get a specific watchlist successfully', async () => {
      const mockWatchlist = { id: '1', name: 'My Watchlist', symbols: ['AAPL', 'GOOGL'] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getWatchlist')
        .mockReturnValueOnce('1');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockWatchlist);

      const result = await executeWatchlistOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockWatchlist, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://paper-api.alpaca.markets/v2/watchlists/1',
        headers: {
          'APCA-API-KEY-ID': 'test-key-id',
          'APCA-API-SECRET-KEY': 'test-secret-key',
        },
        json: true,
      });
    });
  });

  describe('updateWatchlist', () => {
    it('should update a watchlist successfully', async () => {
      const mockWatchlist = { id: '1', name: 'Updated Watchlist', symbols: ['AAPL', 'MSFT'] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateWatchlist')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('Updated Watchlist')
        .mockReturnValueOnce('AAPL,MSFT');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockWatchlist);

      const result = await executeWatchlistOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockWatchlist, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://paper-api.alpaca.markets/v2/watchlists/1',
        headers: {
          'APCA-API-KEY-ID': 'test-key-id',
          'APCA-API-SECRET-KEY': 'test-secret-key',
        },
        body: {
          name: 'Updated Watchlist',
          symbols: ['AAPL', 'MSFT'],
        },
        json: true,
      });
    });
  });

  describe('deleteWatchlist', () => {
    it('should delete a watchlist successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteWatchlist')
        .mockReturnValueOnce('1');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});

      const result = await executeWatchlistOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: {}, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://paper-api.alpaca.markets/v2/watchlists/1',
        headers: {
          'APCA-API-KEY-ID': 'test-key-id',
          'APCA-API-SECRET-KEY': 'test-secret-key',
        },
        json: true,
      });
    });
  });

  describe('addToWatchlist', () => {
    it('should add symbol to watchlist successfully', async () => {
      const mockResponse = { symbol: 'TSLA' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('addToWatchlist')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('TSLA');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeWatchlistOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://paper-api.alpaca.markets/v2/watchlists/1',
        headers: {
          'APCA-API-KEY-ID': 'test-key-id',
          'APCA-API-SECRET-KEY': 'test-secret-key',
        },
        body: {
          symbol: 'TSLA',
        },
        json: true,
      });
    });
  });

  describe('removeFromWatchlist', () => {
    it('should remove symbol from watchlist successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('removeFromWatchlist')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('TSLA');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});

      const result = await executeWatchlistOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: {}, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://paper-api.alpaca.markets/v2/watchlists/1/TSLA',
        headers: {
          'APCA-API-KEY-ID': 'test-key-id',
          'APCA-API-SECRET-KEY': 'test-secret-key',
        },
        json: true,
      });
    });
  });
});
});
