/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-alpacatrading/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class AlpacaTrading implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Alpaca Trading',
    name: 'alpacatrading',
    icon: 'file:alpacatrading.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Alpaca Trading API',
    defaults: {
      name: 'Alpaca Trading',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'alpacatradingApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Order',
            value: 'order',
          },
          {
            name: 'Position',
            value: 'position',
          },
          {
            name: 'Asset',
            value: 'asset',
          },
          {
            name: 'MarketData',
            value: 'marketData',
          },
          {
            name: 'Watchlist',
            value: 'watchlist',
          }
        ],
        default: 'account',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    {
      name: 'Get Account',
      value: 'getAccount',
      description: 'Get account information',
      action: 'Get account information',
    },
    {
      name: 'Get Portfolio History',
      value: 'getPortfolioHistory',
      description: 'Get portfolio history',
      action: 'Get portfolio history',
    },
    {
      name: 'Get Account Configurations',
      value: 'getAccountConfigurations',
      description: 'Get account configurations',
      action: 'Get account configurations',
    },
    {
      name: 'Update Account Configurations',
      value: 'updateAccountConfigurations',
      description: 'Update account configurations',
      action: 'Update account configurations',
    },
  ],
  default: 'getAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['order'] } },
  options: [
    { name: 'Create Order', value: 'createOrder', description: 'Submit an order', action: 'Create an order' },
    { name: 'Get All Orders', value: 'getAllOrders', description: 'Get all orders', action: 'Get all orders' },
    { name: 'Get Order', value: 'getOrder', description: 'Get an order by ID', action: 'Get an order' },
    { name: 'Update Order', value: 'updateOrder', description: 'Replace an order', action: 'Update an order' },
    { name: 'Delete Order', value: 'deleteOrder', description: 'Cancel an order', action: 'Delete an order' },
    { name: 'Delete All Orders', value: 'deleteAllOrders', description: 'Cancel all open orders', action: 'Delete all orders' }
  ],
  default: 'createOrder',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['position'] } },
	options: [
		{
			name: 'Get All Positions',
			value: 'getAllPositions',
			description: 'Get all open positions',
			action: 'Get all positions'
		},
		{
			name: 'Get Position',
			value: 'getPosition',
			description: 'Get an open position by symbol or asset ID',
			action: 'Get a position'
		},
		{
			name: 'Close All Positions',
			value: 'closeAllPositions',
			description: 'Close all open positions',
			action: 'Close all positions'
		},
		{
			name: 'Close Position',
			value: 'closePosition',
			description: 'Close a specific position',
			action: 'Close a position'
		}
	],
	default: 'getAllPositions',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['asset'] } },
  options: [
    {
      name: 'Get All Assets',
      value: 'getAllAssets',
      description: 'Retrieve all tradeable assets',
      action: 'Get all assets'
    },
    {
      name: 'Get Asset',
      value: 'getAsset',
      description: 'Get information about a specific asset',
      action: 'Get an asset'
    }
  ],
  default: 'getAllAssets',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['marketData'] } },
  options: [
    { name: 'Get Stock Bars', value: 'getStockBars', description: 'Get stock bars data', action: 'Get stock bars' },
    { name: 'Get Stock Quotes', value: 'getStockQuotes', description: 'Get stock quotes data', action: 'Get stock quotes' },
    { name: 'Get Stock Trades', value: 'getStockTrades', description: 'Get stock trades data', action: 'Get stock trades' },
    { name: 'Get Option Bars', value: 'getOptionBars', description: 'Get option bars data', action: 'Get option bars' },
    { name: 'Get Crypto Bars', value: 'getCryptoBars', description: 'Get crypto bars data', action: 'Get crypto bars' },
  ],
  default: 'getStockBars',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['watchlist'] } },
  options: [
    { name: 'Get All Watchlists', value: 'getAllWatchlists', description: 'Get all watchlists', action: 'Get all watchlists' },
    { name: 'Create Watchlist', value: 'createWatchlist', description: 'Create a new watchlist', action: 'Create watchlist' },
    { name: 'Get Watchlist', value: 'getWatchlist', description: 'Get a specific watchlist', action: 'Get watchlist' },
    { name: 'Update Watchlist', value: 'updateWatchlist', description: 'Update an existing watchlist', action: 'Update watchlist' },
    { name: 'Delete Watchlist', value: 'deleteWatchlist', description: 'Delete a watchlist', action: 'Delete watchlist' },
    { name: 'Add to Watchlist', value: 'addToWatchlist', description: 'Add a symbol to a watchlist', action: 'Add to watchlist' },
    { name: 'Remove from Watchlist', value: 'removeFromWatchlist', description: 'Remove a symbol from a watchlist', action: 'Remove from watchlist' },
  ],
  default: 'getAllWatchlists',
},
{
  displayName: 'Period',
  name: 'period',
  type: 'options',
  displayOptions: { show: { resource: ['account'], operation: ['getPortfolioHistory'] } },
  options: [
    { name: '1 Month', value: '1M' },
    { name: '3 Months', value: '3M' },
    { name: '6 Months', value: '6M' },
    { name: '1 Year', value: '1A' },
    { name: 'All', value: 'all' },
  ],
  default: '1M',
  description: 'The duration of the data in number of bars',
},
{
  displayName: 'Timeframe',
  name: 'timeframe',
  type: 'options',
  displayOptions: { show: { resource: ['account'], operation: ['getPortfolioHistory'] } },
  options: [
    { name: '1 Minute', value: '1Min' },
    { name: '5 Minutes', value: '5Min' },
    { name: '15 Minutes', value: '15Min' },
    { name: '1 Hour', value: '1H' },
    { name: '1 Day', value: '1D' },
  ],
  default: '1D',
  description: 'The resolution of time window',
},
{
  displayName: 'End Date',
  name: 'endDate',
  type: 'string',
  displayOptions: { show: { resource: ['account'], operation: ['getPortfolioHistory'] } },
  default: '',
  description: 'The end date for the data in RFC3339 format. If not provided, data is returned up to the current market date.',
},
{
  displayName: 'Extended Hours',
  name: 'extendedHours',
  type: 'boolean',
  displayOptions: { show: { resource: ['account'], operation: ['getPortfolioHistory'] } },
  default: false,
  description: 'If true, include extended hours trading data',
},
{
  displayName: 'Day Trade Buying Power',
  name: 'dtbp',
  type: 'string',
  displayOptions: { show: { resource: ['account'], operation: ['updateAccountConfigurations'] } },
  default: '',
  description: 'Day trade buying power',
},
{
  displayName: 'Trade Confirm Email',
  name: 'tradeConfirmEmail',
  type: 'options',
  displayOptions: { show: { resource: ['account'], operation: ['updateAccountConfigurations'] } },
  options: [
    { name: 'All', value: 'all' },
    { name: 'None', value: 'none' },
  ],
  default: 'all',
  description: 'Trade confirmation email preference',
},
{
  displayName: 'Suspend Trade',
  name: 'suspendTrade',
  type: 'boolean',
  displayOptions: { show: { resource: ['account'], operation: ['updateAccountConfigurations'] } },
  default: false,
  description: 'If true, trading is suspended',
},
{
  displayName: 'Max Margin Multiplier',
  name: 'maxMarginMultiplier',
  type: 'string',
  displayOptions: { show: { resource: ['account'], operation: ['updateAccountConfigurations'] } },
  default: '',
  description: 'Maximum margin multiplier',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  default: '',
  description: 'The stock symbol',
},
{
  displayName: 'Quantity',
  name: 'qty',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder', 'updateOrder'] } },
  default: 1,
  description: 'The number of shares',
},
{
  displayName: 'Side',
  name: 'side',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  options: [
    { name: 'Buy', value: 'buy' },
    { name: 'Sell', value: 'sell' }
  ],
  default: 'buy',
  description: 'Buy or sell',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  options: [
    { name: 'Market', value: 'market' },
    { name: 'Limit', value: 'limit' },
    { name: 'Stop', value: 'stop' },
    { name: 'Stop Limit', value: 'stop_limit' }
  ],
  default: 'market',
  description: 'Order type',
},
{
  displayName: 'Time in Force',
  name: 'time_in_force',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder', 'updateOrder'] } },
  options: [
    { name: 'Day', value: 'day' },
    { name: 'GTC', value: 'gtc' },
    { name: 'IOC', value: 'ioc' },
    { name: 'FOK', value: 'fok' }
  ],
  default: 'day',
  description: 'Time in force',
},
{
  displayName: 'Limit Price',
  name: 'limit_price',
  type: 'number',
  displayOptions: { show: { resource: ['order'], operation: ['createOrder', 'updateOrder'] } },
  default: 0,
  description: 'Limit price (required for limit orders)',
},
{
  displayName: 'Stop Price',
  name: 'stop_price',
  type: 'number',
  displayOptions: { show: { resource: ['order'], operation: ['createOrder', 'updateOrder'] } },
  default: 0,
  description: 'Stop price (required for stop orders)',
},
{
  displayName: 'Extended Hours',
  name: 'extended_hours',
  type: 'boolean',
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  default: false,
  description: 'Allow extended hours trading',
},
{
  displayName: 'Client Order ID',
  name: 'client_order_id',
  type: 'string',
  displayOptions: { show: { resource: ['order'], operation: ['createOrder', 'updateOrder'] } },
  default: '',
  description: 'Client order ID',
},
{
  displayName: 'Order ID',
  name: 'order_id',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['getOrder', 'updateOrder', 'deleteOrder'] } },
  default: '',
  description: 'The order ID',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders'] } },
  options: [
    { name: 'Open', value: 'open' },
    { name: 'Closed', value: 'closed' },
    { name: 'All', value: 'all' }
  ],
  default: 'open',
  description: 'Order status filter',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders'] } },
  default: 50,
  description: 'Maximum number of orders to return',
},
{
  displayName: 'After',
  name: 'after',
  type: 'string',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders'] } },
  default: '',
  description: 'Filter orders after this date (RFC3339 format)',
},
{
  displayName: 'Until',
  name: 'until',
  type: 'string',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders'] } },
  default: '',
  description: 'Filter orders until this date (RFC3339 format)',
},
{
  displayName: 'Direction',
  name: 'direction',
  type: 'options',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders'] } },
  options: [
    { name: 'Ascending', value: 'asc' },
    { name: 'Descending', value: 'desc' }
  ],
  default: 'desc',
  description: 'Sort direction',
},
{
  displayName: 'Nested',
  name: 'nested',
  type: 'boolean',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders', 'getOrder'] } },
  default: true,
  description: 'Include nested multi-leg orders',
},
{
  displayName: 'Symbols',
  name: 'symbols',
  type: 'string',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders'] } },
  default: '',
  description: 'Comma-separated list of symbols to filter by',
},
{
	displayName: 'Symbol or Asset ID',
	name: 'symbolOrAssetId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['position'],
			operation: ['getPosition', 'closePosition']
		}
	},
	default: '',
	description: 'The symbol or asset ID of the position'
},
{
	displayName: 'Cancel Orders',
	name: 'cancelOrders',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['position'],
			operation: ['closeAllPositions']
		}
	},
	default: true,
	description: 'Whether to cancel all open orders before closing positions'
},
{
	displayName: 'Quantity',
	name: 'qty',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['position'],
			operation: ['closePosition']
		}
	},
	default: '',
	description: 'Number of shares to liquidate (leave empty to close entire position)'
},
{
	displayName: 'Percentage',
	name: 'percentage',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['position'],
			operation: ['closePosition']
		}
	},
	default: '',
	description: 'Percentage of shares to liquidate (leave empty to close entire position)'
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['getAllAssets']
    }
  },
  options: [
    {
      name: 'Active',
      value: 'active'
    },
    {
      name: 'Inactive',
      value: 'inactive'
    }
  ],
  default: 'active',
  description: 'Filter assets by status'
},
{
  displayName: 'Asset Class',
  name: 'assetClass',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['getAllAssets']
    }
  },
  options: [
    {
      name: 'US Equity',
      value: 'us_equity'
    },
    {
      name: 'Crypto',
      value: 'crypto'
    },
    {
      name: 'US Option',
      value: 'us_option'
    }
  ],
  default: 'us_equity',
  description: 'Filter assets by asset class'
},
{
  displayName: 'Exchange',
  name: 'exchange',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['getAllAssets']
    }
  },
  default: '',
  description: 'Filter assets by exchange (e.g., NASDAQ, NYSE)'
},
{
  displayName: 'Symbol or Asset ID',
  name: 'symbolOrAssetId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['getAsset']
    }
  },
  default: '',
  description: 'The symbol (e.g., AAPL) or asset ID to retrieve'
},
{
  displayName: 'Symbols',
  name: 'symbols',
  type: 'string',
  required: true,
  default: '',
  description: 'Comma separated list of symbols to get data for',
  displayOptions: {
    show: {
      resource: ['marketData'],
      operation: ['getStockBars', 'getStockQuotes', 'getStockTrades', 'getOptionBars', 'getCryptoBars']
    }
  },
},
{
  displayName: 'Timeframe',
  name: 'timeframe',
  type: 'options',
  required: true,
  default: '1Day',
  options: [
    { name: '1 Minute', value: '1Min' },
    { name: '5 Minutes', value: '5Min' },
    { name: '15 Minutes', value: '15Min' },
    { name: '30 Minutes', value: '30Min' },
    { name: '1 Hour', value: '1Hour' },
    { name: '1 Day', value: '1Day' },
    { name: '1 Week', value: '1Week' },
    { name: '1 Month', value: '1Month' },
  ],
  description: 'The timeframe for the bars',
  displayOptions: {
    show: {
      resource: ['marketData'],
      operation: ['getStockBars', 'getOptionBars', 'getCryptoBars']
    }
  },
},
{
  displayName: 'Start Date',
  name: 'start',
  type: 'dateTime',
  default: '',
  description: 'Start date for the data (RFC-3339 format)',
  displayOptions: {
    show: {
      resource: ['marketData'],
      operation: ['getStockBars', 'getStockQuotes', 'getStockTrades', 'getOptionBars', 'getCryptoBars']
    }
  },
},
{
  displayName: 'End Date',
  name: 'end',
  type: 'dateTime',
  default: '',
  description: 'End date for the data (RFC-3339 format)',
  displayOptions: {
    show: {
      resource: ['marketData'],
      operation: ['getStockBars', 'getStockQuotes', 'getStockTrades', 'getOptionBars', 'getCryptoBars']
    }
  },
},
{
  displayName: 'Additional Options',
  name: 'additionalOptions',
  type: 'collection',
  default: {},
  placeholder: 'Add Option',
  options: [
    {
      displayName: 'Adjustment',
      name: 'adjustment',
      type: 'options',
      default: 'raw',
      options: [
        { name: 'Raw', value: 'raw' },
        { name: 'Split', value: 'split' },
        { name: 'Dividend', value: 'dividend' },
        { name: 'All', value: 'all' },
      ],
      description: 'Price adjustment type',
    },
    {
      displayName: 'As Of',
      name: 'asof',
      type: 'dateTime',
      default: '',
      description: 'As of date for the data',
    },
    {
      displayName: 'Feed',
      name: 'feed',
      type: 'options',
      default: 'sip',
      options: [
        { name: 'SIP', value: 'sip' },
        { name: 'IEX', value: 'iex' },
      ],
      description: 'The data feed to use',
    },
    {
      displayName: 'Sort',
      name: 'sort',
      type: 'options',
      default: 'asc',
      options: [
        { name: 'Ascending', value: 'asc' },
        { name: 'Descending', value: 'desc' },
      ],
      description: 'Sort order',
    },
    {
      displayName: 'Limit',
      name: 'limit',
      type: 'number',
      default: 1000,
      typeOptions: { minValue: 1, maxValue: 10000 },
      description: 'Maximum number of data points to return',
    },
  ],
  displayOptions: {
    show: {
      resource: ['marketData'],
      operation: ['getStockBars', 'getStockQuotes', 'getStockTrades', 'getOptionBars', 'getCryptoBars']
    }
  },
},
{
  displayName: 'Watchlist Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['watchlist'], 
      operation: ['createWatchlist', 'updateWatchlist'] 
    } 
  },
  default: '',
  description: 'Name of the watchlist',
},
{
  displayName: 'Symbols',
  name: 'symbols',
  type: 'string',
  displayOptions: { 
    show: { 
      resource: ['watchlist'], 
      operation: ['createWatchlist', 'updateWatchlist'] 
    } 
  },
  default: '',
  description: 'Comma-separated list of symbols to include in the watchlist',
},
{
  displayName: 'Watchlist ID',
  name: 'watchlistId',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['watchlist'], 
      operation: ['getWatchlist', 'updateWatchlist', 'deleteWatchlist', 'addToWatchlist', 'removeFromWatchlist'] 
    } 
  },
  default: '',
  description: 'ID of the watchlist',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['watchlist'], 
      operation: ['addToWatchlist', 'removeFromWatchlist'] 
    } 
  },
  default: '',
  description: 'Symbol to add or remove from the watchlist',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'order':
        return [await executeOrderOperations.call(this, items)];
      case 'position':
        return [await executePositionOperations.call(this, items)];
      case 'asset':
        return [await executeAssetOperations.call(this, items)];
      case 'marketData':
        return [await executeMarketDataOperations.call(this, items)];
      case 'watchlist':
        return [await executeWatchlistOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('alpacatradingApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAccount': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/account`,
            headers: {
              'APCA-API-KEY-ID': credentials.apiKey,
              'APCA-API-SECRET-KEY': credentials.apiSecret,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPortfolioHistory': {
          const period = this.getNodeParameter('period', i) as string;
          const timeframe = this.getNodeParameter('timeframe', i) as string;
          const endDate = this.getNodeParameter('endDate', i) as string;
          const extendedHours = this.getNodeParameter('extendedHours', i) as boolean;

          const params = new URLSearchParams();
          params.append('period', period);
          params.append('timeframe', timeframe);
          if (endDate) params.append('end', endDate);
          if (extendedHours) params.append('extended_hours', 'true');

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/account/portfolio/history?${params.toString()}`,
            headers: {
              'APCA-API-KEY-ID': credentials.apiKey,
              'APCA-API-SECRET-KEY': credentials.apiSecret,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountConfigurations': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/account/configurations`,
            headers: {
              'APCA-API-KEY-ID': credentials.apiKey,
              'APCA-API-SECRET-KEY': credentials.apiSecret,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateAccountConfigurations': {
          const body: any = {};
          
          const dtbp = this.getNodeParameter('dtbp', i) as string;
          const tradeConfirmEmail = this.getNodeParameter('tradeConfirmEmail', i) as string;
          const suspendTrade = this.getNodeParameter('suspendTrade', i) as boolean;
          const maxMarginMultiplier = this.getNodeParameter('maxMarginMultiplier', i) as string;

          if (dtbp) body.dtbp = dtbp;
          if (tradeConfirmEmail) body.trade_confirm_email = tradeConfirmEmail;
          if (suspendTrade !== undefined) body.suspend_trade = suspendTrade;
          if (maxMarginMultiplier) body.max_margin_multiplier = maxMarginMultiplier;

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/v2/account/configurations`,
            headers: {
              'APCA-API-KEY-ID': credentials.apiKey,
              'APCA-API-SECRET-KEY': credentials.apiSecret,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeOrderOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('alpacatradingApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createOrder': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const qty = this.getNodeParameter('qty', i) as number;
          const side = this.getNodeParameter('side', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const timeInForce = this.getNodeParameter('time_in_force', i) as string;
          const limitPrice = this.getNodeParameter('limit_price', i) as number;
          const stopPrice = this.getNodeParameter('stop_price', i) as number;
          const extendedHours = this.getNodeParameter('extended_hours', i) as boolean;
          const clientOrderId = this.getNodeParameter('client_order_id', i) as string;

          const body: any = {
            symbol,
            qty,
            side,
            type,
            time_in_force: timeInForce,
          };

          if (limitPrice) body.limit_price = limitPrice.toString();
          if (stopPrice) body.stop_price = stopPrice.toString();
          if (extendedHours) body.extended_hours = extendedHours;
          if (clientOrderId) body.client_order_id = clientOrderId;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/orders`,
            headers: {
              'APCA-API-KEY-ID': credentials.apiKey,
              'APCA-API-SECRET-KEY': credentials.apiSecret,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllOrders': {
          const status = this.getNodeParameter('status', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const after = this.getNodeParameter('after', i) as string;
          const until = this.getNodeParameter('until', i) as string;
          const direction = this.getNodeParameter('direction', i) as string;
          const nested = this.getNodeParameter('nested', i) as boolean;
          const symbols = this.getNodeParameter('symbols', i) as string;

          const params: any = {};
          if (status) params.status = status;
          if (limit) params.limit = limit;
          if (after) params.after = after;
          if (until) params.until = until;
          if (direction) params.direction = direction;
          if (nested !== undefined) params.nested = nested;
          if (symbols) params.symbols = symbols;

          const queryString = new URLSearchParams(params).toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/orders${queryString ? '?' + queryString : ''}`,
            headers: {
              'APCA-API-KEY-ID': credentials.apiKey,
              'APCA-API-SECRET-KEY': credentials.apiSecret,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrder': {
          const orderId = this.getNodeParameter('order_id', i) as string;
          const nested = this.getNodeParameter('nested', i) as boolean;

          const params: any = {};
          if (nested !== undefined) params.nested = nested;

          const queryString = new URLSearchParams(params).toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/orders/${orderId}${queryString ? '?' + queryString : ''}`,
            headers: {
              'APCA-API-KEY-ID': credentials.apiKey,
              'APCA-API-SECRET-KEY': credentials.apiSecret,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateOrder': {
          const orderId = this.getNodeParameter('order_id', i) as string;
          const qty = this.getNodeParameter('qty', i) as number;
          const timeInForce = this.getNodeParameter('time_in_force', i) as string;
          const limitPrice = this.getNodeParameter('limit_price', i) as number;
          const stopPrice = this.getNodeParameter('stop_price', i) as number;
          const clientOrderId = this.getNodeParameter('client_order_id', i) as string;

          const body: any = {
            qty,
            time_in_force: timeInForce,
          };

          if (limitPrice) body.limit_price = limitPrice.toString();
          if (stopPrice) body.stop_price = stopPrice.toString();
          if (clientOrderId) body.client_order_id = clientOrderId;

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/v2/orders/${orderId}`,
            headers: {
              'APCA-API-KEY-ID': credentials.apiKey,
              'APCA-API-SECRET-KEY': credentials.apiSecret,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteOrder': {
          const orderId = this.getNodeParameter('order_id', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/v2/orders/${orderId}`,
            headers: {
              'APCA-API-KEY-ID': credentials.apiKey,
              'APCA-API-SECRET-KEY': credentials.apiSecret,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteAllOrders': {
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/v2/orders`,
            headers: {
              'APCA-API-KEY-ID': credentials.apiKey,
              'APCA-API-SECRET-KEY': credentials.apiSecret,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executePositionOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('alpacatradingApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllPositions': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v2/positions`,
						headers: {
							'APCA-API-KEY-ID': credentials.apiKey,
							'APCA-API-SECRET-KEY': credentials.apiSecret,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getPosition': {
					const symbolOrAssetId = this.getNodeParameter('symbolOrAssetId', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v2/positions/${symbolOrAssetId}`,
						headers: {
							'APCA-API-KEY-ID': credentials.apiKey,
							'APCA-API-SECRET-KEY': credentials.apiSecret,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'closeAllPositions': {
					const cancelOrders = this.getNodeParameter('cancelOrders', i) as boolean;
					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/v2/positions`,
						headers: {
							'APCA-API-KEY-ID': credentials.apiKey,
							'APCA-API-SECRET-KEY': credentials.apiSecret,
						},
						qs: {
							cancel_orders: cancelOrders,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'closePosition': {
					const symbolOrAssetId = this.getNodeParameter('symbolOrAssetId', i) as string;
					const qty = this.getNodeParameter('qty', i, '') as string;
					const percentage = this.getNodeParameter('percentage', i, '') as string;
					
					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/v2/positions/${symbolOrAssetId}`,
						headers: {
							'APCA-API-KEY-ID': credentials.apiKey,
							'APCA-API-SECRET-KEY': credentials.apiSecret,
						},
						json: true,
					};

					const qs: any = {};
					if (qty) qs.qty = qty;
					if (percentage) qs.percentage = percentage;
					if (Object.keys(qs).length > 0) {
						options.qs = qs;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAssetOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('alpacatradingApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllAssets': {
          const status = this.getNodeParameter('status', i) as string;
          const assetClass = this.getNodeParameter('assetClass', i) as string;
          const exchange = this.getNodeParameter('exchange', i) as string;

          const queryParams = new URLSearchParams();
          if (status) queryParams.append('status', status);
          if (assetClass) queryParams.append('asset_class', assetClass);
          if (exchange) queryParams.append('exchange', exchange);

          const queryString = queryParams.toString();
          const url = `${credentials.baseUrl}/v2/assets${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'APCA-API-KEY-ID': credentials.apiKey,
              'APCA-API-SECRET-KEY': credentials.apiSecret,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAsset': {
          const symbolOrAssetId = this.getNodeParameter('symbolOrAssetId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/assets/${symbolOrAssetId}`,
            headers: {
              'APCA-API-KEY-ID': credentials.apiKey,
              'APCA-API-SECRET-KEY': credentials.apiSecret,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeMarketDataOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('alpacatradingApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const symbols = this.getNodeParameter('symbols', i) as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', i) as any;

      const baseUrl = 'https://data.alpaca.markets';
      const headers = {
        'APCA-API-KEY-ID': credentials.apiKeyId,
        'APCA-API-SECRET-KEY': credentials.apiSecretKey,
        'Content-Type': 'application/json',
      };

      const queryParams: any = {};

      // Add common parameters
      const start = this.getNodeParameter('start', i) as string;
      const end = this.getNodeParameter('end', i) as string;
      
      if (start) queryParams.start = new Date(start).toISOString();
      if (end) queryParams.end = new Date(end).toISOString();
      
      if (additionalOptions.asof) queryParams.asof = new Date(additionalOptions.asof).toISOString();
      if (additionalOptions.feed) queryParams.feed = additionalOptions.feed;
      if (additionalOptions.sort) queryParams.sort = additionalOptions.sort;
      if (additionalOptions.limit) queryParams.limit = additionalOptions.limit;

      switch (operation) {
        case 'getStockBars': {
          const timeframe = this.getNodeParameter('timeframe', i) as string;
          queryParams.timeframe = timeframe;
          if (additionalOptions.adjustment) queryParams.adjustment = additionalOptions.adjustment;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v2/stocks/${symbols}/bars`,
            headers,
            qs: queryParams,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getStockQuotes': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v2/stocks/${symbols}/quotes`,
            headers,
            qs: queryParams,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getStockTrades': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v2/stocks/${symbols}/trades`,
            headers,
            qs: queryParams,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOptionBars': {
          const timeframe = this.getNodeParameter('timeframe', i) as string;
          queryParams.symbols = symbols;
          queryParams.timeframe = timeframe;
          if (additionalOptions.adjustment) queryParams.adjustment = additionalOptions.adjustment;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v2/options/bars`,
            headers,
            qs: queryParams,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCryptoBars': {
          const timeframe = this.getNodeParameter('timeframe', i) as string;
          queryParams.timeframe = timeframe;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v2/crypto/${symbols}/bars`,
            headers,
            qs: queryParams,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeWatchlistOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('alpacatradingApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllWatchlists': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/watchlists`,
            headers: {
              'APCA-API-KEY-ID': credentials.keyId,
              'APCA-API-SECRET-KEY': credentials.secretKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'createWatchlist': {
          const name = this.getNodeParameter('name', i) as string;
          const symbolsParam = this.getNodeParameter('symbols', i) as string;
          const symbols = symbolsParam ? symbolsParam.split(',').map((s: string) => s.trim()) : [];
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/watchlists`,
            headers: {
              'APCA-API-KEY-ID': credentials.keyId,
              'APCA-API-SECRET-KEY': credentials.secretKey,
            },
            body: {
              name,
              symbols,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getWatchlist': {
          const watchlistId = this.getNodeParameter('watchlistId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/watchlists/${watchlistId}`,
            headers: {
              'APCA-API-KEY-ID': credentials.keyId,
              'APCA-API-SECRET-KEY': credentials.secretKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'updateWatchlist': {
          const watchlistId = this.getNodeParameter('watchlistId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const symbolsParam = this.getNodeParameter('symbols', i) as string;
          const symbols = symbolsParam ? symbolsParam.split(',').map((s: string) => s.trim()) : [];
          
          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/v2/watchlists/${watchlistId}`,
            headers: {
              'APCA-API-KEY-ID': credentials.keyId,
              'APCA-API-SECRET-KEY': credentials.secretKey,
            },
            body: {
              name,
              symbols,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'deleteWatchlist': {
          const watchlistId = this.getNodeParameter('watchlistId', i) as string;
          
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/v2/watchlists/${watchlistId}`,
            headers: {
              'APCA-API-KEY-ID': credentials.keyId,
              'APCA-API-SECRET-KEY': credentials.secretKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'addToWatchlist': {
          const watchlistId = this.getNodeParameter('watchlistId', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/watchlists/${watchlistId}`,
            headers: {
              'APCA-API-KEY-ID': credentials.keyId,
              'APCA-API-SECRET-KEY': credentials.secretKey,
            },
            body: {
              symbol,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'removeFromWatchlist': {
          const watchlistId = this.getNodeParameter('watchlistId', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/v2/watchlists/${watchlistId}/${symbol}`,
            headers: {
              'APCA-API-KEY-ID': credentials.keyId,
              'APCA-API-SECRET-KEY': credentials.secretKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
