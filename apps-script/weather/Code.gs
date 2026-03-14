/**
 * Weather Widget — Google Apps Script Backend
 * ============================================
 * Deploy as a Web App in Google Apps Script and embed the published URL in Google Sites.
 *
 * HOW TO DEPLOY:
 *  1. Go to https://script.google.com and create a new project.
 *  2. Paste this code into Code.gs.
 *  3. Create a new HTML file named "index" and paste the contents of index.html.
 *  4. Click Deploy → New deployment → Web app.
 *  5. Set "Execute as" = Me, "Who has access" = Anyone.
 *  6. Copy the web app URL and paste it into a Google Sites Embed block.
 *
 * CONFIGURATION:
 *  Replace OPENWEATHER_API_KEY below with your free key from https://openweathermap.org/api
 */

// ---------------------------------------------------------------------------
// CONFIGURATION — edit these values
// ---------------------------------------------------------------------------
var OPENWEATHER_API_KEY = 'YOUR_API_KEY_HERE';
var DEFAULT_CITY        = 'New York,US';      // Default city if user does not search
var DEFAULT_UNITS       = 'imperial';          // 'imperial' (°F / mph) or 'metric' (°C / m/s)
// ---------------------------------------------------------------------------


/**
 * Serves the HTML page.
 */
function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('index')
    .setTitle('Weather Widget')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/**
 * Fetches current weather + 5-day forecast for a given city.
 * Called from the client via google.script.run.getWeather(city, units).
 *
 * @param {string} city  - City name, e.g. "London,UK"
 * @param {string} units - 'imperial' or 'metric'
 * @returns {Object} { weather, forecast } or { error: message }
 */
function getWeather(city, units) {
  try {
    units = units || DEFAULT_UNITS;
    var q  = encodeURIComponent(city || DEFAULT_CITY);

    var wUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + q
             + '&appid=' + OPENWEATHER_API_KEY + '&units=' + units;
    var fUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + q
             + '&appid=' + OPENWEATHER_API_KEY + '&units=' + units + '&cnt=40';

    var wResp = UrlFetchApp.fetch(wUrl, { muteHttpExceptions: true });
    if (wResp.getResponseCode() === 404) return { error: 'City not found. Try "City,CountryCode" e.g. "London,UK".' };
    if (wResp.getResponseCode() !== 200) return { error: 'Weather service error (' + wResp.getResponseCode() + ').' };

    var fResp = UrlFetchApp.fetch(fUrl, { muteHttpExceptions: true });

    return {
      weather:  JSON.parse(wResp.getContentText()),
      forecast: fResp.getResponseCode() === 200 ? JSON.parse(fResp.getContentText()) : null
    };
  } catch (e) {
    return { error: e.message };
  }
}
