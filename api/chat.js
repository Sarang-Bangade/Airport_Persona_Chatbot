import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config(); 

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

// Store conversation in memory (Note: This will reset on each function call in serverless)
let messages = [
    { role: "system", content: SYSTEM_PROMPT }
];

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
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
}

