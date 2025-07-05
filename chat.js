// Chat Interface JavaScript
class ChatInterface {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.hideLoadingOverlay();
        this.setWelcomeTime();
    }

    init() {
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.quickActionBtns = document.querySelectorAll('.quick-action-btn');
        this.minimizeBtn = document.getElementById('minimize-btn');
        this.closeBtn = document.getElementById('close-btn');
        
        // Chat state
        this.isTyping = false;
        this.messages = [];
        
        // Initialize API connection (you'll need to replace this with your actual API endpoint)
        this.apiEndpoint = 'http://localhost:3000/chat'; // Replace with your server endpoint
    }

    setupEventListeners() {
        // Send button click
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Enter key press
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Input field focus/blur effects
        this.userInput.addEventListener('focus', () => {
            this.userInput.parentElement.classList.add('focused');
        });

        this.userInput.addEventListener('blur', () => {
            this.userInput.parentElement.classList.remove('focused');
        });

        // Quick action buttons
        this.quickActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.dataset.message;
                this.userInput.value = message;
                this.sendMessage();
            });
        });

        // Window controls
        this.minimizeBtn.addEventListener('click', () => this.minimizeWindow());
        this.closeBtn.addEventListener('click', () => this.closeWindow());

        // Auto-resize input
        this.userInput.addEventListener('input', () => this.autoResizeInput());
    }

    setWelcomeTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('welcome-time').textContent = timeString;
    }

    hideLoadingOverlay() {
        setTimeout(() => {
            this.loadingOverlay.classList.add('hidden');
        }, 1500);
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message || this.isTyping) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.userInput.value = '';
        this.autoResizeInput();

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Simulate API call (replace with actual API call)
            const response = await this.callChatAPI(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('I apologize, but I\'m having trouble connecting right now. Please try again in a moment.', 'bot');
            console.error('Chat API Error:', error);
        }
    }

    async callChatAPI(message) {
        // Use the actual backend API
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            return data.response || data.error || 'I apologize, but I received an unexpected response.';
        } catch (error) {
            console.error('Error calling chat API:', error);
            
            // Fallback responses for when server is not available
            const fallbackResponses = {
                'check-in': 'Certainly! For check-in, please proceed to the designated check-in counters. International flights typically open 3 hours before departure, while domestic flights open 2 hours prior. May I assist you with anything else?',
                'security': 'The security checkpoint is located on the second floor. Kindly allow extra time during peak hours. Please have your boarding pass and identification ready. How else may I help you?',
                'gate': 'Your gate information is displayed on your boarding pass and on the flight information displays throughout the terminal. Gates typically open 45 minutes before departure. Is there anything else you need assistance with?',
                'services': 'We offer various services including lounges, dining, shopping, currency exchange, and baggage services. Specific locations can be found on the terminal map. How may I further assist you?',
                'default': 'I apologize, but I\'m currently unable to connect to the main system. However, I\'m here to help with any airport-related questions. Kindly let me know how I may assist you with check-in, security, gates, or other airport services.'
            };

            // Simple keyword matching for fallback
            const lowerMessage = message.toLowerCase();
            let response = fallbackResponses.default;
            
            if (lowerMessage.includes('check') || lowerMessage.includes('check-in')) {
                response = fallbackResponses['check-in'];
            } else if (lowerMessage.includes('security') || lowerMessage.includes('checkpoint')) {
                response = fallbackResponses['security'];
            } else if (lowerMessage.includes('gate') || lowerMessage.includes('boarding')) {
                response = fallbackResponses['gate'];
            } else if (lowerMessage.includes('service') || lowerMessage.includes('facilities')) {
                response = fallbackResponses['services'];
            }

            return response;
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message new`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = sender === 'bot' ? '<i class="fas fa-user-tie"></i>' : '<i class="fas fa-user"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.innerHTML = `<p>${this.escapeHtml(text)}</p>`;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        const now = new Date();
        timeDiv.innerHTML = `<span>${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;
        
        contentDiv.appendChild(bubbleDiv);
        contentDiv.appendChild(timeDiv);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Remove 'new' class after animation
        setTimeout(() => {
            messageDiv.classList.remove('new');
        }, 300);
    }

    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.classList.add('show');
        this.sendBtn.disabled = true;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.classList.remove('show');
        this.sendBtn.disabled = false;
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    autoResizeInput() {
        // Simple auto-resize logic (you can make this more sophisticated)
        const input = this.userInput;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    minimizeWindow() {
        // Add minimize functionality here
        console.log('Minimize clicked');
        document.querySelector('.chat-container').style.transform = 'scale(0.8)';
        document.querySelector('.chat-container').style.opacity = '0.5';
    }

    closeWindow() {
        // Add close functionality here
        console.log('Close clicked');
        if (confirm('Are you sure you want to close the chat?')) {
            document.querySelector('.chat-container').style.transform = 'scale(0)';
            setTimeout(() => {
                document.body.style.display = 'none';
            }, 300);
        }
    }

    // Method to integrate with your existing persona.js backend
    async integrateWithPersonaAPI(message) {
        // This is where you'd integrate with your actual persona.js backend
        // You'll need to set up an HTTP server or use a different communication method
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error calling persona API:', error);
            throw error;
        }
    }
}

// Utility functions for enhanced UX
class ChatEnhancements {
    constructor(chatInterface) {
        this.chat = chatInterface;
        this.setupEnhancements();
    }

    setupEnhancements() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // ESC to clear input
            if (e.key === 'Escape') {
                this.chat.userInput.value = '';
                this.chat.userInput.blur();
            }
            
            // Ctrl+L to clear chat (optional)
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                this.clearChat();
            }
        });

        // Add smooth scrolling behavior
        this.chat.chatMessages.style.scrollBehavior = 'smooth';

        // Add sound effects (optional)
        this.setupSoundEffects();

        // Add theme switching capability
        this.setupThemeToggle();
    }

    clearChat() {
        if (confirm('Clear all messages?')) {
            const messages = this.chat.chatMessages.querySelectorAll('.message:not(:first-child)');
            messages.forEach(msg => msg.remove());
        }
    }

    setupSoundEffects() {
        // Create audio context for subtle sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.playNotificationSound = () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        };
    }

    setupThemeToggle() {
        // Add theme toggle button (optional)
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            cursor: pointer;
            z-index: 1001;
        `;
        
        document.body.appendChild(themeToggle);
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }
}

// Initialize the chat interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chatInterface = new ChatInterface();
    const chatEnhancements = new ChatEnhancements(chatInterface);
    
    // Add some initial setup
    console.log('Radha Chat Interface initialized');
    
    // Optional: Add connection status indicator
    const connectionStatus = document.createElement('div');
    connectionStatus.className = 'connection-status';
    connectionStatus.innerHTML = '<i class="fas fa-wifi"></i> Connected';
    connectionStatus.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #00b894;
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 12px;
        z-index: 1000;
    `;
    
    document.body.appendChild(connectionStatus);
    
    // Hide connection status after 3 seconds
    setTimeout(() => {
        connectionStatus.style.opacity = '0';
        setTimeout(() => connectionStatus.remove(), 300);
    }, 3000);
});

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChatInterface, ChatEnhancements };
}

