# snobweb
The web of your snobbiness.

## About
A visual, interactive web of your refined tastes and opinions. Built as a static HTML page with D3.js visualization.

## Noun Project API Integration

This app supports optional integration with The Noun Project API to display real SVG icons instead of emoji fallbacks.

### ⚠️ Important Limitations

**CORS Restriction**: The Noun Project API blocks direct browser requests due to CORS policy. This means API calls from a static HTML file will fail by default.

**Security Warning**: This implementation stores API credentials in browser localStorage and exposes them in the page source. This is **only suitable for personal use on your own computer** - never use in production or share your credentials.

### How to Use

1. Open `index.html` in a web browser
2. Click the settings (⚙️) button
3. Get API credentials from [The Noun Project Developers](https://thenounproject.com/developers/apps/)
4. Enter your API Key and Secret
5. Choose a CORS workaround (see below)

### CORS Workaround Options

Since the API blocks direct browser calls, you have several options:

#### Option 1: Use a CORS Proxy (Simplest for Testing)
Edit `index.html` and locate the `CORS_PROXY` constant in the "API Functions" section:
```javascript
const CORS_PROXY = 'https://corsproxy.io/?';
```

Then reload the page. The app will route API requests through the proxy.

**Note**: Public CORS proxies may be slow, unreliable, or have usage limits. Examples:
- `https://corsproxy.io/?`
- `https://cors-anywhere.herokuapp.com/` (requires requesting temporary access)

#### Option 2: Browser Extension (Local Testing)
Install a browser extension that disables CORS:
- Chrome: "CORS Unblock" or "Allow CORS"
- Firefox: "CORS Everywhere"

**Warning**: Only use for local testing and remember to disable when browsing normally.

#### Option 3: Use the Original Proxy Server (Best for Deployment)
If you need a production-ready solution, use the included `api-proxy.js` Node.js server:
```bash
NOUN_PROJECT_KEY="your-key" NOUN_PROJECT_SECRET="your-secret" node api-proxy.js
```

See `API-PROXY-README.md` for full deployment instructions.

### Without API Integration

The app works fine without API credentials - it will use emoji fallbacks (☕🍷🎨 etc.) for all icons.

## License

Personal/educational use.
