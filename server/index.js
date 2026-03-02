const express = require('express');
const cors = require('cors');
const path = require('path');
const invoiceRoutes = require('./routes/invoice');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (logo)
app.use('/assets', express.static(path.join(__dirname, '..')));

// Routes
app.use('/api/invoice', invoiceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Invoice API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
