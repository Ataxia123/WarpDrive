// index.tsx
import { useEffect, useState } from "react";
import Background from "../components/Background";
import Dashboard from "../components/Dashboard";
import AcquiringTarget from "../components/panels/AcquiringTarget";
import DescriptionPanel from "../components/panels/DescriptionPanel";
import PromptPanel from "../components/panels/PromptPanel";
import SpaceshipInterface from "../components/panels/SpaceshipInterface";
import TokenSelectionPanel from "../components/panels/TokenSelectionPanel";
import axios from "axios";
import GraphemeSplitter from "grapheme-splitter";
import { Configuration, OpenAIApi } from "openai";

type Metadata = {
  Level: string;
  Power1: string;
  Power2: string;
  Power3: string;
  Power4: string;
  Alignment1: string;
  Alignment2: string;
  Side: string;
};

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
  const [bgButtonMessageId, setBgButtonMessageId] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("assets/background.png");
  const [tempUrl, setTempUrl] = useState("");
  const [nijiFlag, setNijiFlag] = useState(false);
  const [vFlag, setVFlag] = useState(false);
  const [travelStatus, setTravelStatus] = useState<"NoTarget" | "AcquiringTarget" | "TargetAcquired">("NoTarget");
  const [interplanetaryStatusReport, setInterplanetaryStatusReport] = useState("");
  const [selectedDescription, setSelectedDescription] = useState(description[selectedDescriptionIndex]);

  useEffect(() => {
    setSelectedDescription(description[selectedDescriptionIndex]);
  }, [selectedDescriptionIndex]);

  const configuration = new Configuration({
    organization: "org-7cmuqricUOtf3dACGKD9Va7f",
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

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
    const keyword = type === "background" ? "The Planet Of" : "";
    const randomPlanet =
      "https://discovery.sndimg.com/content/dam/images/discovery/fullset/2022/9/alien%20planet%20GettyImages-913058614.jpg.rend.hgtvcom.406.406.suffix/1664497398007.jpeg";
    if (type === "background")
      return `${randomPlanet} ${keyword} ${power1} ${power2} ${power3} ${power4} ${alignment1} ${alignment2} ${selectedDescription} ${niji} ${v} viewed from space`.trim();

    return `${srcURL} ${keyword} ${level} ${power1} ${power2} ${power3} ${power4} ${alignment1} ${alignment2} ${side} ${selectedDescription} ${niji} ${v}`.trim();
  }

  useEffect(() => {
    if (selectedDescription !== undefined) {
      // Step 2: Call your new API route to generate the report
      const fetchInterplanetaryStatusReport = async () => {
        try {
          const response = await axios.post("/api/generate_report", {
            selectedDescription,
            metadata,
          });
          setInterplanetaryStatusReport(response.data.report);
        } catch (error) {
          console.error("Error fetching interplanetary status report:", error);
        }
      };

      fetchInterplanetaryStatusReport();
    }
  }, [selectedDescription]);

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
    if (type === "background") {
      setTravelStatus("AcquiringTarget");
    }
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
      if (type === "background") {
        setButtonMessageId(bgButtonMessageId);
        console.log("buttonMessageId", buttonMessageId);
      }
      const r = await axios.post("/api/postButtonCommand", { button, buttonMessageId });

      console.log("response", r.data);
      if (travelStatus === "AcquiringTarget") {
        setTravelStatus("TargetAcquired");
      }

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
      if (type === "character") {
        setImageUrl(imageUrl);
        setButtonMessageId(buttonId);
      } else setBackgroundImageUrl(imageUrl);
      setTravelStatus("NoTarget");

      setBgButtonMessageId(buttonId);
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

  useEffect(() => {
    if (travelStatus === "AcquiringTarget") {
      console.log("Button Message ID:", bgButtonMessageId);
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

  // make an array out of the metadata attributes
  const metadata: Metadata = {
    Level: level,
    Power1: power1,
    Power2: power2,
    Power3: power3,
    Power4: power4,
    Alignment1: alignment1,
    Alignment2: alignment2,
    Side: side,
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
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap" rel="stylesheet" />
      <div className="container mx-auto h-screen flex flex-col items-center justify-center space-y-8">
        <Dashboard>
          <SpaceshipInterface />
          <AcquiringTarget travelStatus={travelStatus} selectedTokenId={selectedTokenId} />
          <Background
            travelStatus={travelStatus}
            dynamicImageUrl={backgroundImageUrl}
            fixedImageUrl="assets/view.png"
          />
          <TokenSelectionPanel
            onMetadataReceived={handleMetadataReceived}
            onImageSrcReceived={handleImageSrcReceived}
            onTokenIdsReceived={handleTokenIdsReceived}
            onSelectedTokenIdRecieved={handleSelectedTokenIdRecieved}
            interplanetaryStatusReport={interplanetaryStatusReport}
          />
          <DescriptionPanel
            interplanetaryStatusReport={interplanetaryStatusReport}
            selectedTokenId={selectedTokenId}
            description={description}
            onDescriptionIndexChange={setSelectedDescriptionIndex}
            selectedDescriptionIndex={selectedDescriptionIndex}
            handleDescribeClick={handleDescribeClick}
          />
          <PromptPanel
            imageUrl={imageUrl}
            srcUrl={srcUrl}
            onSubmitPrompt={submitPrompt}
            onSubmit={submitPrompt}
            handleButtonClick={handleButtonClick}
            loading={loading}
            metadata={metadata}
            buttonMessageId={buttonMessageId}
          />
        </Dashboard>
      </div>
    </div>
  );
}
