// Note: In serverless functions, conversation history is not persistent
// This is a simplified version for demonstration

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
    
    if (req.method === 'GET') {
        const conversation = messages.filter(msg => msg.role !== 'system').map(msg => ({
            role: msg.role,
            content: msg.role === 'assistant' ? JSON.parse(msg.content).content : msg.content,
            timestamp: new Date().toISOString()
        }));
        
        res.json({ conversation });
    } else if (req.method === 'DELETE') {
        // Keep only the system prompt
        messages.length = 1;
        res.json({ message: 'Conversation cleared', timestamp: new Date().toISOString() });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}

