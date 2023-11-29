import React, { useState } from "react";
import Switchboard from "../Swittchboard";
import type { Metadata } from "~~/types/appTypes";

interface PromptPanelProps {
  playHolographicDisplay: () => void;
  scanning: boolean;
  handleEngaged: (engaged: boolean) => void;
  travelStatus: string;
  warping: boolean;
  engaged: boolean;
  setModifiedPrompt: (modifiedPrompt: string) => void;
  description: string;
  interplanetaryStatusReport: string;
  buttonMessageId: string | "";
  imageUrl: string;
  srcUrl: string;
  loading: boolean;
  metadata: Metadata;
  onSubmitPrompt: (type: "character" | "background") => Promise<void>;
  onSubmit: (type: "character" | "background") => Promise<void>;
  handleButtonClick: (button: string, type: "character" | "background") => void;
  //Type '(type: "character" | "background", srcURL: string | undefined, level: string, power1: string, power2: string, power3: string, power4: string, alignment1: string, alignment2: string, selectedDescription: string, nijiFlag: boolean, vFlag: boolean, side: string) => string' is not assignable to type '() => void'.
  generatePrompt: (
    type: "character" | "background",

    srcUrl: string,
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
  ) => string;
}

export const PromptPanel: React.FC<PromptPanelProps> = ({
  description,
  playHolographicDisplay,
  handleEngaged,
  travelStatus,
  warping,
  scanning,
  engaged,
  setModifiedPrompt,
  imageUrl,
  srcUrl,
  metadata,

  generatePrompt,
}) => {
  const attributes = [
    "srcUrl",

    "Level",
    "Power1",
    "Power2",
    "Power3",
    "Power4",
    "Alignment1",
    "Alignment2",
    "Side",
    "abilities",
    "funFact",
    "equipment",
    "healthAndStatus",
    "alienMessage",
    "interplanetaryStatusReport",
    "selectedDescription",
  ];
  const [isFocused, setIsFocused] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  function handleModifiedPrompt(modifiedPrompt: any) {
    //Do something with the modifiedPrompt, e.g., update the state or perform other actions
    setModifiedPrompt(modifiedPrompt);
    console.log(modifiedPrompt);
  }

  const handleClick = () => {
    setIsFocused(!isFocused);
    playHolographicDisplay();
  };

  const handleToggle = (attribute: string, isEnabled: boolean) => {
    if (!isEnabled) {
      setSelectedAttributes(prevState => [...prevState, attribute]);
    } else {
      setSelectedAttributes(prevState => prevState.filter(attr => attr !== attribute));
    }
  };

  return (
    <div className={`prompt-panel${isFocused ? "" : "-closed"}`} onClick={handleClick}>
      <div className={`spaceship-display-screen${isFocused ? "-off" : ""}`}>
        <div className="spaceship-display-screen animated-floating">
          <div className="display-border">
            <h1 className="description-text">
              ESTABLISHED CONNECTION WITH:
              <br />
              <p className="font-bold text-2xl">
                {metadata.Level} {metadata.Power1} {metadata.Power2} {metadata.Power3}
                {metadata.Power4}{" "}
              </p>
            </h1>

            {isFocused && (
              <div
                style={{
                  transform: "translate(1%)",
                  opacity: 1,
                }}
                className="spaceship-display-screen"
              >
                {imageUrl ? (
                  <img src={imageUrl} className="screen-border image-display " alt="nothing" />
                ) : (
                  <img src={srcUrl} className="image-display screen-border" alt="nothing" />
                )}
              </div>
            )}
          </div>
        </div>

        <br />
      </div>

      <>
        <>
          <Switchboard
            description={description}
            playHolographicDisplay={playHolographicDisplay}
            imageUrl={imageUrl}
            scanning={scanning}
            handleEngaged={handleEngaged}
            travelStatus={travelStatus}
            engaged={engaged}
            warped={warping}
            onModifiedPrompt={handleModifiedPrompt}
            attributes={attributes}
            onToggle={handleToggle}
            generatePrompt={generatePrompt}
            promptData={metadata}
            selectedAttributes={selectedAttributes}
          />
        </>
      </>
    </div>
  );
};

export default PromptPanel;

//helper hex function

function stringToHex(str: string): string {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return hex;
}
