//
//     "createdAt": {
//         "_nanoseconds": 215000000,
//         "_seconds": 1678840347
//     },
//     "originatingMessageId": "your-message-id",
//     "content": ["1️⃣ girl with pink hair wearing blue with red stars on her eyes, in the style of daz3d, ethereal cloudscapes, sailor moon manga style, the stars art group (xing xing), feminine body, loose forms, gentle color palette --ar 50:93",
//     "2️⃣ senria starry eyed anime girl, in the style of michael page, subtle pastel hues, daz3d, james jean, white and pink, romanticized figures, colorful cartoon --ar 50:93",
//     "3️⃣ a girl with blue hair and stars on her arms, in the style of light pink and light crimson, realistic hyper-detailed rendering, yanjun cheng, cartoon mis-en-scene, feminine body, dollcore, pseudo-realistic --ar 50:93",
//     "4️⃣ a picture of a woman with pink and blue hair, in the style of hyperrealistic fantasy, sailor moon manga style, romanticized figures, the stars art group (xing xing), feminine body, texture exploration, tinycore --ar 50:93"
//     ],
//     "ref": "",
//     "type": "describe",
//     "responseAt": "2023-04-04T13:06:01.927Z"
// }
// describeWebhook.ts
import cache from "../../services/cache";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { content, originatingMessageId } = req.body;

  // Store the image URL in the cache
  cache.set(originatingMessageId, { messageId: originatingMessageId, description: content });

  console.log("webhook received", { content, originatingMessageId });
  res.status(200).json({ message: "Webhook received" });
}
