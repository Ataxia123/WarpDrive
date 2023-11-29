// /pages/api/generateAlienLanguage.ts
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

async function generateAlienLanguage(englishMessage: string, metadata: any) {
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: `"You are the targetting computer of a ship in the Alliance of the Infinite Universe. You have just recieved a transmission from  ${metadata.Level} ${metadata.Power1} ${metadata.Power2} ${metadata.Power3}. and need to triangulate the following information: Coordinates, Sistem and Planet name, An enviromental analysis and a historical fact about the location in question. Use the Message information to come up with the report using your creativity."`,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: `"Scanning Results Recieved ${metadata}${englishMessage}. Scan target location."`,
    },
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-4-1106-preview",
    messages,
    temperature: 1,
    max_tokens: 120050,
  });

  const openaiResponse = response.data as { choices: Choice[] };
  return openaiResponse.choices[0].message.content.trim();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { englishMessage, metadata } = req.body;
    try {
      const alienMessage = await generateAlienLanguage(englishMessage, metadata);

      res.status(200).json({ alienMessage });
    } catch (error) {
      res.status(500).json({ error: "Error generating alien language." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};
