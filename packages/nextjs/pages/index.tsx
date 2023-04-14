// index.tsx
import { useState } from "react";
import ReadAIU from "../components/ReadAIU";
import axios from "axios";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [waitingForWebhook, setWaitingForWebhook] = useState(false);
  const [description, setDescription] = useState<string>();
  const [selectedTokenId, setSelectedTokenId] = useState<string>();
  const [srcUrl, setSrcUrl] = useState<string>();

  const handleDescribeClick = async () => {
    console.log(`Submitting image URL: ${srcUrl}`);
    setLoading(true);

    if (waitingForWebhook) {
      console.log("Already waiting for webhook, please wait for response.");
      return;
    }

    setWaitingForWebhook(true);

    try {
      const r = await axios.post("/api/postDescription", { srcUrl });

      console.log("response", r.data);
      setResponse(JSON.stringify(r.data, null, 2));
      console.log("messageID", r.data.messageId);

      // Start waiting for webhook
      console.log("Waiting for webhook to be received...");

      // Poll the server to fetch the description from the cache
      let description;
      while (!description) {
        try {
          const fetchResponse = await axios.get(`/api/fetchDescription?messageId=${r.data.messageId}`);
          description = fetchResponse.data.description;
        } catch (error: any) {
          if (error.response.status !== 404) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
        }
      }

      setDescription(description);
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }

    setLoading(false);
    setWaitingForWebhook(false);
  };

  const handleClick = async () => {
    console.log(`Submitting my prompt: ${text}`);
    setLoading(true);

    if (waitingForWebhook) {
      console.log("Already waiting for webhook, please wait for response.");
      return;
    }

    setWaitingForWebhook(true);

    try {
      const r = await axios.post("/api/apiHandler", { text });

      console.log("response", r.data);
      setResponse(JSON.stringify(r.data, null, 2));
      console.log("messageID", r.data.messageId);

      // Start waiting for webhook
      console.log("Waiting for webhook to be received...");

      // Poll the server to fetch the image URL from the cache
      let imageUrl;
      while (!imageUrl) {
        try {
          const fetchResponse = await axios.get(`/api/fetchImageUrl?messageId=${r.data.messageId}`);
          imageUrl = fetchResponse.data.imageUrl;
        } catch (error: any) {
          if (error.response.status !== 404) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
        }
      }

      setImageUrl(imageUrl);
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }

    setLoading(false);
    setWaitingForWebhook(false);
  };
  const handleMetadataReceived = (metadata: any) => {
    console.log("Metadata received in the parent component:", metadata);
    // Handle the metadata here, e.g., update the state or call another function
  };

  const handleImageSrcReceived = (imageSrc: string) => {
    console.log("Image URL received in the parent component:", imageSrc);
    setSrcUrl(imageSrc);
    console.log(srcUrl);
    // Handle the imageSrc here, e.g., update the state or call another function
  };

  const handleSelectedTokenIdRecieved = (selectedTokenId: string) => {
    console.log("Token Selected Recieved received in the parent component:", selectedTokenId);
    setSelectedTokenId(selectedTokenId);
  };
  const handleTokenIdsReceived = (tokenIds: string[]) => {
    console.log("Token IDs received in the parent component:", tokenIds);
    // Handle the token IDs here, e.g., update the state or call another function
  };

  return (
    <div className="container mx-auto h-screen flex flex-col items-center justify-center ">
      <div className="w-full mx-auto px-20">
        <ReadAIU
          onSelectedTokenIdRecieved={handleSelectedTokenIdRecieved}
          onMetadataReceived={handleMetadataReceived} // Add this line
          onImageSrcReceived={handleImageSrcReceived}
          onTokenIdsReceived={handleTokenIdsReceived}
        />
        <div>
          {selectedTokenId && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 rounded"
              onClick={handleDescribeClick}
            >
              Describe
            </button>
          )}
        </div>
        {description && (
          <div>
            <h3>Description:</h3>
            <p>{description}</p>
          </div>
        )}
      </div>
      <div>
        {/* tailwindui.com */}
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Prompt
        </label>
        {imageUrl && <img src={imageUrl} className="w-full" alt="nothing" />}
        <div className="mt-2 flex space-x-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Enter your prompt here"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={async () => {
              handleClick();
            }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
        <div>ImageUrl: {imageUrl}</div>
        <pre>Response Message: {response}</pre>
        Error: {error}
      </div>
    </div>
  );
}
