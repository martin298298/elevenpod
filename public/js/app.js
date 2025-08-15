class PodcastGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadPopularLocations();
        this.currentStep = 0;
    }

    initializeElements() {
        this.locationInput = document.getElementById('locationInput');
        this.languageSelect = document.getElementById('languageSelect');
        this.voiceSelect = document.getElementById('voiceSelect');
        this.generateBtn = document.getElementById('generateBtn');
        this.locationsList = document.getElementById('locationsList');
        this.statusSection = document.getElementById('statusSection');
        this.playerSection = document.getElementById('playerSection');
        this.errorSection = document.getElementById('errorSection');
        this.statusTitle = document.getElementById('statusTitle');
        this.statusMessage = document.getElementById('statusMessage');
        this.podcastTitle = document.getElementById('podcastTitle');
        this.audioPlayer = document.getElementById('audioPlayer');
        this.podcastScript = document.getElementById('podcastScript');
        this.generateAnotherBtn = document.getElementById('generateAnotherBtn');
        this.retryBtn = document.getElementById('retryBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingSpinner = document.getElementById('loadingSpinner');
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generatePodcast());
        this.locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generatePodcast();
            }
        });
        this.generateAnotherBtn.addEventListener('click', () => this.resetToSelection());
        this.retryBtn.addEventListener('click', () => this.resetToSelection());
    }

    async loadPopularLocations() {
        try {
            const response = await fetch('/api/locations');
            const locations = await response.json();
            
            this.locationsList.innerHTML = '';
            locations.forEach(location => {
                const locationCard = document.createElement('div');
                locationCard.className = 'location-card';
                locationCard.textContent = location;
                locationCard.addEventListener('click', () => {
                    this.locationInput.value = location;
                    this.generatePodcast();
                });
                this.locationsList.appendChild(locationCard);
            });
        } catch (error) {
            console.error('Error loading locations:', error);
        }
    }

    async generatePodcast() {
        const location = this.locationInput.value.trim();
        const language = this.languageSelect.value;
        const voice = this.voiceSelect.value;
        
        if (!location) {
            alert('Please enter a location');
            return;
        }

        this.showGenerationStatus();
        this.startProgressAnimation();
        
        try {
            const response = await fetch('/api/generate-podcast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    location, 
                    language,
                    voice 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate podcast');
            }

            this.showPodcastPlayer(data);
            
        } catch (error) {
            console.error('Error generating podcast:', error);
            this.showError(error.message);
        }
    }

    showGenerationStatus() {
        this.hideAllSections();
        this.statusSection.style.display = 'block';
        this.generateBtn.disabled = true;
        this.currentStep = 0;
    }

    startProgressAnimation() {
        const steps = ['step1', 'step2', 'step3'];
        
        // Reset all steps
        steps.forEach(stepId => {
            document.getElementById(stepId).classList.remove('active');
        });

        // Animate through steps
        const animateStep = (stepIndex) => {
            if (stepIndex < steps.length) {
                document.getElementById(steps[stepIndex]).classList.add('active');
                
                // Update status message based on step
                const messages = [
                    'Our AI is crafting an engaging script about your destination...',
                    'Converting the script to natural-sounding speech...',
                    'Finalizing your personalized podcast episode...'
                ];
                
                if (stepIndex < messages.length) {
                    this.statusMessage.textContent = messages[stepIndex];
                }
                
                // Move to next step after delay (except for the last step)
                if (stepIndex < steps.length - 1) {
                    setTimeout(() => animateStep(stepIndex + 1), 2000);
                }
            }
        };

        animateStep(0);
    }

    showPodcastPlayer(data) {
        this.hideAllSections();
        this.playerSection.style.display = 'block';
        this.generateBtn.disabled = false;
        
        this.podcastTitle.textContent = `Exploring ${data.location}`;
        this.audioPlayer.src = data.audioUrl;
        this.podcastScript.textContent = data.script;
        
        // Auto-play the audio (browsers may block this)
        this.audioPlayer.load();
    }

    showError(message) {
        this.hideAllSections();
        this.errorSection.style.display = 'block';
        this.generateBtn.disabled = false;
        this.errorMessage.textContent = message;
    }

    resetToSelection() {
        this.hideAllSections();
        this.generateBtn.disabled = false;
        this.locationInput.value = '';
        this.locationInput.focus();
    }

    hideAllSections() {
        this.statusSection.style.display = 'none';
        this.playerSection.style.display = 'none';
        this.errorSection.style.display = 'none';
    }
}

// Health check and service status
async function checkServiceHealth() {
    try {
        const response = await fetch('/api/health');
        const health = await response.json();
        
        if (!health.services.openai || !health.services.elevenlabs) {
            console.warn('Some services are not configured properly');
            // You could show a warning banner here
        }
    } catch (error) {
        console.error('Health check failed:', error);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PodcastGenerator();
    checkServiceHealth();
});

// Add some visual feedback for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading states to buttons
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        // You can add global loading indicators here if needed
        return originalFetch.apply(this, args);
    };
});