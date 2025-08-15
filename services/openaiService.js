const OpenAI = require('openai');

class OpenAIService {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('OpenAI API key not found. Script generation will not work.');
            this.client = null;
            return;
        }
        
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async generatePodcastScript(location) {
        if (!this.client) {
            throw new Error('OpenAI API key not configured');
        }

        const prompt = `Create an engaging podcast script for a 3-4 minute episode about ${location}. The script should feature two hosts, Alex and Sam, having a natural conversation about this location. Include:

1. Interesting historical facts
2. Cultural highlights
3. Must-visit attractions
4. Local cuisine or traditions
5. Fun or surprising facts
6. Natural conversation flow with interruptions and reactions

Format the script clearly with:
- Host names before each line
- Natural dialogue that sounds conversational
- Include some enthusiasm and personality
- Keep it informative but entertaining

Make it sound like two friends talking about travel experiences and interesting facts about ${location}.`;

        try {
            const response = await this.client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional podcast script writer who creates engaging, conversational content about travel destinations. Write scripts that sound natural and entertaining."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 1500,
                temperature: 0.8,
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error generating script with OpenAI:', error);
            throw new Error(`Failed to generate script: ${error.message}`);
        }
    }
}

module.exports = new OpenAIService();