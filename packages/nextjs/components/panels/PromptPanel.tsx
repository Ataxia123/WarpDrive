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

    console.log("submitted", modifiedPrompt);
  }

  const handleClick = () => {
    if (engaged === true) {
      setIsFocused(true);
      setIsZoomed(true); // Add this line
    }
  };

  const AvailableButtons = () => {
    const buttons = ["U1", "U2", "U3", "U4", "🔄", "V1", "V2", "V3", "V4"];
    return (
      <div className="button-container">
        {buttons.map(button => (
          <button
            key={button}
            className={`spaceship-button ${isFocused ? "active" : ""}`}
            onClick={() => handleButtonClick(button, "character")}
          >
            {button}
          </button>
        ))}
      </div>
    );
  };

  const handleToggle = (attribute: string, isEnabled: boolean) => {
    if (isEnabled) {
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
    <div className={`prompt-panel${!engaged === true && !isFocused ? "-closed" : ""}`} onClick={handleClick}>
      <div className={`spaceship-display-screen${engaged ? "" : "-off"}`}>
        <div className="spaceship-display-screen animated-floating">
          <div className="display-border">
            <h1 className="description-text">
              ESTABLISHED <br></br>CONNECTION WITH:
              <br />
              <p className="font-bold text-2xl">
                {metadata.Level} {metadata.Power1} {metadata.Power2} {metadata.Power3}
                {metadata.Power4}{" "}
              </p>
            </h1>

            {imageUrl && !isFocused ? (
              <img src={imageUrl} className="w-full rounded shadow-md mb-4 position-relative" alt="nothing" />
            ) : (
              isFocused && (
                <div className="spaceship-display-screen">
                  <img src={srcUrl} className="image-display screen-border" alt="nothing" />
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <>
        {isFocused && (
          <>
            <Switchboard
              warped={warped}
              onModifiedPrompt={handleModifiedPrompt}
              attributes={attributes}
              onToggle={handleToggle}
              generatePrompt={generatePrompt}
              promptData={metadata}
              selectedAttributes={selectedAttributes}
            />
            {buttonMessageId !== "" ? <AvailableButtons /> : <div></div>}
            <br />
          </>
        )}
      </>
      <div className="prompt-utility-div-right" onMouseEnter={handleMouseEnter}></div>
    </div>
  );
};

export default PromptPanel;
