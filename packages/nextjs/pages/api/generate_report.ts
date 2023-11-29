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
      content: `"You are ${metadata.Level}_${metadata.Power1}_${metadata.Power2}. Your attributes are: Side ${
        metadata.Side
      }, Alignment ${metadata.Alignment1}_${
        metadata.Alignment2
      }, and you are a member of the Alliance of the Infinite Universe. 
        sending a report through the targetting computer of a ship in the Alliance. you are in the midst of your latest assignment and are sending a status report asking for assistance.
        Interpret the current Situation Scan ${JSON.stringify(metadata.healthAndStatus)}${JSON.stringify(
        metadata.abilities,
      )}${JSON.stringify(metadata.equipment)}${JSON.stringify(
        metadata.funFact,
      )} and produce incoming InterplanetaryMissionReport. The mission report must set the context and introduce the characters for this mission. The mission"`,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: `"Location Scan Results Recieved: ${alienMessage}. Awaiting Interplanetary Status Report from ${metadata.Level}${metadata.Power1}${metadata.Power2}${metadata.Alignment1}${metadata.Alignment2}${metadata.Side}."`,
    },
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-4-1106-preview",
    messages,
    temperature: 1,
    max_tokens: 120500,
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
