// internal-tools-backend/console-checker.js
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.post('/check-console', async (req, res) => {
  const { userId, password, urls } = req.body;

  if (!userId || !password || !urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const browser = await puppeteer.launch({ headless: true });
  const results = [];

  for (const url of urls) {
    const page = await browser.newPage();
    const errors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    try {
      await page.goto(url, { waitUntil: 'load', timeout: 15000 });
    } catch (err) {
      errors.push(`Navigation failed: ${err.message}`);
    }

    results.push({ url, errors });
    await page.close();
  }

  await browser.close();
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Console checker server running on http://localhost:${PORT}`);
});
