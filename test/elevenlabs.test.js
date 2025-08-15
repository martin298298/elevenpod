const ElevenLabsService = require('../services/elevenlabsService');

// Mock the actual API call to avoid needing real API keys
jest.mock('axios');
const axios = require('axios');

describe('ElevenLabsService Audio Concatenation', () => {
    let elevenLabsService;

    beforeEach(() => {
        // Create a new instance for testing
        elevenLabsService = new (require('../services/elevenlabsService').constructor)();
        elevenLabsService.apiKey = 'test-api-key'; // Set a dummy API key for testing
        
        // Mock axios.post to return dummy audio data
        axios.post.mockResolvedValue({
            data: Buffer.from('fake-audio-data-segment')
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should concatenate multiple audio segments for multi-speaker script', async () => {
        const multiSpeakerScript = `Alex: Welcome to our travel podcast! Today we're exploring Paris.
Sam: That's right, Alex! Paris is known as the City of Light.
Alex: The Eiffel Tower is definitely a must-see attraction.
Sam: And don't forget about the Louvre Museum with the Mona Lisa!`;

        // Mock fs operations
        const fs = require('fs').promises;
        jest.spyOn(fs, 'mkdir').mockResolvedValue();
        jest.spyOn(fs, 'writeFile').mockResolvedValue();

        // Call the method
        const result = await elevenLabsService.generateAudio(multiSpeakerScript, 'Paris', 'en', 'female');

        // Verify that axios.post was called multiple times (once for each speaker segment)
        expect(axios.post).toHaveBeenCalledTimes(4); // 4 segments: Alex, Sam, Alex, Sam

        // Verify that fs.writeFile was called with concatenated data
        expect(fs.writeFile).toHaveBeenCalled();
        const writtenData = fs.writeFile.mock.calls[0][1]; // Get the data that was written
        
        // The concatenated buffer should be larger than a single segment
        const singleSegmentSize = Buffer.from('fake-audio-data-segment').length;
        expect(writtenData.length).toBe(singleSegmentSize * 4); // 4 segments concatenated
    });

    test('should handle single speaker script correctly', async () => {
        const singleSpeakerScript = `This is a single speaker script without any speaker tags. It should be treated as one segment.`;

        // Mock fs operations
        const fs = require('fs').promises;
        jest.spyOn(fs, 'mkdir').mockResolvedValue();
        jest.spyOn(fs, 'writeFile').mockResolvedValue();

        // Call the method
        await elevenLabsService.generateAudio(singleSpeakerScript, 'London', 'en', 'female');

        // Verify that axios.post was called once for the single segment
        expect(axios.post).toHaveBeenCalledTimes(1);

        // Verify the audio was written
        expect(fs.writeFile).toHaveBeenCalled();
    });

    test('parseScript should correctly separate speakers', () => {
        const script = `Alex: Hello and welcome!
Sam: Thanks for having me, Alex.
Alex: Let's talk about our destination today.
Sam: Absolutely! It's going to be great.`;

        // Test with default 'female' voice preference
        const segments = elevenLabsService.parseScript(script);

        expect(segments).toHaveLength(4);
        expect(segments[0]).toEqual({ speaker: 'alex', text: 'Hello and welcome!' });
        expect(segments[1]).toEqual({ speaker: 'sarah', text: 'Thanks for having me, Alex.' });
        expect(segments[2]).toEqual({ speaker: 'alex', text: 'Let\'s talk about our destination today.' });
        expect(segments[3]).toEqual({ speaker: 'sarah', text: 'Absolutely! It\'s going to be great.' });
    });

    test('parseScript should use male voices when specified', () => {
        const script = `Alex: Hello and welcome!
Sam: Thanks for having me, Alex.`;

        // Test with 'male' voice preference
        const segments = elevenLabsService.parseScript(script, 'male');

        expect(segments).toHaveLength(2);
        expect(segments[0]).toEqual({ speaker: 'sam', text: 'Hello and welcome!' });
        expect(segments[1]).toEqual({ speaker: 'james', text: 'Thanks for having me, Alex.' });
    });
});