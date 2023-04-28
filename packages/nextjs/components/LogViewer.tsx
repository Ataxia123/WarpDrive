import React, { useState } from "react";
import DescriptionPanel from "./panels/DescriptionPanel";

// Dummy data for demonstration purposes
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
  const { interplanetaryStatusReports, scanningResults, imagesStored } = storeState;

  const [currentSection, setCurrentSection] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(1);

  const displayContent = () => {
    switch (currentSection) {
      case 1:
        return <div>{interplanetaryStatusReports[currentIndex]}</div>;
      case 2:
        return scanningResults[currentIndex].join(", ");
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

  const handleSendTweet = (selectedLog: string, selectedImage: string) => {
    const tweetText = `Check out my log: ${selectedLog} ${selectedImage}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    window.open(tweetUrl, "_blank");
  };

  return (
    <div className=" spaceship-screen-display ">
      <div className=" spaceship-screen-display" style={{ padding: "1rem" }}>
        <span>
          {currentIndex + 1}/{interplanetaryStatusReports.length}
          || <button onClick={() => setCurrentSection(1)}>Reports</button>||
          <button onClick={() => setCurrentSection(2)}>Scanning Results</button>||
          <button onClick={() => setCurrentSection(3)}>Images</button>||
        </span>
      </div>

      <div>{displayContent()}</div>

      <div
        style={{
          left: "33%",
          position: "absolute",
          bottom: "0",
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
              scanningResults[currentIndex].join(", "),
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
            handleSendTweet(interplanetaryStatusReports[currentIndex], imagesStored[currentIndex]);
          }}
        >
          ||-Send Tweet-||
        </button>
      </div>
    </div>
  );
};

export default LogViewer;
