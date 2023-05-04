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

async function chatWithCaptain(scanResults: string, metadata: object, userMessage: string) {
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: `You are the captain of a spaceship in the alliance of the infinite universe. Your ship has just received the following scan results: ${scanResults}. You have the following metadata: ${JSON.stringify(
        metadata,
      )}. You are now engaged in a conversation with the ship's operator.`,
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
    const { scanResults, metadata, userMessage } = req.body;
    try {
      const captainResponse = await chatWithCaptain(scanResults, metadata, userMessage);

      res.status(200).json({ captainResponse });
    } catch (error) {
      res.status(500).json({ error: "Error chatting with the captain." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};
