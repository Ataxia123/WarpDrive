// pages/api/buttonCommandWebhook.ts
import cache from "../../services/cache";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { imageUrl, buttonMessageId, originatingMessageId, content, type } = req.body;

  // Store the image URL in the cache
  cache.set(originatingMessageId, {
    messageId: originatingMessageId,
    imageUrl: imageUrl,
    buttonMessageId: buttonMessageId,
  });

  console.log("webhook received", { imageUrl, buttonMessageId, originatingMessageId, content, type });
  res.status(200).json({ message: "Webhook received" });
}
