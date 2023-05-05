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
//
async function generateInterplanetaryStatusReport(scannerOutput: object, metadata: Metadata, alienMessage: string) {
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: `"You are the targetting computer of a ship in the Alliance of the Infinite Universe. You have just recieved a transmission from  ${
        metadata.Level
      } ${metadata.Power1} ${metadata.Power2} ${
        metadata.Power3
      }. You have scanned their current Situation ${JSON.stringify(
        scannerOutput,
      )} and need decode the incoming InterplanetaryMissionReport. THe mission report should be a story vignette detailing the latest adventure of the Target in question. "`,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: `"Scanning Results Recieved ${alienMessage}. Awaiting Interplanetary Status Report."`,
    },
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.3,
    max_tokens: 500,
  });

  const openaiResponse = response.data as { choices: Choice[] };
  return openaiResponse.choices[0].message.content.trim();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { selectedDescription, metadata, extraText } = req.body;
    try {
      const report = await generateInterplanetaryStatusReport(selectedDescription, metadata, extraText);

      res.status(200).json({ report });
    } catch (error) {
      res.status(500).json({ error: "Error generating interplanetary status report." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};
