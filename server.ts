import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { createServer as createViteServer } from 'vite';

// Ignore self-signed cert errors or invalid certs (helpful for local dev or misconfigured WP servers)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Simple local storage for config
  const getConfig = async () => {
    try {
      const data = await fs.readFile('woo-config.json', 'utf-8');
      return JSON.parse(data);
    } catch {
      return {
        url: process.env.VITE_WOO_API_URL || 'https://api.kurdkids.ir',
        key: process.env.VITE_WOO_KEY || 'ck_e8b46a0bd487f3d3cb8266af7e5a3e40b9725b3a',
        secret: process.env.VITE_WOO_SECRET || 'cs_fdde7fac59842b8f75e422e8207500895adcbd1f'
      };
    }
  };

  // 1. Content API
  app.get('/api/content', async (req, res) => {
    try {
      const contentPath = path.resolve('content.json');
      const fileContent = await fs.readFile(contentPath, 'utf-8');
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      res.send(fileContent);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/content', async (req, res) => {
    try {
      const contentPath = path.resolve('content.json');
      await fs.writeFile(contentPath, JSON.stringify(req.body, null, 2), 'utf-8');
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. Woo Config API (for admin panel)
  app.get('/api/woo-config', async (req, res) => {
    try {
      const config = await getConfig();
      const maskedConfig = {
        url: config.url,
        key: config.key ? config.key.substring(0, 7) + '...[HIDDEN]' : '',
        secret: config.secret ? config.secret.substring(0, 7) + '...[HIDDEN]' : ''
      };
      res.json(maskedConfig);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/woo-config', async (req, res) => {
    try {
      const { url, key, secret } = req.body;
      const currentConfig = await getConfig();
      
      const newKey = key && !key.includes('...[HIDDEN]') ? key : currentConfig.key;
      const newSecret = secret && !secret.includes('...[HIDDEN]') ? secret : currentConfig.secret;

      await fs.writeFile('woo-config.json', JSON.stringify({ url, key: newKey, secret: newSecret }, null, 2), 'utf-8');
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. WooCommerce Proxy
  app.all('/api/woo/*', async (req, res) => {
    try {
      const config = await getConfig();
      if (!config.url || !config.key || !config.secret) {
        return res.status(400).json({ error: 'WooCommerce config missing' });
      }

      const baseUrl = config.url.replace(/\/$/, '');
      // Example req.url: /api/woo/wc/v3/products
      // We want to remove "/api/woo" and append the rest
      const targetPath = req.url.replace('/api/woo', '');
      
      const targetUrl = new URL(`${baseUrl}${targetPath}`);
      
      const auth = Buffer.from(`${config.key}:${config.secret}`).toString('base64');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      };

      const timeoutValue = 30000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutValue);

      const options: RequestInit = {
        method: req.method,
        headers,
        signal: controller.signal
      };

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        options.body = JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl.toString(), options);
      clearTimeout(timeoutId);
      
      let data;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }
      
      res.status(response.status).json(data);
    } catch (error: any) {
      console.error(`[WooProxy Error] Target: ${req.method} ${req.url}`);
      console.error(error);
      const isTimeout = error.name === 'AbortError' || error.message?.includes('timeout') || error.message?.includes('fetch failed');
      if (isTimeout) {
        res.status(504).json({ error: 'Request to WooCommerce timed out or failed to connect. Check if the URL is correct or if the server blocking access.', details: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
