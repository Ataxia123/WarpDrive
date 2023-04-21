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

  const onNijiFlagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNijiFlag(event.target.checked);
  };

  const onVFlagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVFlag(event.target.checked);
  };

  const handleClick = () => {
    setIsFocused(!isFocused);
    setIsZoomed(!isZoomed); // Add this line
  };

  const onGeneratePrompt = (prompt: string) => {
    console.log("Generated prompt:", prompt);
    console.log(attributes);
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

  return (
    <div className={`prompt-panel${!isFocused ? "-closed" : ""}`} onClick={handleClick}>
      <div className="spaceship-display-screen">
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
          <div className="prompt-display-div">
            <div className="screen-border">
              <Switchboard
                attributes={attributes}
                onToggle={handleToggle}
                generatePrompt={generatePrompt}
                promptData={metadata}
                selectedAttributes={selectedAttributes}
              />

              {imageUrl ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => onSubmit("character")}
                  disabled={loading || !srcUrl}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              ) : (
                <div></div>
              )}
              {buttonMessageId !== "" ? <AvailableButtons /> : <div></div>}
              <br />
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default PromptPanel;
