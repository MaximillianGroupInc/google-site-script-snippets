# Google Site Script Snippets

A growing collection of **embeddable HTML/CSS/JS widgets** and **Google Apps Script** components for
[Google Sites](https://sites.google.com). Drop any snippet into a Google Sites **Embed** block to add
dynamic, interactive content — no server required.

---

## 📑 Table of Contents

| Widget | Description | API Key? | Folder |
|--------|-------------|----------|--------|
| [⏰ Time & Date](#️-time--date) | Live clock and calendar | None | `snippets/time-and-date/` |
| [💬 Quote of the Day](#-quote-of-the-day) | Inspirational quotes | None | `snippets/quote-of-day/` |
| [📜 Poem of the Day](#-poem-of-the-day) | Classic poetry daily | None | `snippets/poem-of-day/` |
| [📖 Word of the Day](#-word-of-the-day) | Vocabulary builder | None | `snippets/word-of-day/` |
| [💡 Idea of the Day](#-idea-of-the-day) | Creative daily prompts | None | `snippets/idea-of-day/` |
| [🖼️ Art of the Day](#️-art-of-the-day) | Met Museum masterpieces | None | `snippets/art-of-day/` |
| [🔬 Science Fact of the Day](#-science-fact-of-the-day) | Curated STEM facts | None | `snippets/science-fact-of-day/` |
| [✈️ Travel Deal of the Day](#️-travel-deal-of-the-day) | Curated destination guide | None | `snippets/travel-deal-of-day/` |
| [☁️ Weather Widget](#️-weather-widget) | Current weather + forecast | OpenWeatherMap (free) | `snippets/weather/` |
| [📰 News Ticker](#-news-ticker) | Scrolling RSS headlines | None (rss2json optional) | `snippets/news-ticker/` |
| [📈 Stock Ticker](#-stock-ticker) | Live or simulated stocks | Finnhub (free, optional) | `snippets/stock-ticker/` |

**Apps Script versions** (server-side, no CORS issues) are in `apps-script/`:

| Component | Folder |
|-----------|--------|
| Weather Widget | `apps-script/weather/` |
| News Ticker | `apps-script/news-ticker/` |
| Stock Ticker | `apps-script/stock-ticker/` |

---

## 🚀 How to Embed in Google Sites

### Option A — Paste HTML directly (pure snippets)

1. Open your Google Site in edit mode.
2. Insert → **Embed** → **Embed code** tab.
3. Paste the entire contents of the snippet's `index.html` file.
4. Click **Next** → **Insert**.
5. Resize the embedded block as needed.

### Option B — Deploy as an Apps Script Web App (recommended for API-backed snippets)

1. Go to [script.google.com](https://script.google.com) and create a **New Project**.
2. Copy the contents of `Code.gs` into the `Code.gs` editor tab.
3. Click **+** to add a new file → **HTML** → name it `index` (no extension needed).
4. Copy the contents of `index.html` into that tab.
5. Fill in any configuration values (API keys, city name, etc.) in `Code.gs`.
6. Click **Deploy** → **New deployment** → select type **Web app**.
7. Set *Execute as*: **Me**, *Who has access*: **Anyone**.
8. Click **Deploy** and copy the web app URL.
9. In Google Sites: Insert → Embed → **By URL** → paste the web app URL.

---

## Widget Reference

---

### ⏰ Time & Date

**File:** `snippets/time-and-date/index.html`  
**API:** None — pure JavaScript, works offline  
**Recommended embed height:** 280 px

Displays a live clock (12-hour with AM/PM), current date, day of the week, and week-of-year info. Updates every second.

---

### 💬 Quote of the Day

**File:** `snippets/quote-of-day/index.html`  
**API:** [quotable.io](https://quotable.io) — free, no key required  
**Recommended embed height:** 380 px

Fetches a random inspirational quote on each load, with author attribution and topic tags. Includes "New Quote" and "Copy & Share" buttons. Falls back to a curated list if the API is unavailable.

---

### 📜 Poem of the Day

**File:** `snippets/poem-of-day/index.html`  
**API:** [poetrydb.org](https://poetrydb.org) — free, no key required  
**Recommended embed height:** 480 px

Displays a classic poem from the PoetryDB open database. Uses a daily seed to show the same poem to all visitors on the same day. Includes a scrollable verse area and a "Copy Text" button.

**Configuration (inside the file):**

```js
const USE_DAILY_SEED = true;   // true = same poem all day; false = random each load
```

---

### 📖 Word of the Day

**File:** `snippets/word-of-day/index.html`  
**API:** None — curated built-in word list  
**Recommended embed height:** 480 px

Rotates through 30+ carefully selected English words, keyed by day-of-year so all visitors see the same word each day. Each entry includes:
- Phonetic pronunciation
- Part of speech
- Full definition
- Contextual example sentence
- Etymology

---

### 💡 Idea of the Day

**File:** `snippets/idea-of-day/index.html`  
**API:** None — curated built-in list  
**Recommended embed height:** 520 px

Displays one creative, actionable idea per day from a 30-idea curated collection covering personal growth, creativity, learning, wellness, and more. Each idea includes a description and 4-step action plan.

---

### 🖼️ Art of the Day

**File:** `snippets/art-of-day/index.html`  
**API:** [Metropolitan Museum of Art Collection API](https://metmuseum.github.io/) — free, no key required  
**Recommended embed height:** 620 px

Fetches a painting from the Met's open collection, displaying the image, title, artist, date, medium, and a link to the full entry on the Met website.

**Configuration (inside the file):**

```js
const DEPARTMENT_ID = 11; // European Paintings
// Other options: 21 = Modern Art | 6 = Asian Art | 9 = Drawings & Prints
```

---

### 🔬 Science Fact of the Day

**File:** `snippets/science-fact-of-day/index.html`  
**API:** None — curated built-in list  
**Recommended embed height:** 460 px

Rotates through 30 verified science facts spanning physics, astronomy, biology, chemistry, geology, and more. Each fact includes a plain-language explanation, the relevant scientific field, and a cited source. Keyed by day-of-year for consistency.

---

### ✈️ Travel Deal of the Day

**File:** `snippets/travel-deal-of-day/index.html`  
**API:** None — curated built-in list  
**Recommended embed height:** 640 px

Showcases a destination from a curated list of 15 global travel spots, including:
- Budget classification
- Travel style tag
- Best season to visit
- Estimated average flight cost
- Local travel tip
- Must-see experiences
- Direct link to Google Flights

> **For real-time pricing:** Integrate with the [Skyscanner API](https://developers.skyscanner.net),
> [Amadeus for Developers](https://developers.amadeus.com), or [Google Flights](https://www.google.com/travel/flights).

---

### ☁️ Weather Widget

**Files:**  
- `snippets/weather/index.html` — standalone embed (API key in browser)  
- `apps-script/weather/Code.gs` + `index.html` — server-side (recommended)

**API:** [OpenWeatherMap](https://openweathermap.org/api) — free tier: 1,000 calls/day  
**Recommended embed height:** 600 px

Displays current conditions, feels-like temperature, humidity, wind speed, visibility, pressure, sunrise/sunset, and a 5-day forecast. Supports both °F and °C toggle.

**Quick start (standalone):**

1. Get a free API key at [openweathermap.org/api](https://openweathermap.org/api).
2. Open `snippets/weather/index.html` and replace `YOUR_API_KEY` near the top:

```js
const API_KEY      = 'abc123yourkey';
const DEFAULT_CITY = 'London,UK';   // optional default
```

3. Embed the file in Google Sites.

> ⚠️ **Security note:** Embedding an API key in client-side HTML exposes it to anyone who inspects the page source.
> For production use, deploy the **Apps Script version** (`apps-script/weather/`) — the key stays server-side.

---

### 📰 News Ticker

**Files:**  
- `snippets/news-ticker/index.html` — standalone embed (fetches RSS via rss2json.com)  
- `apps-script/news-ticker/Code.gs` + `index.html` — server-side (recommended)

**API:** [rss2json.com](https://rss2json.com) (standalone) or any RSS feed (Apps Script)  
**Recommended embed height:** 48 px (ticker) or 400+ px (card mode)

Displays a horizontally scrolling news ticker from any RSS feed. Set `COMPACT_MODE = false` for a card-list layout.

**Configuration:**

```js
// In snippets/news-ticker/index.html:
const COMPACT_MODE  = true;                               // or false for card list
const RSS_FEED_URL  = 'https://feeds.bbci.co.uk/news/rss.xml';
const RSS2JSON_KEY  = '';                                 // optional paid key
const TICKER_SPEED  = '40s';                              // lower = faster
const MAX_ITEMS     = 20;
```

**Suggested RSS feeds:**

| Source | URL |
|--------|-----|
| BBC News | `https://feeds.bbci.co.uk/news/rss.xml` |
| Reuters | `https://feeds.reuters.com/reuters/topNews` |
| Google News (US) | `https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en` |
| AP News | `https://apnews.com/index.rss` |
| NPR | `https://feeds.npr.org/1001/rss.xml` |

---

### 📈 Stock Ticker

**Files:**  
- `snippets/stock-ticker/index.html` — standalone embed (Finnhub or simulated data)  
- `apps-script/stock-ticker/Code.gs` + `index.html` — server-side (recommended)

**API:** [Finnhub](https://finnhub.io) (free: 60 calls/min) or [Alpha Vantage](https://alphavantage.co) (free: 25 calls/day)  
**Recommended embed height:** 52 px (ticker) or 320+ px (card mode)

Shows a scrolling stock price ticker with color-coded up/down indicators. Falls back to deterministic simulated data if no API key is set (good for demos). Set `COMPACT_MODE = false` for a card grid.

**Configuration:**

```js
// In snippets/stock-ticker/index.html:
const COMPACT_MODE  = true;                // or false for card grid
const FINNHUB_KEY   = 'yourkey';           // leave blank for simulated data
const TICKER_SPEED  = '35s';
const REFRESH_MS    = 15 * 60 * 1000;     // 15-minute auto-refresh

const STOCKS = [
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'MSFT', name: 'Microsoft' },
  // ... add/remove symbols here
];
```

---

## 🗂️ Repository Structure

```
google-site-script-snippets/
│
├── snippets/                   Pure HTML/CSS/JS — embed directly in Google Sites
│   ├── time-and-date/
│   │   └── index.html
│   ├── quote-of-day/
│   │   └── index.html
│   ├── poem-of-day/
│   │   └── index.html
│   ├── word-of-day/
│   │   └── index.html
│   ├── idea-of-day/
│   │   └── index.html
│   ├── art-of-day/
│   │   └── index.html
│   ├── science-fact-of-day/
│   │   └── index.html
│   ├── travel-deal-of-day/
│   │   └── index.html
│   ├── weather/
│   │   └── index.html
│   ├── news-ticker/
│   │   └── index.html
│   └── stock-ticker/
│       └── index.html
│
└── apps-script/                Google Apps Script projects — deploy as Web App
    ├── weather/
    │   ├── Code.gs
    │   └── index.html
    ├── news-ticker/
    │   ├── Code.gs
    │   └── index.html
    └── stock-ticker/
        ├── Code.gs
        └── index.html
```

---

## 🔑 API Key Summary

| Widget | API | Free Tier | Key Required |
|--------|-----|-----------|--------------|
| Quote of the Day | quotable.io | Unlimited | ✗ |
| Poem of the Day | poetrydb.org | Unlimited | ✗ |
| Art of the Day | Met Museum API | Unlimited | ✗ |
| Weather | OpenWeatherMap | 1,000 calls/day | ✓ |
| News Ticker | RSS (direct) | — | ✗ |
| News Ticker | rss2json.com | Rate-limited | Optional |
| Stock Ticker | Finnhub | 60 req/min | Optional |
| Stock Ticker | Alpha Vantage | 25 calls/day | Optional |

---

## 📄 License

[MIT](LICENSE) — free to use, modify, and distribute.
