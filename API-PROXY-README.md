# Noun Project API Proxy

This is a simple proxy server that handles OAuth 1.0a authentication for the Noun Project API.

## Why is this needed?

The Noun Project API requires OAuth 1.0a authentication, which involves cryptographically signing each request. This cannot be done securely in a browser without exposing your API credentials. This proxy server:

1. Keeps your API credentials secure on the server
2. Handles OAuth 1.0a signing for you
3. Provides CORS headers so the browser can make requests

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

4. Open index.html in a browser and enter dummy credentials in the settings (they won't be used, just needed to enable the "API Connected" status)

### Production Deployment

For production, deploy this proxy to a serverless function or backend service:

- **Vercel**: Deploy as a Serverless Function
- **Netlify**: Deploy as a Netlify Function
- **AWS Lambda**: Deploy with API Gateway
- **Heroku/Railway**: Deploy as a Node.js app

Update the `proxyUrl` in `index.html` to point to your deployed proxy server.

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
