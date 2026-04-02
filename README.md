# n8n-nodes-alpaca-trading

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with Alpaca Trading platform. This node provides 6 resources with comprehensive trading operations, enabling automated stock trading, portfolio management, and market data retrieval for algorithmic trading workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Trading](https://img.shields.io/badge/Trading-Stock%20Market-green)
![API](https://img.shields.io/badge/Alpaca-Trading%20API-orange)
![Finance](https://img.shields.io/badge/Finance-Automation-purple)

## Features

- **Account Management** - Retrieve account information, buying power, and portfolio details
- **Order Execution** - Place, modify, cancel, and track stock orders with full order lifecycle management
- **Position Monitoring** - Get current positions, profit/loss data, and portfolio allocation
- **Asset Discovery** - Search and retrieve tradable assets with comprehensive market information
- **Real-time Market Data** - Access live quotes, bars, trades, and historical market data
- **Watchlist Management** - Create, update, and manage custom stock watchlists
- **Paper Trading Support** - Test strategies with simulated trading environment
- **Advanced Order Types** - Support for market, limit, stop, and bracket orders

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-alpaca-trading`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-alpaca-trading
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-alpaca-trading.git
cd n8n-nodes-alpaca-trading
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-alpaca-trading
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Alpaca API key from dashboard | Yes |
| Secret Key | Your Alpaca secret key | Yes |
| Environment | Paper trading or live trading environment | Yes |
| Base URL | API endpoint (auto-configured based on environment) | No |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Account | Retrieve account information and status |
| Get Activities | Get account activities and transaction history |
| Get Portfolio History | Retrieve portfolio performance over time |

### 2. Order

| Operation | Description |
|-----------|-------------|
| Place Order | Submit a new stock order |
| Get Order | Retrieve specific order details |
| Get All Orders | List all orders with filtering options |
| Cancel Order | Cancel a pending order |
| Replace Order | Modify an existing order |

### 3. Position

| Operation | Description |
|-----------|-------------|
| Get Position | Get details for a specific position |
| Get All Positions | List all current positions |
| Close Position | Close a specific position |
| Close All Positions | Close all open positions |

### 4. Asset

| Operation | Description |
|-----------|-------------|
| Get Asset | Retrieve information for a specific asset |
| Get All Assets | List all tradable assets |
| Search Assets | Search assets by symbol or name |

### 5. MarketData

| Operation | Description |
|-----------|-------------|
| Get Quote | Get latest quote for a symbol |
| Get Bars | Retrieve historical price bars |
| Get Trades | Get recent trades for a symbol |
| Get Snapshot | Get comprehensive market snapshot |

### 6. Watchlist

| Operation | Description |
|-----------|-------------|
| Create Watchlist | Create a new watchlist |
| Get Watchlist | Retrieve a specific watchlist |
| Get All Watchlists | List all watchlists |
| Update Watchlist | Modify watchlist details |
| Delete Watchlist | Remove a watchlist |
| Add Asset | Add symbol to watchlist |
| Remove Asset | Remove symbol from watchlist |

## Usage Examples

```javascript
// Place a market buy order
{
  "symbol": "AAPL",
  "qty": 10,
  "side": "buy",
  "type": "market",
  "time_in_force": "day"
}
```

```javascript
// Get account information
{
  "operation": "getAccount"
}
```

```javascript
// Get real-time quote for multiple symbols
{
  "symbols": ["AAPL", "GOOGL", "MSFT"],
  "feed": "iex"
}
```

```javascript
// Create a new watchlist with symbols
{
  "name": "Tech Stocks",
  "symbols": ["AAPL", "GOOGL", "MSFT", "AMZN"]
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API credentials | Verify API key and secret in credentials |
| 403 Forbidden | Insufficient permissions | Check account status and trading permissions |
| 422 Unprocessable Entity | Invalid order parameters | Review order details (symbol, quantity, price) |
| 429 Too Many Requests | Rate limit exceeded | Implement delays between requests |
| 40010001 Insufficient Funds | Not enough buying power | Check account balance before placing orders |
| 40010002 Position Not Found | Position doesn't exist | Verify symbol and position existence |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-alpaca-trading/issues)
- **Alpaca API Documentation**: [Alpaca Markets API](https://alpaca.markets/docs/)
- **Trading Community**: [Alpaca Community Forum](https://forum.alpaca.markets/)