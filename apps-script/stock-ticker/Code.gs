/**
 * Stock Ticker — Google Apps Script Backend
 * ==========================================
 * Fetches live stock quotes server-side (no CORS issues) and serves them to the iframe.
 *
 * HOW TO DEPLOY:
 *  1. Go to https://script.google.com and create a new project.
 *  2. Paste this code into Code.gs.
 *  3. Create a new HTML file named "index" and paste the contents of index.html.
 *  4. Click Deploy → New deployment → Web app.
 *  5. Set "Execute as" = Me, "Who has access" = Anyone.
 *  6. Copy the web app URL and paste it into a Google Sites Embed block.
 *
 * DATA SOURCE OPTIONS (in order of preference):
 *  A) Finnhub  — free tier, up to 60 calls/min. Sign up at https://finnhub.io
 *               Set FINNHUB_API_KEY below.
 *  B) Alpha Vantage — free tier, 25 calls/day. Sign up at https://alphavantage.co
 *               Set ALPHA_VANTAGE_KEY below. Note: 25 calls/day limits to 25 symbols.
 *  C) Simulated data — useful for demos when no API key is set.
 */

// ---------------------------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------------------------

// List of stock symbols to display. Add or remove as needed.
var STOCKS = [
  { symbol: 'AAPL',  name: 'Apple'       },
  { symbol: 'MSFT',  name: 'Microsoft'   },
  { symbol: 'GOOGL', name: 'Alphabet'    },
  { symbol: 'AMZN',  name: 'Amazon'      },
  { symbol: 'META',  name: 'Meta'        },
  { symbol: 'NVDA',  name: 'NVIDIA'      },
  { symbol: 'TSLA',  name: 'Tesla'       },
  { symbol: 'JPM',   name: 'JPMorgan'    },
  { symbol: 'V',     name: 'Visa'        },
  { symbol: 'BRK-B', name: 'Berkshire B' },
];

// Get a free Finnhub key at https://finnhub.io (recommended: 60 calls/min free tier)
var FINNHUB_API_KEY = '';

// Get a free Alpha Vantage key at https://alphavantage.co (25 calls/day free tier)
var ALPHA_VANTAGE_KEY = '';

// Cache duration in seconds
var CACHE_SECONDS = 300; // 5 minutes

// ---------------------------------------------------------------------------


/**
 * Serves the stock ticker HTML page.
 */
function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('index')
    .setTitle('Stock Ticker')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/**
 * Returns stock quotes for all configured symbols.
 * Called from the client via google.script.run.getQuotes().
 *
 * @returns {Array<{symbol, name, price, change, changePct, simulated}>}
 */
function getQuotes() {
  var cache  = CacheService.getScriptCache();
  var cached = cache.get('stock_quotes');
  if (cached) return JSON.parse(cached);

  var results = STOCKS.map(function(stock) {
    var quote = null;

    if (FINNHUB_API_KEY) {
      quote = fetchFinnhub(stock.symbol);
    } else if (ALPHA_VANTAGE_KEY) {
      quote = fetchAlphaVantage(stock.symbol);
    }

    if (!quote) {
      quote = simulateQuote(stock.symbol);
      quote.simulated = true;
    }

    return {
      symbol:    stock.symbol,
      name:      stock.name,
      price:     quote.price,
      change:    quote.change,
      changePct: quote.changePct,
      simulated: quote.simulated || false
    };
  });

  cache.put('stock_quotes', JSON.stringify(results), CACHE_SECONDS);
  return results;
}


/**
 * Fetches a quote from Finnhub.
 * @param {string} symbol
 * @returns {{price, change, changePct}|null}
 */
function fetchFinnhub(symbol) {
  try {
    var url  = 'https://finnhub.io/api/v1/quote?symbol=' + symbol + '&token=' + FINNHUB_API_KEY;
    var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (resp.getResponseCode() !== 200) return null;
    var data = JSON.parse(resp.getContentText());
    if (!data.c || data.c === 0) return null;
    return { price: data.c, change: data.d, changePct: data.dp };
  } catch (e) {
    return null;
  }
}


/**
 * Fetches a quote from Alpha Vantage (GLOBAL_QUOTE endpoint).
 * @param {string} symbol
 * @returns {{price, change, changePct}|null}
 */
function fetchAlphaVantage(symbol) {
  try {
    var url  = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + symbol + '&apikey=' + ALPHA_VANTAGE_KEY;
    var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (resp.getResponseCode() !== 200) return null;
    var data = JSON.parse(resp.getContentText());
    var q    = data['Global Quote'];
    if (!q || !q['05. price'] || !q['09. change'] || !q['10. change percent']) return null;

    var price = parseFloat(q['05. price']);
    var change = parseFloat(q['09. change']);
    var changePct = parseFloat(q['10. change percent'].replace('%', ''));

    if (isNaN(price) || isNaN(change) || isNaN(changePct)) return null;

    return {
      price:     price,
      change:    change,
      changePct: changePct
    };
  } catch (e) {
    return null;
  }
}


/**
 * Generates a deterministic simulated quote (useful for demos).
 * The same symbol produces the same price each hour.
 * @param {string} symbol
 * @returns {{price, change, changePct, simulated: true}}
 */
function simulateQuote(symbol) {
  var seed      = symbol.split('').reduce(function(a, c) { return a + c.charCodeAt(0); }, 0);
  var hour      = new Date().getHours();
  var price     = ((seed % 800) + 50 + Math.sin(seed * hour) * 20);
  var change    = Math.sin(seed + hour) * 3.5;
  var changePct = (change / price) * 100;
  return {
    price:     Math.round(price * 100) / 100,
    change:    Math.round(change * 100) / 100,
    changePct: Math.round(changePct * 100) / 100,
    simulated: true
  };
}
