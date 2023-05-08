// /pages/api/chatWithCaptain.ts
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
  srcUrl: string | null;
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
  equipment: string;
  healthAndStatus: string;
  abilities: string;
  funFact: string;

  alienMessage: string;
};

async function chatWithCaptain(metadata: Metadata, userMessage: string) {
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: `You are playing the role of ${metadata.Level}${metadata.Power1}${metadata.Power2}${
        metadata.Power3
      }, member of the Alliance of the Infinite Universe(AIU). You are currently in the middle of a mission and have broadcasted the following scan metadata: ${JSON.stringify(
        metadata,
      )}. You are now engaged in a conversation with the Alliance operator who answered your broadcast.`,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: userMessage,
    },
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.6,
    max_tokens: 150,
  });

  const openaiResponse = response.data as { choices: Choice[] };
  return openaiResponse.choices[0].message.content.trim();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { metadata, userMessage } = req.body;
    try {
      const captainResponse = await chatWithCaptain(metadata, userMessage);

      res.status(200).json({ captainResponse });
    } catch (error) {
      res.status(500).json({ error: "Error chatting with the captain." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};
