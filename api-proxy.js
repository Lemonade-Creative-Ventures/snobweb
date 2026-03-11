// Simple API proxy server for Noun Project API
// This handles OAuth 1.0a authentication for the client-side app
// WARNING: This is for demonstration purposes only. In production, use a proper backend framework.

const http = require('http');
const https = require('https');
const crypto = require('crypto');
const url = require('url');

// SECURITY NOTE: In production, these should be environment variables, not hardcoded
// Server will fail to start if credentials are not configured
const API_KEY = process.env.NOUN_PROJECT_KEY;
const API_SECRET = process.env.NOUN_PROJECT_SECRET;
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:8000'];
const NOUN_PROJECT_API_BASE = 'https://api.thenounproject.com/v2/icon';

// OAuth 1.0a signing function
function generateOAuthSignature(method, baseUrl, params, consumerSecret, tokenSecret = '') {
  // Sort parameters
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  // Create signature base string
  const signatureBaseString = [
    method.toUpperCase(),
    encodeURIComponent(baseUrl),
    encodeURIComponent(sortedParams)
  ].join('&');

  // Create signing key
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;

  // Generate HMAC-SHA1 signature
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  return signature;
}

// Generate OAuth header
function generateOAuthHeader(method, apiUrl, queryParams = {}) {
  const oauthParams = {
    oauth_consumer_key: API_KEY,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_version: '1.0'
  };

  // Combine OAuth params with query params for signature
  const allParams = { ...oauthParams, ...queryParams };

  // Generate signature
  const signature = generateOAuthSignature(method, apiUrl, allParams, API_SECRET);
  oauthParams.oauth_signature = signature;

  // Build OAuth header
  const oauthHeader = 'OAuth ' + Object.keys(oauthParams)
    .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ');

  return oauthHeader;
}

// Proxy server
const server = http.createServer((req, res) => {
  // CORS configuration - restrict to allowed origins
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (ALLOWED_ORIGINS.includes('*')) {
    // Only allow wildcard if explicitly configured
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  // Check if credentials are configured
  if (!API_KEY || !API_SECRET) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'API credentials not configured. Set NOUN_PROJECT_KEY and NOUN_PROJECT_SECRET environment variables.' 
    }));
    return;
  }

  // Parse URL
  const parsedUrl = url.parse(req.url, true);
  
  // Only allow /api/search endpoint
  if (parsedUrl.pathname !== '/api/search') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  const query = parsedUrl.query.query || '';
  const limit = parsedUrl.query.limit || '5';

  if (!query) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Query parameter is required' }));
    return;
  }

  // Prepare Noun Project API request
  const queryParams = { query, limit };
  const queryString = new URLSearchParams(queryParams).toString();
  const apiUrl = `${NOUN_PROJECT_API_BASE}?${queryString}`;

  // Generate OAuth header
  const oauthHeader = generateOAuthHeader('GET', NOUN_PROJECT_API_BASE, queryParams);

  // Make request to Noun Project API
  const options = {
    method: 'GET',
    headers: {
      'Authorization': oauthHeader
    }
  };

  https.get(apiUrl, options, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  }).on('error', (err) => {
    console.error('Error calling Noun Project API:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to fetch from Noun Project API' }));
  });
});

server.listen(PORT, () => {
  console.log(`Noun Project API proxy server running on http://localhost:${PORT}`);
  console.log(`API Key: ${API_KEY ? '✓ Configured' : '✗ Missing'}`);
  console.log(`API Secret: ${API_SECRET ? '✓ Configured' : '✗ Missing'}`);
});
