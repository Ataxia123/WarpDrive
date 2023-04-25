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
import { MarqueePanel } from "~~/components/panels/MarqueePannel";

type Metadata = {
  srcUrl: string | undefined;
  Level: string;
  Power1: string;
  Power2: string;
  Power3: string;
  Power4: string;
  Alignment1: string;
  Alignment2: string;
  Side: string;
  interplanetaryStatusReport: string;
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

  const [backgroundImageUrl, setBackgroundImageUrl] = useState("assets/background.png");
  const [tempUrl, setTempUrl] = useState("");
  const [nijiFlag, setNijiFlag] = useState(false);
  const [vFlag, setVFlag] = useState(false);
  const [travelStatus, setTravelStatus] = useState<"NoTarget" | "AcquiringTarget" | "TargetAcquired">("NoTarget");
  const [interplanetaryStatusReport, setInterplanetaryStatusReport] = useState("");
  const [selectedDescription, setSelectedDescription] = useState(description[selectedDescriptionIndex]);
  const [modifiedPrompt, setModifiedPrompt] = useState("");
  const [warped, setWarped] = useState(false);
  const [warping, setWarping] = useState(false);

  const handleEngaged = (engaged: boolean) => {
    if (engaged === true) {
      setWarping(!warping);
      console.log("WARP DRIVE IS ENGAGED", { warping, engaged });
    }
  };

  useEffect(() => {
    setSelectedDescription(description[selectedDescriptionIndex]);
  }, [selectedDescriptionIndex]);

  function generatePrompt(
    type: "character" | "background",
    srcUrl: string | undefined,
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
    interplanetaryStatusReport: string | "",
  ): string {
    const niji = nijiFlag ? "--niji 5" : "";
    const v = vFlag ? "--v 5" : "";
    const keyword = type === "background" ? "The Planet Of" : "";
    const randomPlanet =
      "https://discovery.sndimg.com/content/dam/images/discovery/fullset/2022/9/alien%20planet%20GettyImages-913058614.jpg.rend.hgtvcom.406.406.suffix/1664497398007.jpeg";
    if (type === "background")
      return `${randomPlanet} ${keyword} ${power1} ${power2} ${power3} ${power4} ${alignment1} ${alignment2} ${selectedDescription} ${niji} ${v} viewed from space`.trim();

    return `${srcUrl} ${keyword} ${level} ${power1} ${power2} ${power3} ${power4} ${alignment1} ${alignment2} ${side} ${selectedDescription} ${interplanetaryStatusReport} ${niji} ${v}`.trim();
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
    let prompt = generatePrompt(
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
      interplanetaryStatusReport,
    );

    if (waitingForWebhook) {
      console.log("Already waiting for webhook, please wait for response.");
      return;
    }
    setWaitingForWebhook(true);
    if (type === "character") {
      prompt = modifiedPrompt;
      setWarped(true);
      setWarping(true);
      console.log("WARP DRIVE IS CHARACTER IN ENGAGED", { warping, warped });
    }

    try {
      const r = await axios.post("/api/apiHandler", { text: prompt });

      console.log("response", r.data);
      setResponse(JSON.stringify(r.data, null, 2));
      console.log("messageID", r.data.messageId);

      // Poll the server to fetch the image URL from the cache
      let imageUrl, ImagineCommandResponse, messageId;
      while (!ImagineCommandResponse) {
        try {
          const fetchResponse = await axios.get(`/api/fetchImageUrl?messageId=${r.data.messageId}`);
          ImagineCommandResponse = fetchResponse.data;
          imageUrl = fetchResponse.data.imageUrl;
          messageId = fetchResponse.data.buttonMessageId;
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
        setButtonMessageId(messageId);
        setWarping(false);
        setTravelStatus("NoTarget");
      } else {
        setTempUrl(imageUrl);
        setButtonMessageId(messageId);
      }
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }
    setWaitingForWebhook(false);
  };

  const handleButtonClick = async (button: string, type: "character" | "background") => {
    if (waitingForWebhook) {
      console.log("Already waiting for webhook, please wait for response.");
      return;
    }
    setWaitingForWebhook(true);

    try {
      if (type === "background") {
        console.log("buttonMessageId", buttonMessageId);
      }
      const r = await axios.post("/api/postButtonCommand", { button, buttonMessageId });

      console.log("response", r.data);
      if (travelStatus === "AcquiringTarget") {
        setTravelStatus("TargetAcquired");
        setWarping(true);
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
        setWarping(false);
        setButtonMessageId(buttonId);
        setTravelStatus("NoTarget");
      } else setBackgroundImageUrl(imageUrl);
      setWarping(false);
      setTravelStatus("NoTarget");

      setButtonMessageId(buttonId);
      console.log("Button Command Response:", buttonCommandResponse);
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }
    setWaitingForWebhook(false);
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
  // add logic so that user can click instead of timeout
  useEffect(() => {
    if (travelStatus === "AcquiringTarget" && srcUrl !== "") {
      //await 5 seconds
      setTimeout(() => {
        submitPrompt("background");
      }, 5000);

      console.log("waiting for 10 seconds");
    }
    return console.log("Tried to Generate new background but", { travelStatus, srcUrl });
  }, [selectedDescriptionIndex]);

  useEffect(() => {
    if (travelStatus == "AcquiringTarget" && tempUrl !== "") {
      handleButtonClick("U1", "background");
    }
    return console.log("Tried to Upscale new background but", { travelStatus, tempUrl });
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
    srcUrl: srcUrl,
    Level: level,
    Power1: power1,
    Power2: power2,
    Power3: power3,
    Power4: power4,
    Alignment1: alignment1,
    Alignment2: alignment2,
    Side: side,
    interplanetaryStatusReport: interplanetaryStatusReport,
  };

  const handleImageSrcReceived = (imageSrc: string) => {
    setSrcUrl(imageSrc);

    console.log(srcUrl);
    // Handle the imageSrc here, e.g., update the state or call another function
  };
  const handleModifedPrompt = (modifiedPrompt: string) => {
    setModifiedPrompt(modifiedPrompt);
  };
  const handleSelectedTokenIdRecieved = (selectedTokenId: string) => {
    setSelectedTokenId(selectedTokenId);
  };
  const handleTokenIdsReceived = (tokenIds: string[]) => {
    // Handle the token IDs here, e.g., update the state or call another function
  };
  console.log(description);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap" rel="stylesheet" />
        <div className="container mx-auto h-screen flex flex-col items-center justify-center space-y-8">
          <Dashboard
            response={response}
            error={error}
            warping={warping}
            interplanetaryStatusReport={interplanetaryStatusReport}
            warped={warped}
            imageUrl={imageUrl}
            srcUrl={srcUrl}
            onSubmitPrompt={submitPrompt}
            onSubmit={submitPrompt}
            handleButtonClick={handleButtonClick}
            loading={loading}
            metadata={metadata}
            buttonMessageId={buttonMessageId}
            travelStatus={travelStatus}
            dynamicImageUrl={backgroundImageUrl}
          >
            <SpaceshipInterface />
            <AcquiringTarget loading={loading} travelStatus={travelStatus} selectedTokenId={selectedTokenId} />

            <TokenSelectionPanel
              buttonMessageId={buttonMessageId}
              handleButtonClick={handleButtonClick}
              modifiedPrompt={modifiedPrompt}
              setWarping={setWarping}
              setTravelStatus={setTravelStatus}
              handleEngaged={handleEngaged}
              engaged={warping}
              onMetadataReceived={handleMetadataReceived}
              onImageSrcReceived={handleImageSrcReceived}
              onTokenIdsReceived={handleTokenIdsReceived}
              onSelectedTokenIdRecieved={handleSelectedTokenIdRecieved}
              interplanetaryStatusReport={interplanetaryStatusReport}
              onSubmit={submitPrompt}
              travelStatus={travelStatus}
            />
            <DescriptionPanel
              travelStatus={travelStatus}
              interplanetaryStatusReport={interplanetaryStatusReport}
              selectedTokenId={selectedTokenId}
              description={description}
              onDescriptionIndexChange={setSelectedDescriptionIndex}
              selectedDescriptionIndex={selectedDescriptionIndex}
              handleDescribeClick={handleDescribeClick}
            />
            <PromptPanel
              handleEngaged={handleEngaged}
              travelStatus={travelStatus}
              warped={warped}
              engaged={warped}
              setModifiedPrompt={handleModifedPrompt}
              imageUrl={imageUrl}
              interplanetaryStatusReport={interplanetaryStatusReport}
              description={selectedDescription ? selectedDescription : "No Description"}
              srcUrl={srcUrl}
              onSubmitPrompt={submitPrompt}
              onSubmit={submitPrompt}
              handleButtonClick={handleButtonClick}
              loading={loading}
              metadata={metadata}
              buttonMessageId={buttonMessageId}
              generatePrompt={generatePrompt}
            />
            <div></div>
          </Dashboard>
        </div>
      </div>
    </>
  );
}
