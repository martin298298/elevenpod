const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const openaiService = require('./services/openaiService');
const elevenlabsService = require('./services/elevenlabsService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ensure audio directory exists
const audioDir = path.join(__dirname, 'public', 'audio');
fs.mkdir(audioDir, { recursive: true }).catch(console.error);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to generate podcast
app.post('/api/generate-podcast', async (req, res) => {
    try {
        const { location } = req.body;
        
        if (!location) {
            return res.status(400).json({ error: 'Location is required' });
        }

        console.log(`Generating podcast for: ${location}`);
        
        // Step 1: Generate script using OpenAI
        const script = await openaiService.generatePodcastScript(location);
        
        // Step 2: Convert script to audio using ElevenLabs
        const audioFilePath = await elevenlabsService.generateAudio(script, location);
        
        res.json({
            success: true,
            location: location,
            script: script,
            audioUrl: `/audio/${path.basename(audioFilePath)}`
        });
        
    } catch (error) {
        console.error('Error generating podcast:', error);
        res.status(500).json({ 
            error: 'Failed to generate podcast',
            message: error.message 
        });
    }
});

// API endpoint to get available locations
app.get('/api/locations', (req, res) => {
    const locations = [
        'Paris, France',
        'Tokyo, Japan',
        'New York, USA',
        'London, England',
        'Sydney, Australia',
        'Rome, Italy',
        'Barcelona, Spain',
        'Amsterdam, Netherlands',
        'Cairo, Egypt',
        'Mumbai, India',
        'Rio de Janeiro, Brazil',
        'Dubai, UAE',
        'Berlin, Germany',
        'Seoul, South Korea',
        'Bangkok, Thailand'
    ];
    
    res.json(locations);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        services: {
            openai: !!process.env.OPENAI_API_KEY,
            elevenlabs: !!process.env.ELEVENLABS_API_KEY
        }
    });
});

app.listen(PORT, () => {
    console.log(`🎙️  AI-Powered Podcast Generator running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    
    // Check if API keys are configured
    if (!process.env.OPENAI_API_KEY) {
        console.warn('⚠️  OPENAI_API_KEY not configured. Please set it in .env file.');
    }
    if (!process.env.ELEVENLABS_API_KEY) {
        console.warn('⚠️  ELEVENLABS_API_KEY not configured. Please set it in .env file.');
    }
});

module.exports = app;