require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Mount API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'RuralBiz AI API Server (SIH 2026 - PS 26091)',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

app.listen(PORT, () => {
  console.log(`[RuralBiz AI] Server running on http://localhost:${PORT}`);
});
