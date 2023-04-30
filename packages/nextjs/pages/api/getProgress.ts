import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const AUTH_TOKEN = process.env.MIDJOURNEY_AUTH_TOKEN;
const endpoint = "https://api.thenextleg.io";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { messageId, expireMins = 2 } = req.query;

  console.log("messageId:", messageId);
  console.log("expireMins:", expireMins);

  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    };

    const response = await axios.get(`${endpoint}/v2/message/${messageId}?expireMins=${expireMins}`, { headers });

    console.log("apiResponse:", response.data);

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    res.status(error.response.status || 500).json({ message: error.message });
  }
}
