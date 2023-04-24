import React, { useState } from "react";
import Switchboard from "../Swittchboard";

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

interface PromptPanelProps {
  handleEngaged: (engaged: boolean) => void;
  travelStatus: string;
  warped: boolean;
  engaged: boolean;
  setModifiedPrompt: (modifiedPrompt: string) => void;
  description: string;
  interplanetaryStatusReport: string;
  buttonMessageId: string | "";
  imageUrl: string;
  srcUrl: string | undefined;
  loading: boolean;
  metadata: Metadata;
  onSubmitPrompt: (type: "character" | "background") => Promise<void>;
  onSubmit: (type: "character" | "background") => Promise<void>;
  handleButtonClick: (button: string, type: "character" | "background") => void;
  //Type '(type: "character" | "background", srcURL: string | undefined, level: string, power1: string, power2: string, power3: string, power4: string, alignment1: string, alignment2: string, selectedDescription: string, nijiFlag: boolean, vFlag: boolean, side: string) => string' is not assignable to type '() => void'.
  generatePrompt: (
    type: "character" | "background",
    srcUrl: string | undefined,
    level: string,
    power1: string,
    power2: string,
    power3: string,
    power4: string,
    alignment1: string,
    alignment2: string,
    selectedDescription: string,
    nijiFlag: boolean,
    vFlag: boolean,
    side: string,
    interplanetaryStatusReport: string, // Add this argument
  ) => string;
}

export const PromptPanel: React.FC<PromptPanelProps> = ({
  handleEngaged,
  travelStatus,
  warped,
  engaged,
  setModifiedPrompt,
  imageUrl,
  loading,
  srcUrl,
  onSubmit,
  handleButtonClick,
  metadata,
  buttonMessageId,
  description,
  interplanetaryStatusReport,
  generatePrompt,
}) => {
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleMouseEnter = () => {
    setIsFocused(false);
    setIsZoomed(false); // Add this line // Add this line
    !isMouseOver && setIsMouseOver(true);
  };

  const handleMouseLeave = () => {
    console.log("Mouse left");
  };
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
    "InterplanetaryStatusReport",
    "Description",
  ];
  const [nijiFlag, setNijiFlag] = useState(false);
  const [vFlag, setVFlag] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  function handleModifiedPrompt(modifiedPrompt: any) {
    //Do something with the modifiedPrompt, e.g., update the state or perform other actions
    setModifiedPrompt(modifiedPrompt);
    console.log(modifiedPrompt);
  }

  const handleClick = () => {
    setIsFocused(!isFocused);
  };

  const handleToggle = (attribute: string, isEnabled: boolean) => {
    if (!isEnabled) {
      setSelectedAttributes(prevState => [...prevState, attribute]);
    } else {
      setSelectedAttributes(prevState => prevState.filter(attr => attr !== attribute));
    }
  };
  function stringToHex(str: string): string {
    let hex = "";
    for (let i = 0; i < str.length; i++) {
      hex += str.charCodeAt(i).toString(16);
    }
    return hex;
  }

  return (
    <div className={`prompt-panel${isFocused ? "" : "-closed"}`} onClick={handleClick}>
      <div className={`spaceship-display-screen${travelStatus !== "NoTarget" ? "" : "-off"}`}>
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
              <div className="spaceship-display-screen">
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
            handleEngaged={handleEngaged}
            travelStatus={travelStatus}
            engaged={engaged}
            warped={warped}
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
