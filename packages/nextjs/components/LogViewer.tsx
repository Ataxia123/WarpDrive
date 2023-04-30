import React, { useState } from "react";
import { useAppStore } from "../services/store/store";
import { fabric } from "fabric";
import { useStore } from "zustand";

// Dummy data for demonstration purposes

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
interface StoreState {
  interplanetaryStatusReports: string[];
  scanningResults: string[][];
  imagesStored: string[];
}

interface LogViewerProps {
  storeState: StoreState;
  handleClearAppState: () => void;
  handleActiveState: (imageUrl: string, selectedDescription: string, interplanetaryStatusReport: string) => void;
}

const LogViewer: React.FC<LogViewerProps> = ({ storeState, handleActiveState }) => {
  const testImage = "/aiu.png";

  const reportFrame = "/reportFrame.png";

  const { interplanetaryStatusReports, scanningResults, imagesStored } = storeState;

  const [currentSection, setCurrentSection] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [collageUrl, setCollageUrl] = useState("");
  const {
    backgroundImageUrl,
    displayImageUrl,
    metadata,
    setMetadata,
    travels,
    setTravels,
    apiResponses,
    errors,
    handleApiResponse,
  } = useAppStore(state => ({
    backgroundImageUrl: state.backgroundImageUrl,
    displayImageUrl: state.displayImageUrl,
    metadata: state.metadata,
    setMetadata: state.setMetadata,
    travels: state.travels,
    setTravels: state.setTravels,
    apiResponses: state.apiResponses,
    errors: state.errors,
    handleApiResponse: state.handleApiResponse,
  }));

  const displayContent = () => {
    switch (currentSection) {
      case 1:
        return <div>{interplanetaryStatusReports[currentIndex]}</div>;
      case 2:
        return <div>{scanningResults.length > 1 && scanningResults.join(", ")}</div>;
      case 3:
        return (
          <img
            style={{
              marginLeft: "35%",
              display: "fit",
              width: "30%",
              height: "10%",
            }}
            src={imagesStored[currentIndex]}
            alt="Image"
          />
        );
      default:
        return null;
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    const currentArray =
      currentSection === 1 ? interplanetaryStatusReports : currentSection === 2 ? scanningResults : imagesStored;

    if (currentIndex < currentArray.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSetActiveState = (imageUrl: string, selectedDescription: string, interplanetaryStatusReport: string) => {
    handleActiveState(imageUrl, selectedDescription, interplanetaryStatusReport);
  };

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(storeState);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "logs.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleClearAppState = () => {
    handleClearAppState;
  };

  function stringifyMetadata(metadata: Metadata): string {
    const { Level, Power1, Power2, Power3, Power4, Alignment1, Alignment2, Side } = metadata;

    return `Level: ${Level}; Power1: ${Power1}; Power2: ${Power2}; Power3: ${Power3}; Power4: ${Power4}; Alignment1: ${Alignment1}; Alignment2: ${Alignment2}; Side: ${Side};`;
  }

  async function createWebcomic(testImage: string, frame: string, metadata: string, extraImage: string) {
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

      fabric.Image.fromURL(frame, img => {
        img.scaleToWidth(canvas.width ?? 800);

        canvas.add(img);

        fabric.Image.fromURL(testImage, img => {
          img.scaleToWidth((canvas.width ?? 800) / 2);
          img.scaleToHeight((canvas.height ?? 1000) / 2.3);
          img.set({ left: 200, top: 200 });
          img.opacity = 0.2;
          canvas.add(img);

          // Add metadata text as a square
          const maxLineLength = 20; // Adjust this value to change the max line length
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
            fontSize: 20,
            fill: "#f2982f",
            fontWeight: "bold",
            textAlign: "left",
            originX: "left",
            originY: "top",
          });

          // Add the metadata text to the canvas
          canvas.add(metadataText);
          const borderWidth = 3;
          const borderColor = "#f2982f";
          const textBorder = new fabric.Rect({
            top: metadataText.top ?? 0 - borderWidth,
            left: metadataText.left ?? 0 - borderWidth,
            width: metadataText.getScaledWidth() + 2 * borderWidth,
            height: metadataText.getScaledHeight() + 2 * borderWidth,
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

          // Add the extra image next to the text
          fabric.Image.fromURL(extraImage, img => {
            const imgWidth = (canvas.width ?? 800) / 2 - 55; // Adjust this value to control the extra image's width
            const scaleFactor = imgWidth / img.getScaledWidth(); // Calculate the scale factor

            img.set({
              left: 170 + maxLineLength * 8, // Adjust the '8' value to match the width of a character in the text
              top: 210,
            });

            img.scaleX = scaleFactor;
            img.scaleY = scaleFactor;

            // Add the extra image to the canvas
            canvas.add(img);
            canvas.add(imageBorder);

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

            const webcomicDataUrl = canvas.toDataURL({ format: "png" });
            resolve(webcomicDataUrl);
          });
        });
      });
    });
  }

  async function handleSendTweet() {
    const formattedMetadata = stringifyMetadata(metadata);
    const collageUrl = (await createWebcomic(testImage, reportFrame, formattedMetadata, testImage)) as string;
    setCollageUrl(collageUrl);
  }

  async function handleReallySendTweet(selectedLog: string, selectedImage: string) {
    // Host the collage image on your server or a third-party service and get its URL

    const tweetText = `🔭 Discovering the Cosmos with AI-U 🌌
    Check out my latest intergalactic log and image:
    ${selectedLog} ${selectedImage}
    🚀 Join the adventure: https://xn--0civ138ml7ayzbx3f.y.at
    #AIU_SIGNAL_BREAK #SpaceExploration ${collageUrl}`;

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    window.open(tweetUrl, "_blank");
  }

  return (
    <div className=" spaceship-screen-display ">
      <div className=" spaceship-screen-display" style={{ padding: "1rem" }}>
        <span>
          || <button onClick={() => setCurrentSection(1)}>Reports</button>||
          <button onClick={() => setCurrentSection(2)}>Scanning Results</button>||
          <button onClick={() => setCurrentSection(3)}>Images</button>||
        </span>
      </div>
      <div>{displayContent()}</div>
      {currentIndex + 1}/{interplanetaryStatusReports.length}
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
      <div className="spaceship-screen-display" style={{}}>
        ||-{" "}
        <button
          onClick={e => {
            handleSetActiveState(
              imagesStored[currentIndex],
              interplanetaryStatusReports[currentIndex],
              scanningResults[currentIndex] === undefined ? "" : scanningResults[currentIndex].join(", "),
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
            color: "rgb(29, 161, 242)",
          }}
          onClick={e => {
            handleSendTweet();
          }}
        >
          <img
            className="screen-border"
            style={{ left: "5 %", position: "relative", bottom: "10%", padding: "0rem", width: "100%", height: "100%" }}
            src={collageUrl}
          ></img>
          ||-Send Tweet-||
        </button>
      </div>
    </div>
  );
};

export default LogViewer;
