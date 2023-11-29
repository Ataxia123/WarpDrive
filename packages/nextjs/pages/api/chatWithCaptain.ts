import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { Metadata } from "~~/types/appTypes";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function chatWithCaptain(metadata: Metadata, userMessage: string) {
  const messages: any[] = [
    {
      role: "system",
      content: `You are playing the role of ${metadata.Level}${metadata.Power1}${metadata.Power2}${
        metadata.Power3
      }, member of the Alliance of the Infinite Universe(AIU). You are currently in the middle of a mission and have broadcasted the following scan metadata: ${JSON.stringify(
        metadata,
      )}. You are now engaged in a conversation with the Alliance operator who answered your broadcast.`,
    },
    {
      role: "user",
      content: userMessage,
    },
  ];

  const stream = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: messages,
  });

  const rawOutput = stream.choices[0].message.content;
  const openAIResponse = rawOutput?.trim();
  return openAIResponse;
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
