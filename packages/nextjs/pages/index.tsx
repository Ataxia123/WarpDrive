// index.tsx
import { useEffect, useState } from "react";
import ReadAIU from "../components/ReadAIU";
import axios from "axios";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [waitingForWebhook, setWaitingForWebhook] = useState(false);
  const [description, setDescription] = useState<string[]>([]);
  const [selectedDescriptionIndex, setSelectedDescriptionIndex] = useState<number>(0);
  const [selectedTokenId, setSelectedTokenId] = useState<string>();
  const [srcUrl, setSrcUrl] = useState<string>();
  const [level, setLevel] = useState("");
  const [power1, setPower1] = useState("");
  const [power2, setPower2] = useState("");
  const [power3, setPower3] = useState("");
  const [alignment1, setAlignment1] = useState("");
  const [alignment2, setAlignment2] = useState("");
  const [side, setSide] = useState("");

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

  useEffect(() => {
    function generatePrompt(
      srcURL: string | undefined,
      level: string,
      power1: string,
      power2: string,
      alignment1: string,
      alignment2: string,
      side: string,
      selectedDescription: string,
    ): string {
      return `${srcURL} ${level} ${power1} ${power2} ${alignment1} ${alignment2} ${side} ${selectedDescription}`;
    }

    const prompt = generatePrompt(
      srcUrl,
      level,
      power1,
      power2,
      alignment1,
      alignment2,
      side,
      description[selectedDescriptionIndex],
    );
    setText(prompt);
  }, [srcUrl, level, power1, power2, power3, alignment1, alignment2, side, selectedDescriptionIndex, description]);

  const handleMetadataReceived = (metadata: any) => {
    console.log("Metadata received in the parent component:", metadata);

    // Extract the attributes from the metadata
    const attributes = metadata.attributes.reduce((acc: any, attr: any) => {
      acc[attr.trait_type] = attr.value;
      return acc;
    }, {});

    // Update the state variables
    setLevel(attributes.Level);
    setPower1(attributes["Power 1"]);
    setPower2(attributes["Power 2"]);
    setPower3(attributes["Power 3"]); // Assuming there is a Power 3 attribute in the metadata
    setAlignment1(attributes["Alignment 1"]);
    setAlignment2(attributes["Alignment 2"]);
    setSide(attributes.Side);
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
  console.log(description);

  return (
    <div className="container mx-auto h-screen flex flex-col items-center justify-center space-y-8">
      <div className="w-full px-8">
        <ReadAIU
          onSelectedTokenIdRecieved={handleSelectedTokenIdRecieved}
          onMetadataReceived={handleMetadataReceived}
          onImageSrcReceived={handleImageSrcReceived}
          onTokenIdsReceived={handleTokenIdsReceived}
        />
        {selectedTokenId && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 rounded"
            onClick={handleDescribeClick}
          >
            Describe
          </button>
        )}
      </div>

      <div className="w-full px-8">
        <h2 className="text-xl font-bold mb-2">Prompt</h2>
        {imageUrl && <img src={imageUrl} className="w-full rounded shadow-md mb-4" alt="nothing" />}
        <div className="flex space-x-2">
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
        <div className="mt-4">
          <p className="font-semibold">ImageUrl:</p>
          <p>{imageUrl}</p>
        </div>
        <div className="mt-4">
          <p className="font-semibold">Response Message:</p>
          <pre>{response}</pre>
        </div>
        <div className="mt-4 text-red-600">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      </div>

      {description && (
        <div className="w-full px-8">
          <h3 className="text-xl font-bold mb-2">Description:</h3>
          <p>{description[selectedDescriptionIndex]}</p>
          <select
            value={selectedDescriptionIndex}
            onChange={e => setSelectedDescriptionIndex(Number(e.target.value))}
            className="block w-full mt-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            {description.map((desc, index) => (
              <option key={index} value={index}>
                {desc}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
