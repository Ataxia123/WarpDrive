// pages/api/fetchButtonCommandResponse.ts
import cache from "../../services/cache";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const originatingMessageId = req.query.originatingMessageId as string;
  console.log("originatingMessageId", originatingMessageId);
  if (originatingMessageId && cache.has(originatingMessageId)) {
    const response = cache.get(originatingMessageId);
    cache.delete(originatingMessageId); // Remove the response from the cache
    res.status(200).json(response);
  } else {
    res.status(404).json({ message: "Response not found" });
  }
}
