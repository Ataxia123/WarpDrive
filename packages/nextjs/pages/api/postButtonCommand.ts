// pages/api/postButtonCommand.ts
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const AUTH_TOKEN = process.env.MIDJOURNEY_AUTH_TOKEN;
const endpoint = "https://api.thenextleg.io/v2/button/";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { button, buttonMessageId } = req.body;
  console.log("buttonMessageId ", buttonMessageId);
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    };

    const response = await axios.post(
      `${endpoint}`,
      {
        button: button,
        buttonMessageId: buttonMessageId,
        ref: "",
        webhookOverride: `${process.env.BASE_URL}/api/buttonCommandWebhook`,
      },
      { headers },
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    res.status(error.response.status || 500).json({ message: error.message });
  }
}
