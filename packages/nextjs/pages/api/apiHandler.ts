import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { TNL } from "tnl-midjourney-api";

const TNL_API_KEY = process.env.MIDJOURNEY_AUTH_TOKEN || "";

const BASE_URL = "https://api.thenextleg.io/v2";
const AUTH_TOKEN = TNL_API_KEY;
const AUTH_HEADERS = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
  "Content-Type": "application/json",
};

/**
 * A function to pause for a given amount of time
 */
function sleep(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * Continue polling a generation an image is completed, or fails.
 * You can also use a webhook to get notified when the image is ready.
 * It will contain the same response body as seen here.
 */
const fetchToCompletion: any = async (messageId: string, retryCount: number, maxRetry = 20) => {
  const imageRes = await fetch(`${BASE_URL}/message/${messageId}`, {
    method: "GET",
    headers: AUTH_HEADERS,
  });

  const imageResponseData = await imageRes.json();

  if (imageResponseData.progress === 100) {
    return imageResponseData;
  }

  if (imageResponseData.progress === "incomplete") {
    throw new Error("Image generation failed");
  }

  if (retryCount > maxRetry) {
    throw new Error("Max retries exceeded");
  }

  if (imageResponseData.progress && imageResponseData.progressImageUrl) {
    console.log("---------------------");
    console.log(`Progress: ${imageResponseData.progress}%`);
    console.log(`Progress Image Url: ${imageResponseData.progressImageUrl}`);
    console.log("---------------------");
  }

  await sleep(5000);
  return fetchToCompletion(messageId, retryCount + 1);
};

// we wrap it in a main function here so we can use async/await inside of it.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text: prompt } = req.body;
  /**   * GENERATE THE IMAGE
   */
  try {
    const imageRes = await fetch(`${BASE_URL}/imagine`, {
      method: "POST",
      headers: AUTH_HEADERS,

      body: JSON.stringify({ msg: prompt }),
    });

    const imageResponseData = await imageRes.json();
    console.log("\n=====================");
    console.log("IMAGE GENERATION MESSAGE DATA");
    console.log(imageResponseData);
    console.log("=====================");

    const completedImageData = await fetchToCompletion(imageResponseData.messageId, 0);

    console.log("\n=====================");
    console.log("COMPLETED IMAGE DATA");
    console.log(completedImageData);
    console.log("=====================");

    /**
     * INVOKE A VARIATION
     */
    const variationRes = await fetch(`${BASE_URL}/button`, {
      method: "POST",
      headers: AUTH_HEADERS,
      body: JSON.stringify({
        button: "V1",
        buttonMessageId: completedImageData.response.buttonMessageId,
      }),
    });

    const variationResponseData = await variationRes.json();
    console.log("\n=====================");
    console.log("IMAGE VARIATION MESSAGE DATA");
    console.log(variationResponseData);
    console.log("=====================");

    const completedVariationData = await fetchToCompletion(variationResponseData.messageId, 0);

    console.log("\n=====================");
    console.log("COMPLETED VARIATION DATA");
    console.log(completedVariationData);
    console.log("=====================");

    res.status(200).json(variationResponseData.response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
