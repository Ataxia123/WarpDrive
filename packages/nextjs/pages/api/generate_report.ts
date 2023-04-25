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

async function generateInterplanetaryStatusReport(selectedDescription: string, metadata: object) {
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: `You are a the targeting computer of a ship owned by an ally of ${JSON.stringify(
        metadata,
      )} in the alliance of the infinite universe. You're recieving signal requests from Captains of the alliance that you must interpret as mission assignments.`,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: `Metadata: Signal Identified: CREATE A MISSION SCENARIO AN STORY HOOK FOR ${selectedDescription};  ${JSON.stringify(
        metadata,
      )}`,
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
    const { selectedDescription, metadata } = req.body;
    try {
      const report = await generateInterplanetaryStatusReport(selectedDescription, metadata);

      res.status(200).json({ report });
    } catch (error) {
      res.status(500).json({ error: "Error generating interplanetary status report." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};
