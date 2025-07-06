import OpenAI from "openai";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from current directory

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const SYSTEM_PROMPT = `
You are Radha, a professional Indian airport receptionist working at a major international airport.

Your role is to:
- Greet passengers respectfully and warmly
- Answer questions about check-ins, terminals, security, lounges, boarding, immigration, airport services, etc.
- Be calm, clear, and professional at all times
- Use polite Indian English, such as "Kindly proceed to...", "May I assist you?", "Thank you for your patience"

Your tone:
- Formal but friendly
- Helpful, confident, and courteous
- Never use slang or emojis
- Be concise and informative

NEVER break character. You are not an AI — you are a real receptionist named Radha.

Example replies:
- "Welcome to the airport. How may I assist you?"
- "Certainly, your gate number is displayed on the boarding pass."
- "Kindly proceed to Terminal 3 for international departures."
- "May I help you with anything else?"

Only respond in JSON format like:
{ "step": "output", "content": "..." }

You still use internal steps (START → THINK → ACTION → OUTPUT), but to the user you show only the OUTPUT.
`;

const messages = [
    { role: "system", content: SYSTEM_PROMPT }
];

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'chatbot.html'));
});

// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Add user message to conversation
        messages.push({ role: "user", content: message });

        // Get AI response
        while (true) {
            const response = await openai.chat.completions.create({
                model: "gemini-2.0-flash",
                response_format: { type: "json_object" },
                messages: messages
            });

            const aiMsg = response.choices[0].message.content;
            const parsed = JSON.parse(aiMsg);
            messages.push({ role: "assistant", content: aiMsg });

            if (parsed.step === "output") {
                // Return the response to frontend
                res.json({ 
                    response: parsed.content,
                    timestamp: new Date().toISOString()
                });
                break;
            }
        }
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ 
            error: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.',
            timestamp: new Date().toISOString()
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Radha Airport Assistant'
    });
});

// Get conversation history (optional)
app.get('/conversation', (req, res) => {
    const conversation = messages.filter(msg => msg.role !== 'system').map(msg => ({
        role: msg.role,
        content: msg.role === 'assistant' ? JSON.parse(msg.content).content : msg.content,
        timestamp: new Date().toISOString()
    }));
    
    res.json({ conversation });
});

// Clear conversation history (optional)
app.delete('/conversation', (req, res) => {
    // Keep only the system prompt
    messages.length = 1;
    res.json({ message: 'Conversation cleared', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🛫 Radha Airport Assistant Server running on http://localhost:${PORT}`);
    console.log(`Open your browser and navigate to http://localhost:${PORT} to use the chat interface`);
    console.log(`\n🔗 Endpoints:`);
    console.log(`   GET  /           - Chat Interface`);
    console.log(`   POST /chat       - Send message to Radha`);
    console.log(`   GET  /health     - Health check`);
    console.log(`   GET  /conversation - Get chat history`);
    console.log(`   DELETE /conversation - Clear chat history`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Radha Airport Assistant Server shutting down gracefully...');
    process.exit(0);
});

