import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const AUTH_TOKEN = process.env.MIDJOURNEY_AUTH_TOKEN;
const endpoint = `https://api.thenextleg.io`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text } = req.body;

  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    };

    const response = await axios.post(
      `${endpoint}`,
      {
        cmd: "imagine",
        msg: text,
      },
      { headers },
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    res.status(error.response.status || 500).json({ message: error.message });
  }
}
