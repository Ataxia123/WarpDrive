// index.tsx
import { useCallback, useEffect, useState } from "react";
import AudioController from "../components/AudioController";
import Dashboard from "../components/Dashboard";
import AcquiringTarget from "../components/panels/AcquiringTarget";
import DescriptionPanel from "../components/panels/DescriptionPanel";
import PromptPanel from "../components/panels/PromptPanel";
import SpaceshipInterface from "../components/panels/SpaceshipInterface";
import TokenSelectionPanel from "../components/panels/TokenSelectionPanel";
import { useAppStore } from "../services/store/store";
import axios from "axios";
import GraphemeSplitter from "grapheme-splitter";
import type { Metadata, ProgressResponseType, Sounds, StoreState } from "~~/types/appTypes";

export default function Home() {
  const [appState, setAppState] = useState({
    metadata: {} as Metadata,
    alienMessage: "",
    scannerOutput: {
      equipment: "",
      healthAndStatus: "",
      abilities: "",
      funFact: "",
    },
    loading: false,
    loadingProgress: 0,
    originatingMessageId: "",
    error: "",
    response: "",
    imageUrl: "",
    waitingForWebhook: false,
    description: [],
    selectedDescriptionIndex: 0,
    selectedTokenId: "",
    srcUrl: "",
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
  const {
    alienMessage,
    scannerOutput,
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
    nijiFlag,
    vFlag,
    travelStatus,
    interplanetaryStatusReport,
    selectedDescription,
    modifiedPrompt,
    warping,
    scanning,
  } = appState;
  //session storage
  const [storeState, setStoreState] = useState<StoreState>({
    interplanetaryStatusReports: [],
    scanningResults: [],
    imagesStored: [],
  });
  const setTravels = useAppStore(state => state.setTravels);
  const setBackgroundImageUrl = useAppStore(state => state.setBackgroundImageUrl);
  const setDisplayImageUrl = useAppStore(state => state.setdisplayImageUrl);
  const handleApiResponse = useAppStore(state => state.handleApiResponse);
  const setMetadata = useAppStore(state => state.setMetadata);
  const travels = useAppStore(state => state.travels);
  const [sounds, setSounds] = useState<Sounds>({});
  const [audioController, setAudioController] = useState<AudioController | null>(null);
  const [soundsLoaded, setSoundsLoaded] = useState<boolean>(false);

  const updateState = (key: string, value: any) => {
    setAppState(prevState => ({ ...prevState, [key]: value }));
  };
  // METADATA HANDLER
  const TNL_API_KEY = process.env.MIDJOURNEY_AUTH_TOKEN || "";

  const BASE_URL = "https://api.thenextleg.io/v2";
  const AUTH_TOKEN = TNL_API_KEY;
  const AUTH_HEADERS = {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    "Content-Type": "application/json",
  };

  const { abilities, funFact, equipment, healthAndStatus } = scannerOutput || {};

  const metadata: Metadata = {
    srcUrl: imageUrl,
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
    healthAndStatus: healthAndStatus,
    abilities: abilities,
    funFact: funFact,
    equipment: equipment,
    alienMessage: alienMessage,
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

    if (imageResponseData.progress) {
      console.log("---------------------");
      console.log(`Progress: ${imageResponseData.progress}%`);
      console.log(`Progress Image Url: ${imageResponseData.progressImageUrl}`);
      console.log("---------------------");
    }

    await sleep(5000);
    return fetchToCompletion(messageId, retryCount + 1);
  };

  // we wrap it in a main function here so we can use async/await inside of it.

  const imageHandler = async (text: string) => {
    /**   * GENERATE THE IMAGE
     */

    const imageRes = await fetch(`${BASE_URL}/imagine`, {
      method: "POST",
      headers: AUTH_HEADERS,

      body: JSON.stringify({ msg: text }),
    });

    const imageResponseData = await imageRes.json();
    console.log("\n=====================");
    console.log("IMAGE GENERATION MESSAGE DATA");
    console.log(imageResponseData);
    console.log("=====================");

    const completedImageData = await fetchToCompletion(imageResponseData.messageId, 0);
    updateState("buttonMessageId", completedImageData.messageId);
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
  };

  const loadSounds = useCallback(async () => {
    const spaceshipOn = await audioController?.loadSound("/audio/spaceship-on.wav");
    const spaceshipHum = await audioController?.loadSound("/audio/spaceship-hum.wav");
    const holographicDisplay = await audioController?.loadSound("/audio/holographic-display.wav");
    const warpSpeed = await audioController?.loadSound("/audio/warp-speed.wav");

    if (spaceshipOn) {
      audioController?.playSound(spaceshipOn, true, 0.02);
      // Pass 'true' as the second argument to enable looping
    }

    setSounds({
      spaceshipOn,
      spaceshipHum,
      holographicDisplay,
      warpSpeed,
    });

    setSoundsLoaded(true);
  }, [audioController, soundsLoaded]);
  // AUDIO SETUP
  useEffect(() => {
    setAudioController(new AudioController());
  }, []);

  useEffect(() => {
    if (audioController && !soundsLoaded) {
      loadSounds();
    }
  }, [audioController, soundsLoaded, loadSounds]);
  useEffect(() => {
    if (sounds.spaceshipOn) {
      audioController?.playSound(sounds.spaceshipOn, true, 0.02);
      audioController?.playSound(sounds.spaceshipOn, true, 0.02);
    }
  }, [sounds.spaceshipOn]);
  // SOUND EFFECTS
  function playSpaceshipHum() {
    if (sounds.spaceshipHum) {
      audioController?.playSound(sounds.spaceshipHum, false, 0.6);
    }
  }

  function playSpaceshipOn() {
    if (sounds.spaceshipOn) {
      audioController?.playSound(sounds.spaceshipOn, true, 0.02);
    }
  }

  function playHolographicDisplay() {
    if (sounds.holographicDisplay) {
      audioController?.playSound(sounds.holographicDisplay, false, 1);
    }
  }

  function playWarpSpeed() {
    if (sounds.warpSpeed) {
      audioController?.playSound(sounds.warpSpeed, false, 1.1);
    }
  }

  function createTravelResult(metadata: Metadata) {
    // Collect all the required information for the travel result
    setMetadata(metadata);
    handleApiResponse(error, response);
    setDisplayImageUrl(imageUrl, "character");
    setBackgroundImageUrl(backgroundImageUrl, "background");
    const travelResult = {
      metadata: metadata,
      backgroundImageUrl: backgroundImageUrl,
      imageUrl: imageUrl,
      apiResponses: error ? error : response,
      timestamp: new Date(),
    };

    return travelResult;
  }

  const handleActiveSate = (imageUrl: string, selectedDescription: string, interplanetaryStatusReport: string) => {
    setAppState(prevState => ({
      ...prevState,
      imageUrl: imageUrl,
      selectedDescription: selectedDescription,
      interplanetaryStatusReport: interplanetaryStatusReport,
    }));
  };

  const handleClearAppState = () => {
    setStoreState({
      interplanetaryStatusReports: [],
      scanningResults: [],
      imagesStored: [],
    });
  };

  function generateMetadata() {
    if (metadata.srcUrl === "" || travelStatus !== "NoTarget") {
      console.log("generateMetadata() imageUrl is empty");
      return;
    }
    fetchScanningReport();
    setMetadata(metadata);
    console.log("metadata Generated", metadata);
    console.log("SCANNING RESULT SENT TO BACKEND", { scannerOutput });
    updateState("scannerOutput", scannerOutput);
  }

  useEffect(() => {
    generateMetadata();
  }, [metadata.srcUrl]);
  // TRAVEL HANDLER

  const fetchInterplanetaryStatusReport = async () => {
    try {
      const response = await axios.post("/api/generate_report", {
        scannerOutput: scannerOutput,
        metadata: metadata,
        alienMessage: alienMessage,
      });
      console.log("interplanetaryStatusReport", response.data.report);
      updateState("interplanetaryStatusReport", response.data.report);
    } catch (error) {
      console.error("Error fetching interplanetary status report:", error);
    }
  };

  const fetchTargetPlanet = async () => {
    try {
      console.log(metadata);
      const response = await axios.post("/api/alienEncoder", {
        englishMessage: JSON.stringify(scannerOutput),
        metadata: metadata,
      });
      console.log("modified prompt gpt");
      updateState("alienMessage", response.data.alienMessage);

      console.log("alienMessage", response.data.alienMessage);
    } catch (error) {
      console.error("Error fetching target planet:", error);
    }
    console.log("fetchTargetPlanet", metadata);
  };

  useEffect(() => {
    updateState("prevTravelStatus", travelStatus);
    console.log("prevTravelStatus", prevTravelStatus);
    if (travelStatus === "NoTarget" && prevTravelStatus === "TargetAcquired") {
      // setTravels: (newTravel: any) => set(state => ({ travels: [...state.travels, newTravel] })),
      setTravels(createTravelResult(metadata));
      console.log("GENERATED TRAVEL OUTPUT:", travels[1]);
    }
  }, [travelStatus]);

  // handler for describing images
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

  // handle recieving data from chlidren

  const handleImageSrcReceived = (imageSrc: string) => {
    updateState("srcUrl", imageSrc);

    console.log(srcUrl);
    // Handle the imageSrc here, e.g., update the state or call another function
  };
  const handleModifedPrompt = (modifiedPrompt: string) => {
    updateState("modifiedPrompt", modifiedPrompt);

    console.log(" updateAllData(); foor modifiedPrompt");
  };
  const handleSelectedTokenIdRecieved = (selectedTokenId: string) => {
    updateState("selectedTokenId", selectedTokenId);
  };
  const handleTokenIdsReceived = (tokenIds: string[]) => {
    // Handle the token IDs here, e.g., update the state or call another function
  };

  const fetchScanningReport = async () => {
    try {
      console.log(metadata);
      const response = await axios.post("/api/scanning_result", {
        metadata: metadata,
      });
      console.log("modified prompt gpt", metadata);
      updateState("scannerOutput", response.data.scannerOutput);
      console.log("scannerOutput", response.data.scannerOutput);
    } catch (error) {
      console.error("Error fetching scanning report:", error);
    }
  };
  const handleScanning = (scanning: boolean) => {
    updateState("scanning", scanning);
    console.log("SCANNING", { scanning });
    console.log("alienMessage", alienMessage, "interplanetaryStatusReport", interplanetaryStatusReport);

    return console.log("Tried to Upscale new background but", { travelStatus, scanning });
  };

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

  function generatePrompt(
    type: "character" | "background",
    srcUrl: string | null,
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
    abilities: string | "",
    funFact: string | "",
    equipment: string | "",
    healthAndStatus: string | "",
    alienMessage: string | "",
  ): string {
    const niji = nijiFlag ? "--niji 5" : "";
    const v = vFlag ? "--v 5" : "";
    const keyword = type === "background" ? "The Planet Of" : "";
    const randomPlanet =
      "https://discovery.sndimg.com/content/dam/images/discovery/fullset/2022/9/alien%20planet%20GettyImages-913058614.jpg.rend.hgtvcom.406.406.suffix/1664497398007.jpeg";
    if (type === "background")
      return `${randomPlanet} ${keyword} ${alienMessage} ${power1} ${power2} ${power3} ${power4} ${alignment1} ${alignment2} ${interplanetaryStatusReport} ${niji} ${v} viewed from space`.trim();

    return `${srcUrl} ${healthAndStatus} ${level} ${power1} ${power2} ${power3} ${power4} ${healthAndStatus} ${equipment} ${abilities} ${funFact} ${alignment1} ${alignment2} ${side} ${selectedDescription} ${interplanetaryStatusReport} ${niji} ${v}`.trim();
  }

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
      const data = JSON.stringify({
        url: url,
        ref: "",
        webhookOverride: "",
      });

      const config = {
        method: "post",
        url: "https://api.thenextleg.io/v2/describe",
        headers: AUTH_HEADERS,
        data: data,
      };

      await axios(config)
        .then(async function (response) {
          console.log("\n=====================");
          console.log("IMAGE GENERATION MESSAGE DATA");
          console.log(response);
          console.log("=====================");

          const completedImageData = await fetchToCompletion(response.data.messageId, 0);
          updateState("description", JSON.stringify(completedImageData.data, null, 2));
          console.log(JSON.stringify(completedImageData));
        })
        .catch(function (error) {
          console.log(error);
        });

      // Start waiting for webhook
      console.log("Waiting for webhook to be received...");

      // Poll the server to fetch the description from the cache
      //

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
    fetchTargetPlanet();
    updateState("waitingForWebhook", false);
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
    fetchInterplanetaryStatusReport();
    let prompt = generatePrompt(
      type,
      srcUrl ? imageUrl : "",
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
      scannerOutput.abilities,
      scannerOutput.equipment,
      scannerOutput.funFact,
      scannerOutput.healthAndStatus,
      alienMessage,
    );

    if (waitingForWebhook) {
      console.log("Already waiting for webhook, please wait for response.");
      return;
    }
    updateState("waitingForWebhook", true);
    updateState("warping", true);
    console.log("WARP DRIVE IS CHARACTER IN ENGAGED", { warping, prompt });

    if (modifiedPrompt !== "ALLIANCE OF THE INFINITE UNIVERSE" && type === "character") {
      prompt = modifiedPrompt;
    }

    try {
      const r = await imageHandler(prompt);

      console.log("response", r);
      updateState("response", JSON.stringify(r));
      // Poll the server to fetch the image URL from the cache
      const taskComplete = false;

      // Set the appropriate state based on the type
      if (type === "character") {
        updateState("imageUrl", imageUrl);
      } else {
        updateState("tempUrl", imageUrl);
      }
    } catch (e: any) {
      console.log(e);
      updateState("error", e.message);
      updateState("warping", false);
      updateState("travelStatus", "NoTarget");
      updateState("scanning", false);
    }
    if (type === "character") {
      updateState("warping", false);
      updateState("travelStatus", "NoTarget");
      updateState("loadingProgress", "COMPLETE");
    } else if (travelStatus === "AcquiringTarget") {
      updateState("loadingProgress", "TRAVELING");
    }
    updateState("waitingForWebhook", false);
  };

  // handler for upscaling images
  const handleButtonClick = async (button: string, type: "character" | "background") => {
    console.log("handleButtonClickhandleButtonClickhandleButtonClick", button, type);
    if (waitingForWebhook) {
      console.log("Already waiting for webhook, please wait for response.");
      return;
    }
    updateState("waitingForWebhook", true);
    if (type === "background") {
      console.log("buttonMessageId", buttonMessageId);
      updateState("travelStatus", "TargetAcquired");
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
      } else if (type === "background") {
        updateState("backgroundImageUrl", imageUrl);
        updateState("imageUrl", imageUrl);
      }

      updateState("travelStatus", "NoTarget");

      console.log("Button Command Response:", buttonCommandResponse);
    } catch (e: any) {
      console.log(e);
      updateState("error", e.message);
      updateState("warping", false);
      updateState("travelStatus", "NoTarget");
      updateState("scanning", false);
      updateState("waitingForWebhook", false);
    }
    updateState("warping", false);
    updateState("scanning", false);
    updateState("waitingForWebhook", false);
    updateState("travelStatus", "NoTarget");
    setBackgroundImageUrl(imageUrl, type);
    setDisplayImageUrl(imageUrl, type);
    updateState("loadingProgress", 0);
    // handleDescribeClick();
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
            imageUrl={imageUrl || ""}
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
              parsedMetadata={metadata}
              warping={warping}
              scannerOutput={scannerOutput}
              playSpaceshipOn={playSpaceshipOn}
              playHolographicDisplay={playHolographicDisplay}
              playSpaceshipHum={playSpaceshipHum}
              playWarpSpeed={playWarpSpeed}
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
              metadata={metadata}
              alienMessage={alienMessage}
              playHolographicDisplay={playHolographicDisplay}
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
              playHolographicDisplay={playHolographicDisplay}
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
