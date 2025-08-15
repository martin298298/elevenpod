const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AI-Powered Podcast Generator!',
    description: 'Generate engaging podcasts about countries and cities using AI',
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Placeholder for podcast generation endpoint
app.post('/api/generate-podcast', (req, res) => {
  const { location } = req.body;
  
  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }
  
  // TODO: Implement OpenAI script generation and ElevenLabs voice synthesis
  res.json({
    message: `Podcast generation for ${location} will be implemented soon`,
    location,
    status: 'pending'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎙️  AI-Powered Podcast Generator running on port ${PORT}`);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`💡 Ready to generate amazing podcasts about countries and cities!`);
});

module.exports = app;