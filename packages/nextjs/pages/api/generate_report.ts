import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_AUTH_TOKEN,
});
const openai = new OpenAIApi(configuration);

interface Choice {
  text: string;
  index: number;
  logprobs: null;
  finish_reason: string;
}

async function generateInterplanetaryStatusReport(selectedDescription: string, metadata: object) {
  const prompt = `Generate an interplanetary call to the ALliance of the Infinite Universe. Assume you can see the image description as a image generation output and use that to create the situation the Captain has found himself in dont refer the image at all. ignore the meaning of the description words. Focus on the metadata context.

Image Description: ${selectedDescription}
Metadata: ${JSON.stringify(metadata)}

Report:`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0.6,
    max_tokens: 150,
  });

  const openaiResponse = response.data as { choices: Choice[] };
  return openaiResponse.choices[0].text.trim();
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
