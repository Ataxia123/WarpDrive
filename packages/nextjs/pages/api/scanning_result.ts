import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { Metadata } from "~~/types/appTypes";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function generateScannerOutput(metadata: Metadata) {
  const messages: any[] = [
    {
      role: "system",
      content: `You are an AI capable of generating scanner output for the following member of the Alliance of the Infinite Universe:${
        metadata.Level
      }${" "}${metadata.Power1} ${" "}${metadata.Power2}${" "}${
        metadata.Power3
      }. Generate scanner output based on the metadata available for the character in the following format: "Biometric Reading: {health_condition}; Current Equipment and Vehicle: {equipment}; Abilities and Power level: {abilities_level}; Fun Fact: {fun_fact}"`,
    },
    {
      role: "user",
      content: `Metata: ${JSON.stringify(metadata.Level)}${JSON.stringify(metadata.Power1)}${JSON.stringify(
        metadata.Power2,
      )}${JSON.stringify(metadata.Power3)}${JSON.stringify(metadata.Power4)}${JSON.stringify(
        metadata.Alignment1,
      )}${JSON.stringify(metadata.Alignment2)}${JSON.stringify(metadata.Side)},`,
    },
    {
      role: "user",
      content: `SCANNING INFORMATION RECIEVED. GENERATING SCANNER OUTPUT FOR ${metadata.Level}${" "}${
        metadata.Power1
      }${" "}${metadata.Power2}${" "}${metadata.Power3} of the AIU. `,
    },
  ];

  const stream = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: messages,
  });

  const rawOutput = stream.choices[0].message.content;
  const healthAndStatusMatch = rawOutput?.match(/(?:Biometric Reading: *)([^;\n]+)/i);
  const equipmentMatch = rawOutput?.match(/(?:Current Equipment and Vehicle: *)([^;\n]+)/i);
  const abilitiesMatch = rawOutput?.match(/(?:Abilities and Power level: *)([^;\n]+)/i);
  const funFactMatch = rawOutput?.match(/(?:Fun Fact: *)([^;\n]+)/i);

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
