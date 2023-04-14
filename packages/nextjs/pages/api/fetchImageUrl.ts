// pages/api/fetchImageUrl.ts
import cache from "../../services/cache";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const messageId = req.query.messageId as string;
  console.log("messageId", messageId);
  if (messageId && cache.has(messageId)) {
    const imageUrl = cache.get(messageId)?.imageUrl;
    const buttonMessageId = cache.get(messageId)?.buttonMessageId;
    cache.delete(messageId); // Remove the image URL from the cache
    res.status(200).json({ imageUrl, buttonMessageId });
  } else {
    res.status(404).json({ message: "Image not found" });
  }
}
