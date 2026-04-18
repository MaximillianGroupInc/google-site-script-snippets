/**
 * News Ticker — Google Apps Script Backend
 * =========================================
 * Fetches RSS headlines server-side (no CORS issues) and serves them to the iframe.
 *
 * HOW TO DEPLOY:
 *  1. Go to https://script.google.com and create a new project.
 *  2. Paste this code into Code.gs.
 *  3. Create a new HTML file named "index" and paste the contents of index.html.
 *  4. Click Deploy → New deployment → Web app.
 *  5. Set "Execute as" = Me, "Who has access" = Anyone.
 *  6. Copy the web app URL and paste it into a Google Sites Embed block.
 */

// ---------------------------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------------------------

// RSS feed URL — change to any public RSS feed.
// Recommendations:
//   BBC News:         https://feeds.bbci.co.uk/news/rss.xml
//   Reuters Top:      https://feeds.reuters.com/reuters/topNews
//   Google News (US): https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en
//   AP News:          https://apnews.com/index.rss
var RSS_FEED_URL = 'https://feeds.bbci.co.uk/news/rss.xml';

// Maximum headlines to return
var MAX_ITEMS = 20;

// Cache duration in seconds (avoid hammering the RSS source)
var CACHE_SECONDS = 300; // 5 minutes

// ---------------------------------------------------------------------------


/**
 * Serves the news ticker HTML page.
 */
function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('index')
    .setTitle('News Ticker')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/**
 * Fetches and parses RSS headlines. Uses Apps Script CacheService to avoid
 * excessive requests to the RSS source.
 *
 * Called from the client via google.script.run.getHeadlines().
 *
 * @returns {Array<{title, link, pubDate, source}>} Array of headline objects.
 */
function getHeadlines() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('news_headlines');
  if (cached) {
    return JSON.parse(cached);
  }

  try {
    var response = UrlFetchApp.fetch(RSS_FEED_URL, { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) {
      return [{ title: 'Could not load news feed (HTTP ' + response.getResponseCode() + ').', link: '#', pubDate: '', source: '' }];
    }

    var xml      = response.getContentText();
    var document = XmlService.parse(xml);
    var root     = document.getRootElement();

    // Handle both RSS 2.0 (<rss><channel><item>) and Atom (<feed><entry>)
    var items = [];
    var ns    = root.getNamespace();

    if (root.getName() === 'rss') {
      var channel = root.getChild('channel');
      if (!channel) throw new Error('No channel element in RSS feed.');
      var channelTitle = channel.getChildText('title') || '';
      var entries      = channel.getChildren('item');
      entries.slice(0, MAX_ITEMS).forEach(function(item) {
        items.push({
          title:   item.getChildText('title')   || '(no title)',
          link:    item.getChildText('link')     || '#',
          pubDate: item.getChildText('pubDate')  || '',
          source:  channelTitle
        });
      });
    } else {
      // Atom feed
      var atomNs = XmlService.getNamespace('http://www.w3.org/2005/Atom');
      var entries = root.getChildren('entry', atomNs);
      var feedTitle = root.getChildText('title', atomNs) || '';
      entries.slice(0, MAX_ITEMS).forEach(function(entry) {
        var linkEl = entry.getChild('link', atomNs);
        var hrefAttr = linkEl ? linkEl.getAttribute('href') : null;
        items.push({
          title:   entry.getChildText('title',   atomNs) || '(no title)',
          link:    hrefAttr ? hrefAttr.getValue() : '#',
          pubDate: entry.getChildText('updated', atomNs) || '',
          source:  feedTitle
        });
      });
    }

    cache.put('news_headlines', JSON.stringify(items), CACHE_SECONDS);
    return items;
  } catch (e) {
    return [{ title: 'Error fetching news: ' + e.message, link: '#', pubDate: '', source: '' }];
  }
}
