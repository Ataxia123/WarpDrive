// pages/api/fetchDescription.ts
import cache from "../../services/cache";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const messageId = req.query.messageId as string;
  console.log("messageId", messageId);
  if (messageId && cache.has(messageId)) {
    const description = cache.get(messageId)?.description;
    cache.delete(messageId); // Remove the description from the cache
    res.status(200).json({ description });
  } else {
    res.status(404).json({ message: "Description not found" });
  }
}
