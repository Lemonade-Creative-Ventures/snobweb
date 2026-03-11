# Noun Project API Proxy (Optional Backend)

⚠️ **NOTE**: As of the latest update, the main `index.html` now performs OAuth 1.0a signing directly in the browser, making this proxy server **optional**.

## When to Use This Proxy

Use this proxy server if you need:
- **Production deployment** with secure credential management
- **Better security** - credentials stay on server, not in browser
- **No CORS issues** - proxy handles API communication
- **Rate limiting and monitoring** capabilities

For personal/development use, the static HTML file works standalone (with CORS workarounds documented in README.md).

## Why Use a Proxy?

The Noun Project API requires OAuth 1.0a authentication, which involves cryptographically signing each request. While the browser can do this, it means:
- ❌ API credentials exposed in browser localStorage and page source
- ❌ Anyone with access to your computer can steal credentials
- ❌ CORS restrictions block direct API calls from browsers

This proxy server:
- ✅ Keeps your API credentials secure on the server
- ✅ Handles OAuth 1.0a signing server-side
- ✅ Provides CORS headers so the browser can make requests
- ✅ Suitable for production deployment

## Usage

### Development

1. Set your API credentials as environment variables:
```bash
export NOUN_PROJECT_KEY="your-api-key"
export NOUN_PROJECT_SECRET="your-api-secret"
```

2. Start the proxy server:
```bash
node api-proxy.js
```

3. The server will run on http://localhost:3000

4. Update index.html to use the proxy by uncommenting the proxy code (see comments in file)

### Production Deployment

For production, deploy this proxy to a serverless function or backend service:

- **Vercel**: Deploy as a Serverless Function
- **Netlify**: Deploy as a Netlify Function
- **AWS Lambda**: Deploy with API Gateway
- **Heroku/Railway**: Deploy as a Node.js app

**Environment Variables:**
- `NOUN_PROJECT_KEY`: Your API key (required)
- `NOUN_PROJECT_SECRET`: Your API secret (required)
- `PORT`: Server port (optional, default: 3000)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (optional, default: http://localhost:8000)

**Configure the client:**

Add a script tag before the closing `</body>` tag in `index.html`:
```html
<script>
  window.NOUN_PROJECT_PROXY_URL = 'https://your-proxy-domain.com';
</script>
```

Or set it as a build-time environment variable.

## API Endpoint

`GET /api/search?query={search_term}&limit={number}`

**Parameters:**
- `query` (required): Search term
- `limit` (optional): Number of results (default: 5)

**Response:**
Returns JSON response from Noun Project API containing icon data.

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit credentials**: Use environment variables for API keys
2. **Rate limiting**: Implement rate limiting to prevent abuse
3. **Input validation**: Validate and sanitize all inputs
4. **HTTPS only**: Use HTTPS in production
5. **Access control**: Consider implementing authentication for your proxy
6. **Error handling**: Don't expose sensitive error details to clients

## Local Testing Without Proxy

If you want to test without the proxy (using emoji fallbacks only), simply don't enter any API credentials in the settings modal.
