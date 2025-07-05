# Radha - Professional Airport Assistant Chatbot

![Radha Airport Assistant](https://img.shields.io/badge/Radha-Airport%20Assistant-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Status](https://img.shields.io/badge/status-ready-brightgreen.svg)

A professional, industrial-level chatbot interface for airport assistance, built with modern web technologies and AI integration.

## 🌟 Features

### Frontend
- **Professional Design**: Modern, clean interface with gradient backgrounds and smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Chat**: Instant messaging with typing indicators and message timestamps
- **Quick Actions**: Pre-defined buttons for common airport queries
- **Accessibility**: Full keyboard navigation and screen reader support
- **Dark/Light Theme**: Toggle between themes for different preferences
- **Sound Effects**: Subtle audio feedback for enhanced user experience
- **Loading States**: Professional loading animations and connection status

### Backend
- **AI-Powered**: Integration with Google's Gemini 2.0 Flash model
- **RESTful API**: Clean, documented endpoints for all operations
- **Conversation Memory**: Maintains context throughout the chat session
- **Error Handling**: Graceful fallbacks and error recovery
- **Health Monitoring**: Built-in health check endpoints
- **CORS Support**: Cross-origin resource sharing for web deployment

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Valid API key for Google Gemini (already configured)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Open Your Browser**
   Navigate to: `http://localhost:3000`

## 📁 Project Structure

```
Desktop/
├── chatbot.html          # Main HTML interface
├── styles.css            # Professional CSS styling
├── chat.js              # Frontend JavaScript logic
├── persona-server.js    # Backend server with AI integration
├── persona.js          # Original command-line version
├── package.json        # Node.js dependencies
└── README.md          # This file
```

## 🎨 Interface Components

### Header Section
- Agent avatar with online status indicator
- Professional agent information display
- Window controls (minimize, close)
- Real-time status updates

### Chat Area
- Scrollable message history
- Message bubbles with timestamps
- Typing indicators
- Smooth animations for new messages

### Quick Actions
- Check-in procedures
- Security information
- Gate directions
- Airport services

### Input Section
- Auto-resizing text input
- File attachment button (ready for future features)
- Send button with hover effects
- Keyboard shortcuts support

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Serve the chat interface |
| POST | `/chat` | Send message to Radha |
| GET | `/health` | Health check |
| GET | `/conversation` | Get chat history |
| DELETE | `/conversation` | Clear chat history |

### Example API Usage

```javascript
// Send a message
fetch('http://localhost:3000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Where is the security checkpoint?' })
})
.then(response => response.json())
.then(data => console.log(data.response));
```

## 🎯 Radha's Capabilities

Radha is designed to assist with:
- ✈️ **Check-in Procedures**: Information about check-in counters and timing
- 🛡️ **Security Guidelines**: Security checkpoint locations and requirements
- 🚪 **Gate Information**: How to find gates and boarding procedures
- 🏢 **Airport Services**: Lounges, dining, shopping, and facilities
- 📋 **Immigration**: Basic immigration and customs information
- 🧳 **Baggage Services**: Baggage claim and lost luggage assistance

## 🌐 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
  --primary-color: #74b9ff;
  --secondary-color: #0984e3;
  --accent-color: #00b894;
}
```

### Adding New Quick Actions
Modify the quick actions in `chatbot.html`:
```html
<button class="quick-action-btn" data-message="Your custom message">
  <i class="fas fa-your-icon"></i>
  <span>Your Label</span>
</button>
```

### Modifying Radha's Personality
Update the `SYSTEM_PROMPT` in `persona-server.js` to change Radha's responses and behavior.

## 🔒 Security Considerations

- API key is currently hardcoded (consider using environment variables for production)
- CORS is enabled for all origins (restrict in production)
- No rate limiting implemented (add for production use)
- Input validation should be enhanced for production

## 📱 Mobile Optimization

The interface is fully responsive and optimized for:
- Touch interactions
- Mobile keyboards
- Small screen layouts
- Swipe gestures
- Mobile-specific animations

## 🎨 Design Philosophy

- **Professional**: Clean, business-appropriate aesthetic
- **Accessible**: WCAG 2.1 compliant design
- **Intuitive**: Natural conversation flow
- **Responsive**: Works on all device sizes
- **Fast**: Optimized performance and loading times

## 🚧 Future Enhancements

- [ ] File upload support
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] Database integration
- [ ] Push notifications
- [ ] PWA capabilities

## 📞 Support

For questions or issues:
1. Check the browser console for any error messages
2. Ensure Node.js and dependencies are properly installed
3. Verify the API key is valid
4. Test the `/health` endpoint to confirm server status

## 📄 License

MIT License - Feel free to use and modify for your projects.

---

**Built with ❤️ for professional airport assistance**

