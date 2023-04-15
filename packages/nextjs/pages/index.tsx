// index.tsx
import { useEffect, useState } from "react";
import ReadAIU from "../components/ReadAIU";
import axios from "axios";
import GraphemeSplitter from "grapheme-splitter";

export default function Home() {
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
  const [power4, setPower4] = useState("");
  const [alignment1, setAlignment1] = useState("");
  const [alignment2, setAlignment2] = useState("");
  const [side, setSide] = useState("");
  const [buttonMessageId, setButtonMessageId] = useState("");
  const [nijiFlag, setNijiFlag] = useState(false);
  const [vFlag, setVFlag] = useState(false);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [tempUrl, setTempUrl] = useState("");

  function generatePrompt(
    type: "character" | "background",
    srcURL: string | undefined,
    level: string,
    power1: string,
    power2: string,
    power3: string | "",
    power4: string | "",
    alignment1: string,
    alignment2: string,
    selectedDescription: string,
    nijiFlag: boolean,
    vFlag: boolean,
    side: string | "",
  ): string {
    const niji = nijiFlag ? "--niji 5" : "";
    const v = vFlag ? "--v 5" : "";
    const keyword = type === "background" ? "Abstract Barren Landscape" : "";
    if (type === "background")
      return `${srcURL} ${keyword} ${power1} ${power2} ${power3} ${power4} ${alignment1} ${alignment2} ${selectedDescription} ${niji} ${v}`.trim();

    return `${srcURL} ${keyword} ${level} ${power1} ${power2} ${power3} ${power4} ${alignment1} ${alignment2} ${side} ${selectedDescription} ${niji} ${v}`.trim();
  }

  const submitPrompt = async (type: "character" | "background") => {
    const prompt = generatePrompt(
      type,
      srcUrl,
      level,
      power1,
      power2,
      power3,
      power4,
      alignment1,
      alignment2,
      description[selectedDescriptionIndex],
      nijiFlag,
      vFlag,
      side,
    );

    try {
      const r = await axios.post("/api/apiHandler", { text: prompt });

      console.log("response", r.data);
      setResponse(JSON.stringify(r.data, null, 2));
      console.log("messageID", r.data.messageId);

      // Poll the server to fetch the image URL from the cache
      let imageUrl, ImagineCommandResponse, bmessageId;
      while (!ImagineCommandResponse) {
        try {
          const fetchResponse = await axios.get(`/api/fetchImageUrl?messageId=${r.data.messageId}`);
          ImagineCommandResponse = fetchResponse.data;
          imageUrl = fetchResponse.data.imageUrl;
          bmessageId = fetchResponse.data.buttonMessageId;
        } catch (error: any) {
          if (error.response.status !== 404) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
        }
      }

      // Set the appropriate state based on the type
      if (type === "character") {
        setImageUrl(imageUrl);
        setButtonMessageId(bmessageId);
      } else {
        setTempUrl(imageUrl);
        setButtonMessageId(bmessageId);
      }
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }
  };

  const handleButtonClick = async (button: string, type: "character" | "background") => {
    try {
      const r = await axios.post("/api/postButtonCommand", { button, buttonMessageId });

      console.log("response", r.data);

      // Poll the server to fetch the response from the cache
      let buttonCommandResponse, buttonId, imageUrl;
      while (!buttonCommandResponse) {
        try {
          const fetchResponse = await axios.get(
            `/api/fetchButtonCommandResponse?originatingMessageId=${r.data.messageId}`,
          );
          buttonCommandResponse = fetchResponse.data;
          buttonId = buttonCommandResponse.buttonMessageId;
          imageUrl = buttonCommandResponse.imageUrl;
        } catch (error: any) {
          if (error.response.status !== 404) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
        }
      }
      if (type === "character") setImageUrl(imageUrl);
      else setBackgroundImageUrl(imageUrl);

      setButtonMessageId(buttonId);
      console.log("Button Command Response:", buttonCommandResponse);
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }
  };

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

      // Remove the first grapheme (emoji) from each string in the description array
      const splitter = new GraphemeSplitter();
      const cleanedDescription = description.map((desc: string) => {
        const graphemes = splitter.splitGraphemes(desc);
        return graphemes.slice(1).join("");
      });

      setDescription(cleanedDescription);
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }

    setLoading(false);
    setWaitingForWebhook(false);
  };

  const AvailableButtons = () => {
    const buttons = ["U1", "U2", "U3", "U4", "🔄", "V1", "V2", "V3", "V4"];
    return (
      <div>
        {buttons.map(button => (
          <button key={button} onClick={() => handleButtonClick(button, "character")}>
            {button}
          </button>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (tempUrl && tempUrl !== "") {
      handleButtonClick("U1", "background");
    }
  }, [tempUrl]);

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
    setPower4(attributes["Power 4"]); // Assuming there is a Power 4 attribute in the metadata
    setAlignment1(attributes["Alignment 1"]);
    setAlignment2(attributes["Alignment 2"]);
    setSide(attributes.Side);
  };

  const handleImageSrcReceived = (imageSrc: string) => {
    console.log("Image URL received in the parent component:", imageSrc);
    setSrcUrl(imageSrc);
    submitPrompt("background");
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
    <div
      className="background-container"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto h-screen flex flex-col items-center justify-center space-y-8">
        <div className="w-full px-8">
          {!srcUrl && (
            <div className="w-full px-8">
              <h3 className="text-xl font-bold mb-2">This App reads your AI-Universe Character Balance:</h3>
              <h4> Mint a character at </h4>
              <a href="https://ai-universe.com/" target="_blank" rel="noreferrer">
                <h4 className="text-blue-500">https://ai-universe.com/</h4>
              </a>

              <h3 className="text-xl font-bold mb-2">Select a token:</h3>
              <p>Click on a token to select it.</p>
            </div>
          )}
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

        <div className="w-full px-8">
          <h2 className="text-xl font-bold mb-2">Prompt</h2>
          {imageUrl && <img src={imageUrl} className="w-full rounded shadow-md mb-4" alt="nothing" />}
          <AvailableButtons />
          <div className="flex space-x-2">
            {/* ... other component JSX */}
            <label>
              <input type="checkbox" checked={nijiFlag} onChange={() => setNijiFlag(!nijiFlag)} />
              --niji 5
            </label>
            <label>
              <input type="checkbox" checked={vFlag} onChange={() => setVFlag(!vFlag)} />
              --v 5
            </label>
            {srcUrl ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={async () => {
                  submitPrompt("character");
                }}
                disabled={loading || !srcUrl}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <div>
                <p>Get AIU</p>
              </div>
            )}
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
      </div>
    </div>
  );
}
