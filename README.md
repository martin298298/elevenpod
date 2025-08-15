# Vocura - AI-Powered Podcast Generator

## Project Description

Welcome to **Vocura**! This application allows users to listen to engaging podcasts featuring two virtual hosts discussing various countries and cities around the world. Using advanced AI technologies, we generate scripts for each episode with the assistance of OpenAI, ensuring informative and entertaining content. The audio for these podcasts is synthesized using ElevenLabs, providing a natural and realistic voice experience for our listeners.

### Features:
- **Dynamic Script Generation:** Each episode's script is dynamically created based on the selected topics, ensuring fresh and relevant discussions.
- **Voice Synthesis:** Enjoy the conversations with high-quality voice synthesis that makes the hosts sound human-like and engaging.
- **User-Friendly Interface:** Simple navigation allows users to select topics and listen to their favorite episodes effortlessly.

### How It Works:
1. **Select a Country or City:** Users can choose a location that interests them.
2. **Generate Script:** The app uses OpenAI to create a script for the podcast episode based on the selected location.
3. **Voice Synthesis:** The generated script is then converted to audio using ElevenLabs, creating a seamless listening experience.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)
- OpenAI API key
- ElevenLabs API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/martin298298/elevenpod.git
   cd elevenpod
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   PORT=3000
   ```

4. **Start the application:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

### API Keys Setup

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to the API section
4. Generate a new API key
5. Add it to your `.env` file

#### ElevenLabs API Key
1. Visit [ElevenLabs](https://elevenlabs.io/)
2. Sign up or log in to your account
3. Go to your profile settings
4. Find the API key section
5. Copy your API key and add it to your `.env` file

## Usage

1. **Select a Location:** Choose from popular destinations or type your own
2. **Generate Podcast:** Click the "Generate Podcast" button
3. **Listen:** Enjoy your AI-generated podcast episode
4. **View Script:** Read the full conversation script below the audio player

## Project Structure

```
elevenpod/
├── public/                 # Frontend files
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── audio/             # Generated audio files
│   └── index.html         # Main HTML file
├── services/              # Backend services
│   ├── openaiService.js   # OpenAI integration
│   └── elevenlabsService.js # ElevenLabs integration
├── server.js              # Express server
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## API Endpoints

- `GET /` - Main application page
- `GET /api/health` - Service health check
- `GET /api/locations` - Get popular locations
- `POST /api/generate-podcast` - Generate a new podcast episode

## Technology Stack

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **AI Services:** OpenAI GPT-3.5, ElevenLabs Text-to-Speech
- **Dependencies:** See `package.json` for full list

## Troubleshooting

### Common Issues

1. **API Key Errors:**
   - Ensure your API keys are correctly set in the `.env` file
   - Verify that your API keys have sufficient credits/quota

2. **Audio Not Playing:**
   - Check browser compatibility with HTML5 audio
   - Ensure audio files are being generated in the `public/audio` directory

3. **Generation Timeout:**
   - Large requests may take time; wait for the process to complete
   - Check your internet connection and API service status

### Error Messages

- "OpenAI API key not configured" - Add your OpenAI API key to `.env`
- "ElevenLabs API key not configured" - Add your ElevenLabs API key to `.env`
- "Failed to generate script" - Check OpenAI API status and quota
- "Failed to generate audio" - Check ElevenLabs API status and quota

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- Expand the range of topics and locations covered
- Implement user feedback to refine script generation and voice synthesis
- Add support for multiple languages
- Implement podcast episode history and favorites
- Add social sharing capabilities
- Support for custom voice selection

Join us in exploring the world through engaging conversations and innovative technology!