const https = require('https');
const http = require('http');

const targetUrl = process.env.PING_URL || 'https://gomode-api.onrender.com/api/healthz';

console.log(`[Keep-Alive Cron] Sending ping to: ${targetUrl}`);

const client = targetUrl.startsWith('https') ? https : http;

const req = client.get(targetUrl, (res) => {
  console.log(`[Keep-Alive Cron] Response Status: ${res.statusCode} ${res.statusMessage}`);
  if (res.statusCode >= 200 && res.statusCode < 400) {
    console.log('[Keep-Alive Cron] ✅ Backend is awake and responsive.');
    process.exit(0);
  } else {
    console.warn(`[Keep-Alive Cron] ⚠️ Unexpected response status: ${res.statusCode}`);
    process.exit(0);
  }
});

req.on('error', (err) => {
  console.error(`[Keep-Alive Cron] ❌ Ping failed: ${err.message}`);
  // Do not fail hard to avoid crashing recurring runners
  process.exit(0);
});

req.setTimeout(15000, () => {
  req.destroy();
  console.error('[Keep-Alive Cron] ⏱️ Ping timed out after 15 seconds.');
  process.exit(0);
});
