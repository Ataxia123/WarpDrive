// /pages/api/generateScannerOutput.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_AUTH_TOKEN,
});
const openai = new OpenAIApi(configuration);

interface Choice {
  message: {
    role: string;
    content: string;
  };
  index: number;
  finish_reason: string;
}
type Metadata = {
  srcUrl: string | undefined;
  Level: string;
  Power1: string;
  Power2: string;
  Power3: string;
  Power4: string;
  Alignment1: string;
  Alignment2: string;
  Side: string;
  interplanetaryStatusReport: string;
  selectedDescription: string;
  nijiFlag: boolean;
  vFlag: boolean;
};

async function generateScannerOutput(metadata: Metadata) {
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: `You are an AI capable of generating scanner output for a character. Generate scanner output for the character in the following format: "Current Health and Status: {health_and_status}; Current Equipment: {equipment}; Abilities and Power level: {abilities_level}; Fun Fact: {fun_fact}"`,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: `Metadata: ${JSON.stringify(metadata)}`,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: `SCANNING INFORMATION RECIEVED. GENERATING SCANNER OUTPUT FOR CHARACTER. ACQUIRING MISSION STATUS REPORT FOR. ${metadata.Level} ${metadata.Power1} ${metadata.Power2} ${metadata.Power3}`,
    },
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.1,
    max_tokens: 300,
  });
  const openaiResponse = response.data as { choices: Choice[] };
  const rawOutput = openaiResponse.choices[0].message.content.trim();

  const healthAndStatusMatch = rawOutput.match(/(?:Current Health and Status: *)([^;\n]+)/i);
  const equipmentMatch = rawOutput.match(/(?:Equipment: *)([^;\n]+)/i);
  const abilitiesMatch = rawOutput.match(/(?:Abilities and Power level: *)([^;\n]+)/i);
  const funFactMatch = rawOutput.match(/(?:Fun Fact: *)([^;\n]+)/i);

  return {
    healthAndStatus: healthAndStatusMatch
      ? healthAndStatusMatch[1].trim()
      : "Health and status information is unavailable.",
    equipment: equipmentMatch ? equipmentMatch[1].trim() : "Equipment information is unavailable.",
    abilities: abilitiesMatch ? abilitiesMatch[1].trim() : "Abilities information is unavailable.",
    funFact: funFactMatch ? funFactMatch[1].trim() : "Fun fact information is unavailable.",
    rawOutput,
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { metadata } = req.body;
    console.log(metadata);
    try {
      const scannerOutput = await generateScannerOutput(metadata);

      res.status(200).json({ scannerOutput });
    } catch (error) {
      res.status(500).json({ error: "Error generating scanner output." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};
