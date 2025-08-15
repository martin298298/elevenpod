# AI-Powered Podcast Generator

## Project Description

Welcome to the AI-Powered Podcast Generator! This application allows users to listen to engaging podcasts featuring two virtual hosts discussing various countries and cities around the world. Using advanced AI technologies, we generate scripts for each episode with the assistance of OpenAI, ensuring informative and entertaining content. The audio for these podcasts is synthesized using ElevenLabs, providing a natural and realistic voice experience for our listeners.

### Features:
- **Dynamic Script Generation:** Each episode's script is dynamically created based on the selected topics, ensuring fresh and relevant discussions.
- **Voice Synthesis:** Enjoy the conversations with high-quality voice synthesis that makes the hosts sound human-like and engaging.
- **User-Friendly Interface:** Simple navigation allows users to select topics and listen to their favorite episodes effortlessly.

### How It Works:
1. **Select a Country or City:** Users can choose a location that interests them.
2. **Generate Script:** The app uses OpenAI to create a script for the podcast episode based on the selected location.
3. **Voice Synthesis:** The generated script is then converted to audio using ElevenLabs, creating a seamless listening experience.

### Getting Started:

#### Prerequisites
- Node.js 16.0.0 or higher
- npm (comes with Node.js)

#### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/martin298298/elevenpod.git
   cd elevenpod
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your API keys:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `ELEVENLABS_API_KEY`: Your ElevenLabs API key

4. Start the application:
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

#### API Endpoints
- `GET /` - Main application interface
- `GET /health` - Health check endpoint
- `POST /api/generate-podcast` - Generate podcast (coming soon)

### Future Enhancements:
- Expand the range of topics and locations covered.
- Implement user feedback to refine script generation and voice synthesis.

Join us in exploring the world through engaging conversations and innovative technology!