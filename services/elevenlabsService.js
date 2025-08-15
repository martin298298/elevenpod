const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ElevenLabsService {
    constructor() {
        this.apiKey = process.env.ELEVENLABS_API_KEY;
        this.baseUrl = 'https://api.elevenlabs.io/v1';
        
        // Default voice IDs for the two hosts (these are public voice IDs from ElevenLabs)
        this.voices = {
            alex: '21m00Tcm4TlvDq8ikWAM', // Rachel - clear female voice
            sam: 'AZnzlk1XvdvUeBnXmlld'   // Domi - clear male voice
        };
        
        if (!this.apiKey) {
            console.warn('ElevenLabs API key not found. Audio generation will not work.');
        }
    }

    async generateAudio(script, location) {
        if (!this.apiKey) {
            throw new Error('ElevenLabs API key not configured');
        }

        try {
            // Parse the script to separate different speakers
            const segments = this.parseScript(script);
            
            // Generate audio for each segment
            const audioSegments = [];
            for (const segment of segments) {
                const audioBuffer = await this.generateSegmentAudio(segment.text, segment.speaker);
                audioSegments.push(audioBuffer);
            }
            
            // Combine audio segments by concatenating all buffers
            const combinedAudio = audioSegments.length > 0 ? Buffer.concat(audioSegments) : Buffer.alloc(0);
            
            // Save the audio file
            const fileName = `podcast_${location.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${uuidv4()}.mp3`;
            const audioDir = path.join(__dirname, '..', 'public', 'audio');
            const filePath = path.join(audioDir, fileName);
            
            await fs.mkdir(audioDir, { recursive: true });
            await fs.writeFile(filePath, combinedAudio);
            
            return filePath;
            
        } catch (error) {
            console.error('Error generating audio with ElevenLabs:', error);
            throw new Error(`Failed to generate audio: ${error.message}`);
        }
    }

    parseScript(script) {
        const lines = script.split('\n').filter(line => line.trim());
        const segments = [];
        
        let currentSpeaker = 'alex';
        let currentText = '';
        
        for (const line of lines) {
            const cleanLine = line.trim();
            if (!cleanLine) continue;
            
            // Check if line starts with a speaker name
            if (cleanLine.toLowerCase().startsWith('alex:')) {
                if (currentText) {
                    segments.push({ speaker: currentSpeaker, text: currentText.trim() });
                }
                currentSpeaker = 'alex';
                currentText = cleanLine.substring(5).trim();
            } else if (cleanLine.toLowerCase().startsWith('sam:')) {
                if (currentText) {
                    segments.push({ speaker: currentSpeaker, text: currentText.trim() });
                }
                currentSpeaker = 'sam';
                currentText = cleanLine.substring(4).trim();
            } else {
                // Continue the current speaker's text
                currentText += ' ' + cleanLine;
            }
        }
        
        // Add the last segment
        if (currentText) {
            segments.push({ speaker: currentSpeaker, text: currentText.trim() });
        }
        
        // If no speakers were detected, treat the whole script as one speaker
        if (segments.length === 0 && script.trim()) {
            segments.push({ speaker: 'alex', text: script.trim() });
        }
        
        return segments;
    }

    async generateSegmentAudio(text, speaker) {
        const voiceId = this.voices[speaker.toLowerCase()] || this.voices.alex;
        
        const response = await axios.post(
            `${this.baseUrl}/text-to-speech/${voiceId}`,
            {
                text: text,
                model_id: "eleven_monolingual_v1",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5
                }
            },
            {
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': this.apiKey
                },
                responseType: 'arraybuffer'
            }
        );
        
        return Buffer.from(response.data);
    }
}

module.exports = new ElevenLabsService();