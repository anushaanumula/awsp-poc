const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_PATH = path.join(__dirname, 'src', 'data', 'sites.json');

let sites = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = () => {
    // Sort by severity descending and send top 30 entries
    const topSites = [...sites]
      .sort((a, b) => b.severity - a.severity)
      .slice(0, 30)
      .map((s) => ({
        ...s,
        updatedAt: new Date().toISOString(),
      }));
    res.write(`data: ${JSON.stringify(topSites)}\n\n`);
  };

  send();
  const interval = setInterval(send, 5000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`SSE server running on http://localhost:${PORT}`);
});
