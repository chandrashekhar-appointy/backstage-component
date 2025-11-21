const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Demo Service',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    service: 'demo-service',
    description: 'A demo Express service integrated with Backstage',
    endpoints: [
      { path: '/', method: 'GET', description: 'Welcome message' },
      { path: '/health', method: 'GET', description: 'Health check' },
      { path: '/api/info', method: 'GET', description: 'Service information' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Demo Service listening on port ${PORT}`);
});

module.exports = app;
