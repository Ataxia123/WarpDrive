// pages/api/postDescription.ts
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const AUTH_TOKEN = process.env.MIDJOURNEY_AUTH_TOKEN;
const endpoint = `https://api.thenextleg.io`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { srcUrl } = req.body;
  console.log("imageUrl", srcUrl);

  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    };

    const response = await axios.post(
      `${endpoint}`,
      {
        cmd: "describe",
        url: srcUrl,
        webhookOverride: `${process.env.BASE_URL}/api/describeWebhook`,
      },
      { headers },
    );

    console.log("response", response.data);
    console.log("messageID", response.data.messageId);

    // Start waiting for webhook
    console.log("Waiting for webhook to be received...");

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    res.status(error.response.status || 500).json({ message: error.message });
  }
}
