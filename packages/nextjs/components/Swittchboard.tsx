import React, { useState } from "react";

interface SwitchboardProps {
  attributes: string[];
  onToggle: (attribute: string, isEnabled: boolean) => void;
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

  promptData: {
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
  selectedAttributes: string[];
}

export const Switchboard: React.FC<SwitchboardProps> = ({
  attributes,
  onToggle,
  generatePrompt,
  promptData,
  selectedAttributes,
}) => {
  const [checkedAttributes, setCheckedAttributes] = useState<string[]>([]);
  const excludedAttributes = ["srcUrl", "nijiFlag", "vFlag", "selectedDescription", "interplanetaryStatusReport"];
  const [modifiedPrompt, setModifiedPrompt] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [extraText, setExtraText] = useState("");

  const handleToggle = (attribute: string) => {
    if (checkedAttributes.includes(attribute)) {
      setCheckedAttributes(checkedAttributes.filter(attr => attr !== attribute));
    } else {
      setCheckedAttributes([...checkedAttributes, attribute]);
    }
    onToggle(attribute, !checkedAttributes.includes(attribute));
  };
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const generateModifiedPrompt = () => {
    const { srcUrl, Level, Power1, Power2, Power3, Power4, Alignment1, Alignment2, Side, interplanetaryStatusReport } =
      promptData;

    const selectedData = {
      srcUrl,
      Level,
      Power1,
      Power2,
      Power3,
      Power4,
      Alignment1,
      Alignment2,
      Side,
      interplanetaryStatusReport,
    };

    const filteredData: Partial<typeof selectedData> = {};

    selectedAttributes.forEach(attr => {
      const key = attr as keyof typeof selectedData;
      if (selectedData.hasOwnProperty(key)) {
        filteredData[key] = selectedData[key];
      }
    });

    const modifiedPrompt = generatePrompt(
      "character",
      filteredData.srcUrl || "",
      filteredData.Level || "",
      filteredData.Power1 || "",
      filteredData.Power2 || "",
      filteredData.Power3 || "",
      filteredData.Power4 || "",
      filteredData.Alignment1 || "",
      filteredData.Alignment2 || "",

      extraText, // Pass the additional text input here
      false,
      false,
      filteredData.Side || "",
      filteredData.interplanetaryStatusReport || "", // Pass the interplanetary status report here
    );
    console.log(modifiedPrompt);
    setModifiedPrompt(modifiedPrompt);
  };
  const handleExtraTextChange = () => {
    setExtraText(extraText);
  };
  return (
    <>
      <div className="spaceship-display-screen switchboard overflow-hidden hex-prompt hex-data">
        {stringToHex(modifiedPrompt)}
        {isExpanded && (
          <div>
            {attributes.map(attribute => {
              const displayName =
                !excludedAttributes.includes(attribute) && promptData[attribute as keyof typeof promptData]
                  ? promptData[attribute as keyof typeof promptData]
                  : attribute;
              const isChecked = checkedAttributes.includes(attribute);
              return (
                <div
                  key={attribute}
                  className={`switchboard-attribute ${isChecked ? "checked" : ""}`}
                  onClick={() => handleToggle(attribute)}
                >
                  <span>{displayName}</span>
                </div>
              );
            })}
            <button onClick={generateModifiedPrompt}>Generate Modified Prompt</button>
            <br />
            <br />
            {modifiedPrompt}
          </div>
        )}

        {selectedAttributes.length > 0 && (
          <input
            type="text"
            className="prompt-input dropdown-option w-full px-3"
            placeholder="Additional text message"
            value={extraText}
            onChange={handleExtraTextChange}
          />
        )}
      </div>
    </>
  );
};

// Helper function to convert a string to a hex string
function stringToHex(str: string): string {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return hex;
}

export default Switchboard;
