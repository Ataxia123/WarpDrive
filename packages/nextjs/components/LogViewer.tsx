import React, { useState } from "react";
import { useAppStore, useImageStore } from "../services/store/store";
import ChatWithCaptain from "./chatWithCaptain";
import { fabric } from "fabric";

// Dummy data for demonstration purposes

type Metadata = {
  srcUrl: string;
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
  equipment: string;
  healthAndStatus: string;
  abilities: string;
  funFact: string;

  alienMessage: string;
};
interface StoreState {
  interplanetaryStatusReports: string[];
  scanningResults: string[][];
  imagesStored: string[];
}

interface LogViewerProps {
  metadata: Metadata;
  alienMessage: string;
  playHolographicDisplay: () => void;
  storeState: StoreState;
  handleClearAppState: () => void;
  handleActiveState: (imageUrl: string, selectedDescription: string, interplanetaryStatusReport: string) => void;
}
const LogViewer: React.FC<LogViewerProps> = ({
  metadata,
  storeState,
  handleActiveState,
  playHolographicDisplay,
  alienMessage,
}) => {
  const useAppStoreData = () => {
    const { travels } = useAppStore();

    const { imageUrl, setImageUrl } = useImageStore();

    const [currentTravelIndex, setCurrentTravelIndex] = useState(0);
    const [currentSection, setCurrentSection] = useState(2);
    const handlePrevious = () => {
      if (currentTravelIndex > 0) {
        setCurrentTravelIndex(currentTravelIndex - 1);
        playHolographicDisplay();
      }
    };

    const handleNext = () => {
      if (currentTravelIndex < travels.length - 1) {
        setCurrentTravelIndex(currentTravelIndex + 1);
        playHolographicDisplay();
      }
    };

    const setCurrentTravelSection = (section: number) => {
      playHolographicDisplay();
      setCurrentSection(section);
    };

    return {
      currentTravelIndex,
      imageUrl,
      currentSection,
      setCurrentTravelSection,
      handlePrevious,
      handleNext,
    };
  };

  const testImage = "/aiu.png";

  const reportFrame = "/reportFrame.png";

  const { interplanetaryStatusReports, scanningResults, imagesStored } = storeState;

  const [collageUrl, setCollageUrl] = useState("");
  const {
    backgroundImageUrl,
    displayImageUrl,
    setMetadata,
    travels,
    setTravels,
    apiResponses,
    errors,
    handleApiResponse,
  } = useAppStore(state => ({
    backgroundImageUrl: state.backgroundImageUrl,
    displayImageUrl: state.displayImageUrl,
    setMetadata: state.setMetadata,
    travels: state.travels,
    setTravels: state.setTravels,
    apiResponses: state.apiResponses,
    errors: state.errors,
    handleApiResponse: state.handleApiResponse,
  }));
  // Custom hook for managing app store data
  // Custom hook for managing app store data
  const { imageUrl, handlePrevious, handleNext, setCurrentTravelSection, currentSection, currentTravelIndex } =
    useAppStoreData();
  const imageSrc =
    currentTravelIndex === -1 && travels[currentTravelIndex].imageUrl
      ? travels[currentTravelIndex].imageUrl
      : testImage;
  const displayContent = () => {
    const travel = travels[currentTravelIndex];

    switch (currentSection) {
      case 1:
        return travels.length > 0 ? (
          <div>
            <h3>
              Metadata: for {travel.metadata.Level}
              {travel.metadata.Power1}
              {travel.metadata.Power2}
            </h3>
            <br />
            <ul>
              <li>Src URL: {travel.metadata.srcUrl}</li>
              <li>Level: {travel.metadata.Level}</li>
              <li>Power1: {travel.metadata.Power1}</li>
              <li>Power2: {travel.metadata.Power2}</li>
              <li>Power3: {travel.metadata.Power3}</li>
              <li>Power4: {travel.metadata.Power4}</li>
              <li>Alignment1: {travel.metadata.Alignment1}</li>
              <li>Alignment2: {travel.metadata.Alignment2}</li>
              <li>Side: {travel.metadata.Side}</li>
              <li>Interplanetary Status Report: {travel.metadata.interplanetaryStatusReport}</li>
              <li>Selected Description: {travel.metadata.selectedDescription}</li>
            </ul>
          </div>
        ) : null;

      case 2:
        return (
          <div>
            <h3>
              CONNECTED WITH :<br />
              {metadata.Level} {metadata.Power1} {metadata.Power2}:
            </h3>
            <ChatWithCaptain metadata={metadata} />
          </div>
        );
      case 3:
        const imageSrc =
          currentTravelIndex === -1 && imageUrl ? imageUrl : travels.length > 0 ? travel.imageUrl : testImage;
        return (
          <img
            style={{
              marginLeft: "35%",
              display: "fit",
              width: "30%",
              height: "10%",
            }}
            src={imageSrc}
            alt="Image"
          />
        );
      default:
        return null;
    }
  };

  const handleSetActiveState = (imageUrl: string, selectedDescription: string, interplanetaryStatusReport: string) => {
    handleActiveState(imageUrl, selectedDescription, interplanetaryStatusReport);
    playHolographicDisplay();
  };

  const handleExportLogs = () => {
    playHolographicDisplay();
    const dataStr = JSON.stringify({
      interplanetaryStatusReports,
      scanningResults,
      imagesStored,
      imageUrl,
    });
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "logs.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  function stringifyMetadata(): string {
    const { Level, Power1, Power2, Power3, Power4, Alignment1, Alignment2, Side } =
      travels[currentTravelIndex].metadata;
    const selectedDescription = travels[currentTravelIndex].metadata.interplanetaryStatusReport;
    return `"REPORT FROM\n ${Level} ${Power1} ${Power2} ${Power3 !== undefined ? Power3 : "||||||||| |||||||||"} ${
      Power4 !== undefined ? Power4 : "|||| ||||| |||| |||||"
    } ||||||||| STATUS REPORT|||||||||||:\n ${selectedDescription} METADATA Alignment1: ${Alignment1}; Alignment2: ${Alignment2}; Side: ${Side};`;
  }

  async function createWebcomic(testImageUrl: string, reportFrameUrl: string, metadata: string, extraImage: string) {
    return new Promise((resolve, reject) => {
      const canvas: fabric.Canvas = new fabric.Canvas(null, {
        width: 800,
        height: 1000,
      });

      // Create a black rectangle as background
      const background = new fabric.Rect({
        width: canvas.width,
        height: canvas.height,
        fill: "black",
        originX: "left",
        originY: "top",
      });

      // Add the background to the canvas
      canvas.add(background);
      fabric.Image.fromURL(testImageUrl, img => {
        img.scaleToWidth((canvas.width ?? 800) / 2);
        img.scaleToHeight((canvas.height ?? 1000) / 2.3);
        img.set({ left: 200, top: 200 });
        img.opacity = 0.2;
        canvas.add(img);

        // Add metadata text as a square
        const maxLineLength = 58; // Adjust this value to change the max line length
        const formattedMetadata = metadata
          .split(" ") // Split metadata by spaces
          .reduce(
            (accumulator, word) => {
              const lastLine = accumulator[accumulator.length - 1];
              const newLine = `${lastLine}${word} `;
              return newLine.length < maxLineLength
                ? [...accumulator.slice(0, -1), newLine]
                : [...accumulator, `${word} `];
            },
            [""],
          )
          .join("\n"); // Join lines with a line break

        const metadataText = new fabric.Text(formattedMetadata, {
          left: 145,
          top: 240,
          fontFamily: "Orbitron",
          fontSize: 16,
          fill: "#f2982f",
          fontWeight: "bold",
          textAlign: "left",
          originX: "left",
          originY: "top",
        });

        // Add the metadata text to the canvas
        canvas.add(metadataText);
        const borderWidth = 2;
        const borderColor = "#f2982f";
        const textBorder = new fabric.Rect({
          top: metadataText.top ?? 0 - borderWidth,
          left: metadataText.left ?? 0 - borderWidth,
          width: metadataText.getScaledWidth() + 2 * borderWidth,
          height: metadataText.getScaledHeight() - 80 * borderWidth,
          fill: "transparent",
          strokeWidth: borderWidth,
          stroke: borderColor,
        });

        // Add glow effect to the metadata text
        metadataText.set({
          shadow: new fabric.Shadow({
            color: borderColor,
            blur: 15,
            offsetX: 0,
            offsetY: 0,
          }),
        });

        // Add glow effect to the extra image
        img.set({
          shadow: new fabric.Shadow({
            color: borderColor,
            blur: 15,
            offsetX: 0,
            offsetY: 0,
          }),
        });

        // Add border and glow effect to the extra image
        const imageBorder = new fabric.Rect({
          top: img.top ?? 0 - borderWidth,
          left: img.left ?? 0 + borderWidth - 25 * borderWidth,
          width: img.getScaledWidth() + 30 * borderWidth,
          height: img.getScaledHeight() - 23 * borderWidth,
          fill: "transparent",
          strokeWidth: borderWidth,
          stroke: borderColor,
        });

        // Add the text border and image border to the canvas
        canvas.add(textBorder);

        // Create a glossy transparent screen
        const glossyScreen = new fabric.Rect({
          top: 195,
          left: 100,
          width: (canvas.width ?? 800) / 1.35,
          height: (canvas.height ?? 1000) / 2.7,
          fill: new fabric.Gradient({
            type: "linear",
            coords: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: canvas.height,
            },
            colorStops: [
              { offset: 0, color: "rgba(255, 255, 255, 0.2)" },
              { offset: 0.5, color: "rgba(255, 255, 255, 0)" },
              { offset: 1, color: "rgba(255, 255, 255, 0.2)" },
            ],
          }),
          originX: "left",
          originY: "top",
        });

        // Add the glossy transparent screen to the canvas
        canvas.add(glossyScreen);

        fabric.Image.fromURL(reportFrameUrl, img => {
          img.scaleToWidth(canvas.width ?? 800);

          canvas.add(img);

          const webcomicDataUrl = canvas.toDataURL({ format: "png" });
          resolve(webcomicDataUrl);
        });
      });
    });
  }

  async function handleSendTweet() {
    playHolographicDisplay();
    const formattedMetadata = stringifyMetadata();
    const collageUrl = (await createWebcomic(testImage, reportFrame, formattedMetadata, imageSrc)) as string;
    setCollageUrl(collageUrl);
  }

  async function handleReallySendTweet(selectedLog: string, selectedImage: string) {
    playHolographicDisplay();
    // Host the collage image on your server or a third-party service and get its URL

    const tweetText = `🔭 Discovering the Cosmos with AI-U 🌌
    #AIU_SIGNAL 
    ${selectedLog} ${selectedImage}
    🚀 Join the adventure: https://xn--0civ138ml7ayzbx3f.y.at
    # #SpaceExploration`;

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    window.open(tweetUrl, "_blank");
  }

  return (
    <div className=" spaceship-screen-display ">
      <div className=" spaceship-screen-display" style={{ padding: "1rem" }}>
        {alienMessage}
        <br /> <br />
        <span>
          || <button onClick={() => setCurrentTravelSection(2)}>CHAT</button>||
          <button onClick={() => setCurrentTravelSection(1)}>REPORTS</button>||
          <button onClick={() => setCurrentTravelSection(3)}>IMAGES</button>||
        </span>
      </div>
      <div>{displayContent()}</div>
      {currentTravelIndex + 1}/{travels.length}
      <br />
      <div
        style={{
          left: "0%",
          position: "relative",
          bottom: "10%",
          padding: "1rem",
        }}
        className="spaceship-screen-display"
      >
        ||- <button onClick={handlePrevious}>Previous</button>-||-
        <button onClick={handleNext}>Next</button>-||
      </div>
      {travels.length > 0 && (
        <div className="spaceship-screen-display" style={{}}>
          ||-{" "}
          <button
            onClick={e => {
              playHolographicDisplay();
              handleSetActiveState(
                travels[currentTravelIndex].imageUrl,
                travels[currentTravelIndex].metadata.interplanetaryStatusReport,
                scanningResults[currentTravelIndex] === undefined ? "" : scanningResults[currentTravelIndex].join(", "),
              );
            }}
          >
            Set Active
          </button>
          -||-
          <button onClick={handleExportLogs}>Export Logs</button>-||
          <br />
          <button
            style={{
              fontWeight: "bold",
              marginTop: "1rem",
              marginLeft: "-3%",
              color: "green",
            }}
            onClick={e => {
              handleSendTweet();
            }}
          >
            <img
              className="screen-border"
              style={{
                left: "5 %",
                position: "relative",
                bottom: "10%",
                padding: "0rem",
                width: "100%",
                height: "100%",
              }}
              src={collageUrl ? collageUrl : "/aiu.png"}
            ></img>
            ||-Generate InterPlanetary Report-||
          </button>
          <button
            style={{
              fontWeight: "bold",
              marginTop: "1rem",
              marginLeft: "-3%",
              color: "rgb(29, 161, 242)",
            }}
            onClick={e => {
              handleReallySendTweet(
                travels[currentTravelIndex].metadata.interplanetaryStatusReport,
                travels[currentTravelIndex].imageUrl,
              );
            }}
          >
            <img
              className="screen-border"
              style={{
                left: "5 %",
                position: "relative",
                bottom: "10%",
                padding: "0rem",
                width: "100%",
                height: "100%",
              }}
              src={imageSrc ?? "https://i.imgur.com/2ZlQW1b.png"}
            ></img>
            ||-Send Tweet-||
          </button>
        </div>
      )}
    </div>
  );
};

export default LogViewer;
