"use server";

interface AIResponse {
  type: string;
  params: any;
  gasEstimate?: string;
  error?: string;
}

const SYSTEM_PROMPT = `
You are a transaction parser for a crypto wallet. 
You convert natural language intents into strict JSON.
Supported Actions and schemas:

1. TRANSFER
{
  "type": "TRANSFER",
  "params": {
    "chain": "NEAR" | "ETHEREUM" | "BITCOIN",
    "amount": "string number",
    "token": "symbol",
    "to": "account_id"
  },
  "gasEstimate": "string"
}

2. SWAP
{
  "type": "SWAP",
  "params": {
    "chain": "NEAR",
    "amount": "string number",
    "token": "FROM -> TO"
  },
  "gasEstimate": "string"
}

3. DEPLOY_AGENT
{
  "type": "DEPLOY_AGENT",
  "params": {
    "name": "string",
    "type": "shade-basic"
  },
  "gasEstimate": "string"
}

RULES:
- Only output JSON. No markdown formatting.
- Default to chain="NEAR" if unspecified.
- If the token is ETH and address looks like 0x..., chain is ETHEREUM.
- If the address ends in .near or .testnet, chain is NEAR.
`;

async function callAI(content: string, model: string, apiKey: string, baseUrl: string) {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content },
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function parseIntentAction(input: string): Promise<AIResponse | null> {
  const CEREBRAS_KEY = process.env.CEREBRAS_API_KEY;
  const GROQ_KEY = process.env.GROQ_API_KEY;

  let content = "";

  try {
    // 1. Try Cerebras
    if (CEREBRAS_KEY) {
      try {
        console.log("Attempting Cerebras...");
        content = await callAI(input, "llama3.1-70b", CEREBRAS_KEY, "https://api.cerebras.ai/v1");
      } catch (err) {
        console.error("Cerebras failed, trying fallback...", err);
      }
    }

    // 2. Fallback to Groq
    if (!content && GROQ_KEY) {
      console.log("Attempting Groq...");
      content = await callAI(input, "llama3-70b-8192", GROQ_KEY, "https://api.groq.com/openai/v1");
    }

    if (!content) {
        throw new Error("AI Service Unavailable: Please configure CEREBRAS_API_KEY or GROQ_API_KEY.");
    }

    // Clean markdown if present (sometimes models ignore system prompt about strict JSON)
    const jsonStr = content.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("Parse Intent Error:", error);
    return null;
  }
}
