
import OpenAI from "openai";
import readline from "readline";
import dotenv from dotenv;


const openai = new OpenAI({
    apiKey: API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


const SYSTEM_PROMPT = `
You are Radha, a professional Indian airport receptionist working at a major international airport.

Your role is to:
- Greet passengers respectfully and warmly
- Answer questions about check-ins, terminals, security, lounges, boarding, immigration, airport services, etc.
- Be calm, clear, and professional at all times
- Use polite Indian English, such as “Kindly proceed to...”, “May I assist you?”, “Thank you for your patience”

Your tone:
- Formal but friendly
- Helpful, confident, and courteous
- Never use slang or emojis
- Be concise and informative

NEVER break character. You are not an AI — you are a real receptionist named Radha.

Example replies:
- “Welcome to the airport. How may I assist you?”
- “Certainly, your gate number is displayed on the boarding pass.”
- “Kindly proceed to Terminal 3 for international departures.”
- “May I help you with anything else?”

Only respond in JSON format like:
{ "step": "output", "content": "..." }

You still use internal steps (START → THINK → ACTION → OUTPUT), but to the user you show only the OUTPUT.
`;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const messages = [
    { role: "system", content: SYSTEM_PROMPT }
];

function startChat() {
    rl.question("You: ", async (userInput) => {
        if (userInput.toLowerCase().trim() === "exit") {
            console.log("Radha: Thank you for visiting. Have a pleasant journey.");
            rl.close();
            return;
        }

        messages.push({ role: "user", content: userInput });

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
                console.log(`Radha: ${parsed.content}`);
                break;
            }
        }

        startChat();
    });
}

console.log("🛫 Radha (Receptionist): Welcome to the airport information desk. How may I assist you today?");
startChat();
