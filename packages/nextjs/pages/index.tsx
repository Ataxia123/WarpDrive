// index.tsx
import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import AcquiringTarget from "../components/panels/AcquiringTarget";
import DescriptionPanel from "../components/panels/DescriptionPanel";
import PromptPanel from "../components/panels/PromptPanel";
import SpaceshipInterface from "../components/panels/SpaceshipInterface";
import TokenSelectionPanel from "../components/panels/TokenSelectionPanel";
import { useAppStore } from "../services/store/store";
import axios from "axios";
import GraphemeSplitter from "grapheme-splitter";

type Metadata = {
  srcUrl: string | "";
  Level: string;
  Power1: string;
  Power2: string;
  Power3: string;
  Power4: string;
  Alignment1: string;
  Alignment2: string;
  Side: string;
  interplanetaryStatusReport: string;
  selectedDescription: string;
  nijiFlag: boolean;
  vFlag: boolean;
};

type StoreState = {
  interplanetaryStatusReports: string[];
  scanningResults: string[][];
  imagesStored: string[];
};

export default function Home() {
  const [appState, setAppState] = useState({
    loading: false,
    loadingProgress: 0,
    originatingMessageId: "",
    error: "",
    response: "",
    imageUrl: "",
    waitingForWebhook: false,
    description: [],
    selectedDescriptionIndex: 0,
    selectedTokenId: undefined,
    srcUrl: undefined,
    level: "",
    power1: "",
    power2: "",
    power3: "",
    power4: "",
    alignment1: "",
    alignment2: "",
    side: "",
    buttonMessageId: "",
    backgroundImageUrl: "assets/background.png",
    tempUrl: "",
    nijiFlag: false,
    vFlag: false,
    travelStatus: "NoTarget",
    prevTravelStatus: "",
    interplanetaryStatusReport: "",
    selectedDescription: "",
    modifiedPrompt: "ALLIANCE OF THE INFINITE UNIVERSE",
    warping: false,
    scanning: false,
    preExtraText: "",
    AfterExtraText: "",
  });
  //session storage

  const {
    loadingProgress,
    loading,
    prevTravelStatus,
    error,
    response,
    imageUrl,
    waitingForWebhook,
    description,
    selectedDescriptionIndex,
    selectedTokenId,
    srcUrl,
    level,
    power1,
    power2,
    power3,
    power4,
    alignment1,
    alignment2,
    side,
    buttonMessageId,
    backgroundImageUrl,
    originatingMessageId,
    tempUrl,
    nijiFlag,
    vFlag,
    travelStatus,
    interplanetaryStatusReport,
    selectedDescription,
    modifiedPrompt,
    warping,
    scanning,
    preExtraText,
    AfterExtraText,
  } = appState;

  const setTravels = useAppStore(state => state.setTravels);
  const setBackgroundImageUrl = useAppStore(state => state.setBackgroundImageUrl);
  const setDisplayImageUrl = useAppStore(state => state.setdisplayImageUrl);
  const handleApiResponse = useAppStore(state => state.handleApiResponse);
  const setMetadata = useAppStore(state => state.setMetadata);
  const travels = useAppStore(state => state.travels);

  function updateTravelMetadata() {
    // Collect all the required information for the travel metadata

    // Update the metadata state in the Zustand store
    setMetadata(metadata);
  }
  function createTravelResult() {
    // Collect all the required information for the travel result

    updateTravelMetadata();
    const travelResult = {
      metadata: metadata,
      backgroundImageUrl: backgroundImageUrl,
      apiResponses: error ? error : response,
      timestamp: new Date(),
    };

    return travelResult;
  }

  function updateAllData() {
    // Update travels state
    const newTravelResult = createTravelResult();
    setTravels(newTravelResult);

    // Update apiResponses and errors state

    handleApiResponse(response, error);

    // Update backgroundImageUrl state
    const imageUrl = "exampleImageUrl";
    const type = "background";
  }

  useEffect(() => {
    updateState("prevTravelStatus", travelStatus);
  }, [travelStatus]);

  useEffect(() => {
    if (travelStatus === "NoTarget" && prevTravelStatus === "TargetAcquired") {
      updateAllData();
      console.log(travels);
    }
  }, [travelStatus]);

  const handleActiveSate = (imageUrl: string, selectedDescription: string, interplanetaryStatusReport: string) => {
    setAppState(prevState => ({
      ...prevState,
      imageUrl: imageUrl,
      selectedDescription: selectedDescription,
      interplanetaryStatusReport: interplanetaryStatusReport,
    }));
  };

  const [storeState, setStoreState] = useState<StoreState>({
    interplanetaryStatusReports: [],
    scanningResults: [],
    imagesStored: [],
  });

  const handleClearAppState = () => {
    setStoreState({
      interplanetaryStatusReports: [],
      scanningResults: [],
      imagesStored: [],
    });
  };

  useEffect(() => {
    setStoreState(prevState => ({
      ...prevState,
      interplanetaryStatusReports: [...prevState.interplanetaryStatusReports, interplanetaryStatusReport],
    }));
  }, [interplanetaryStatusReport]);

  useEffect(() => {
    setStoreState(prevState => ({
      ...prevState,
      scanningResults: [...prevState.scanningResults, description],
    }));
  }, [description]);

  useEffect(() => {
    setStoreState(prevState => ({
      ...prevState,
      imagesStored: [...prevState.imagesStored, imageUrl],
    }));
  }, [imageUrl]);

  const metadata: Metadata = {
    srcUrl: srcUrl || "",
    Level: level,
    Power1: power1,
    Power2: power2,
    Power3: power3,
    Power4: power4,
    Alignment1: alignment1,
    Alignment2: alignment2,
    Side: side,
    interplanetaryStatusReport: interplanetaryStatusReport,
    selectedDescription: selectedDescription,
    nijiFlag: nijiFlag,
    vFlag: vFlag,
  };

  const updateState = (key: string, value: any) => {
    setAppState(prevState => ({ ...prevState, [key]: value }));
  };

  useEffect(() => {
    if (travelStatus == "TargetAcquired" && scanning === true) {
      handleButtonClick("U1", "background");
      updateState("scanning", false);
    }
    return console.log("Tried to Upscale new background but", { travelStatus, scanning });
  }, [scanning]);

  const handleMetadataReceived = (metadata: any) => {
    console.log("Metadata received in the parent component:", metadata);

    // Extract the attributes from the metadata
    const attributes = metadata.attributes.reduce((acc: any, attr: any) => {
      acc[attr.trait_type] = attr.value;
      return acc;
    }, {});

    // Update the state variables
    updateState("level", attributes.Level);
    updateState("power1", attributes["Power 1"]);
    updateState("power2", attributes["Power 2"]);
    updateState("power3", attributes["Power 3"]); // Assuming there is a Power 3 attribute in the metadata
    updateState("power4", attributes["Power 4"]); // Assuming there is a Power 4 attribute in the metadata
    updateState("alignment1", attributes["Alignment 1"]);
    updateState("alignment2", attributes["Alignment 2"]);
    updateState("side", attributes.Side);
  };

  const handleEngaged = (engaged: boolean) => {
    if (engaged === true) {
      console.log("WARP DRIVE IS ENGAGED", { warping, engaged });
    }
  };

  const handleScanning = (scanning: boolean) => {
    updateState("scanning", scanning);
    console.log("SCANNING", { scanning });
  };

  function generatePrompt(
    type: "character" | "background",

    srcUrl: string | undefined = "",
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
    interplanetaryStatusReport: string,
  ): string {
    const niji = nijiFlag ? "--niji 5" : "";
    const v = vFlag ? "--v 5" : "";
    const keyword = type === "background" ? "The Planet Of" : "";
    const randomPlanet =
      "https://discovery.sndimg.com/content/dam/images/discovery/fullset/2022/9/alien%20planet%20GettyImages-913058614.jpg.rend.hgtvcom.406.406.suffix/1664497398007.jpeg";
    if (type === "background")
      return `${randomPlanet} ${keyword} ${power1} ${power2} ${power3} ${power4} ${alignment1} ${alignment2} ${selectedDescription} ${interplanetaryStatusReport} ${niji} ${v} viewed from space`.trim();

    return `${srcUrl} ${keyword} ${level} ${power1} ${power2} ${power3} ${power4} ${alignment1} ${alignment2} ${side} ${selectedDescription} ${interplanetaryStatusReport} ${niji} ${v}`.trim();
  }

  useEffect(() => {
    // Step 2: Call your new API route to generate the report
    if (travelStatus === "TargetAcquired") {
      const fetchInterplanetaryStatusReport = async () => {
        try {
          if (modifiedPrompt !== "ALLIANCE OF THE INFINITE UNIVERSE") {
            const response = await axios.post("/api/generate_report", {
              selectedDescription,
              extraText: modifiedPrompt,

              metadata,
            });
            console.log("normal prompt gpt");
            updateState("interplanetaryStatusReport", response.data.report);
          } else {
            const response = await axios.post("/api/generate_report", {
              selectedDescription,
              metadata,
              extraText: modifiedPrompt,
            });
            console.log("modified prompt gpt");
            updateState("interplanetaryStatusReport", response.data.report);
          }
        } catch (error) {
          console.error("Error fetching interplanetary status report:", error);
        }
      };
      console.log("travel status", travelStatus);

      fetchInterplanetaryStatusReport();
      console.timeEnd("fetchInterplanetaryStatusReport");
    }
  }, [travelStatus]);

  const handleDescribeClick = async () => {
    console.log(
      `Submitting image URL: ${scanning && backgroundImageUrl ? backgroundImageUrl : imageUrl ? imageUrl : srcUrl}`,
    );
    updateState("loading", true);

    if (waitingForWebhook) {
      console.log("Already waiting for webhook, please wait for response.");
      return;
    }

    updateState("waitingForWebhook", true);

    const url = scanning && backgroundImageUrl ? backgroundImageUrl : imageUrl ? imageUrl : srcUrl;
    console.log("url", url);
    try {
      const r = await axios.post("/api/postDescription", { url: url });

      console.log("response", r.data);
      updateState("response", JSON.stringify(r.data, null, 2));
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

      updateState("description", cleanedDescription);
      updateState("selectedDescription", cleanedDescription[0]);
    } catch (e: any) {
      console.log(e);
      updateState("error", e.message);
      updateState("warping", false);
      updateState("travelStatus", "NoTarget");
      updateState("scanning", false);

      updateState("loading", false);
    }
    updateState("waitingForWebhook", false);
  };

  type ProgressResponseType = {
    progress: number | "incomplete";
    response: {
      createdAt?: string;
      buttons?: string[];
      imageUrl?: string;
      buttonMessageId?: string;
      originatingMessageId?: string;
      content?: string;
      ref?: string;
      responseAt?: string;
    };
  };

  async function fetchProgress(
    messageId: string,
    expireMins = 2,
    retries = 3,
    delay = 1000,
  ): Promise<ProgressResponseType> {
    try {
      const response = await axios.get("/api/getProgress", {
        params: {
          messageId,
          expireMins,
        },
      });

      console.log("Response data:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error details:", error);
      console.error("Error response:", error.response);

      if (retries > 0) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));

        return fetchProgress(messageId, expireMins, retries - 1, delay);
      } else {
        throw error;
      }
    }
  }

  // handler for Generating images
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
    updateState("waitingForWebhook", true);
    if (type === "character") {
      updateState("warping", true);
      console.log("WARP DRIVE IS CHARACTER IN ENGAGED", { warping, prompt });
    }

    if (modifiedPrompt !== "ALLIANCE OF THE INFINITE UNIVERSE" && type === "character") {
      prompt = modifiedPrompt;
    }

    try {
      const r = await axios.post("/api/apiHandler", { text: prompt });

      console.log("response", r.data);
      updateState("response", JSON.stringify(r.data, null, 2));
      console.log("messageID", r.data.messageId);
      const ogMessage = r.data.messageId;
      // Poll the server to fetch the image URL from the cache
      let imageUrl, ImagineCommandResponse, messageId;
      const taskComplete = false;
      while (!taskComplete && !ImagineCommandResponse && ogMessage) {
        try {
          const progressData = await fetchProgress(ogMessage);
          console.log(
            "Progress:",
            progressData.progress,
            progressData.response.buttonMessageId,
            progressData.response.originatingMessageId,
          );
          console.log(progressData);

          // Check if the progress is 100 or the task is complete
          if (progressData.progress === 100) {
            ImagineCommandResponse = progressData;
            imageUrl = progressData.response.imageUrl;
            messageId = progressData.response.buttonMessageId;
            updateState("buttonMessageId", messageId);
            console.log(buttonMessageId);
          } else if (progressData.progress === "incomplete") {
            // Handle error case
            console.error("Error: Task is incomplete");
            break;
          } else {
            // Update loading state with progressData.progress
            console.log("Progress:", progressData.progress, progressData.response.buttonMessageId);

            updateState("loadingProgress", progressData.progress);

            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
          }
        } catch (error: any) {
          if (error.response.status !== 404) {
            throw error;
          }

          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
        }

        // Set the appropriate state based on the type
        if (type === "character") {
          updateState("imageUrl", imageUrl);
        } else {
          updateState("tempUrl", imageUrl);
        }
      }
    } catch (e: any) {
      console.log(e);
      updateState("error", e.message);
      updateState("warping", false);
      updateState("travelStatus", "NoTarget");
    }
    if (type === "character") {
      updateState("warping", false);
      updateState("travelStatus", "NoTarget");
    } else {
      updateState("travelStatus", "TargetAcquired");
    }

    updateState("waitingForWebhook", false);
  };

  // handler for upscaling images
  const handleButtonClick = async (button: string, type: "character" | "background") => {
    console.log("button", button, type);
    if (waitingForWebhook) {
      console.log("Already waiting for webhook, please wait for response.");
      return;
    }
    updateState("waitingForWebhook", true);
    if (type === "background") {
      console.log("buttonMessageId", buttonMessageId);
      updateState("warping", true);
    } else if (travelStatus === "AcquiringTarget") {
      console.log("buttonMessageId", buttonMessageId);
      updateState("travelStatus", "TargetAcquired");
      updateState("warping", true);
    }

    const bMessageId = buttonMessageId;

    try {
      console.log("button", button, bMessageId);
      const r = await axios.post("/api/postButtonCommand", { button, buttonMessageId: bMessageId });

      console.log("response", r);
      updateState("response", JSON.stringify(r, null, 2));

      const taskComplete = false;
      let buttonCommandResponse, buttonId, imageUrl;
      buttonId = r.data.messageId;

      // Poll the server to fetch the response from the cache

      while (!taskComplete && !buttonCommandResponse) {
        console.log(r.data, "OG MESSAGE", buttonId);
        try {
          const progressData = (await fetchProgress(buttonId)) as ProgressResponseType;

          console.log("Progress:", progressData.progress, progressData.response.buttonMessageId);
          console.log(progressData);

          // Check if the progress is 100 or the task is complete
          if (progressData.progress === 100) {
            buttonCommandResponse = progressData;
            imageUrl = progressData.response.imageUrl;
            buttonId = progressData.response.buttonMessageId;
          } else if (progressData.progress === "incomplete") {
            // Handle error case
            console.error("Error: Task is incomplete");
            break;
          } else {
            // Update loading state with progressData.progress
            console.log("Progress:", progressData.progress, progressData.response.buttonMessageId);
            updateState("buttonMessageId", buttonId);
            updateState("loading", progressData.progress);

            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
          }
        } catch (error: any) {
          if (error.response.status !== 404) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
        }
      }

      if (type === "character") {
        updateState("imageUrl", imageUrl);
        updateState("warping", false);
      } else {
        updateState("backgroundImageUrl", imageUrl);
      }
      updateState("warping", false);
      updateState("travelStatus", "NoTarget");

      console.log("Button Command Response:", buttonCommandResponse);
    } catch (e: any) {
      console.log(e);
      updateState("error", e.message);
      updateState("warping", false);
      updateState("travelStatus", "NoTarget");
    }
    updateState("waitingForWebhook", false);
    updateState("travelStatus", "NoTarget");
    setBackgroundImageUrl(imageUrl, type);
    setDisplayImageUrl(imageUrl, type);
    // handleDescribeClick();
  };
  // handler for describing images

  // make an array out of the metadata attributes

  const handleImageSrcReceived = (imageSrc: string) => {
    updateState("srcUrl", imageSrc);

    console.log(srcUrl);
    // Handle the imageSrc here, e.g., update the state or call another function
  };
  const handleModifedPrompt = (modifiedPrompt: string) => {
    updateState("modifiedPrompt", modifiedPrompt);
  };
  const handleSelectedTokenIdRecieved = (selectedTokenId: string) => {
    updateState("selectedTokenId", selectedTokenId);
  };
  const handleTokenIdsReceived = (tokenIds: string[]) => {
    // Handle the token IDs here, e.g., update the state or call another function
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap" rel="stylesheet" />
        <div className="container mx-auto h-screen flex flex-col items-center justify-center space-y-8">
          <Dashboard
            loadingProgress={loadingProgress}
            scanning={scanning}
            response={response}
            error={error}
            warping={warping}
            interplanetaryStatusReport={interplanetaryStatusReport}
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
            <SpaceshipInterface travelStatus={travelStatus} />
            <AcquiringTarget loading={loading} travelStatus={travelStatus} selectedTokenId={selectedTokenId} />

            <TokenSelectionPanel
              handleScanning={handleScanning}
              scanning={scanning}
              buttonMessageId={buttonMessageId}
              handleButtonClick={handleButtonClick}
              modifiedPrompt={modifiedPrompt}
              setTravelStatus={newStatus => updateState("travelStatus", newStatus)}
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
              handleClearAppState={handleClearAppState}
              handleActiveState={handleActiveSate}
              storeState={storeState}
              handleSubmit={submitPrompt}
              scanning={scanning}
              handleScanning={handleScanning}
              travelStatus={travelStatus}
              interplanetaryStatusReport={interplanetaryStatusReport}
              selectedTokenId={selectedTokenId}
              description={description}
              onDescriptionIndexChange={newDescription => updateState("setSelectedDescription", newDescription)}
              handleDescribeClick={handleDescribeClick}
            />
            <PromptPanel
              scanning={scanning}
              warping={warping}
              handleEngaged={handleEngaged}
              travelStatus={travelStatus}
              engaged={warping}
              setModifiedPrompt={handleModifedPrompt}
              imageUrl={imageUrl}
              interplanetaryStatusReport={interplanetaryStatusReport}
              description={selectedDescription ? selectedDescription : "No Description"}
              srcUrl={srcUrl || ""}
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
