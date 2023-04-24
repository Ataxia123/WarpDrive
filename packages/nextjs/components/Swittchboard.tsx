import React, { useEffect, useState } from "react";

interface SwitchboardProps {
  handleEngaged: (engaged: boolean) => void;
  travelStatus: string;
  engaged: boolean;
  warped: boolean;
  onModifiedPrompt: (modifiedPrompt: string) => void;
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
  handleEngaged,
  travelStatus,
  engaged,
  attributes,
  onToggle,
  generatePrompt,
  promptData,
  selectedAttributes,
  onModifiedPrompt,
  warped,
}) => {
  const excludedAttributes = ["srcUrl", "nijiFlag", "vFlag", "selectedDescription", "interplanetaryStatusReport"];
  const [modifiedPrompt, setModifiedPrompt] = useState("ALLIANCEOFTHEINFINITEUNIVERSE");
  const [isExpanded, setIsExpanded] = useState(false);
  const [extraText, setExtraText] = useState("");
  const [showExtraTextInput, setShowExtraTextInput] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [checkedAttributes, setCheckedAttributes] = useState([...attributes]);

  const handleToggle = (attribute: string) => {
    let attributeToggledOn;
    if (checkedAttributes.includes(attribute)) {
      setCheckedAttributes(checkedAttributes.filter(attr => attr !== attribute));
      attributeToggledOn = false;
    } else {
      setCheckedAttributes([...checkedAttributes, attribute]);
      attributeToggledOn = true;
    }
    onToggle(attribute, attributeToggledOn);
  };

  useEffect(() => {
    engaged === true ? setIsEnabled(true) : setIsEnabled(false);
  }, [engaged]);

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

    setModifiedPrompt(modifiedPrompt);
    onModifiedPrompt(modifiedPrompt);
  };
  const handleExtraTextChange = (e: any) => {
    e.preventDefault();
    setExtraText(e.target.value);
  };

  return (
    <>
      <div
        className="spaceship-display-screen overflow-auto prompt-display-div"
        style={{
          overflowX: "hidden",
          opacity: 1.5,
        }}
      >
        -ENCODE SIGNAL-
        <div className="spaceship-display-screen">
          {travelStatus !== "NoTarget" ? (
            <>
              <p className="description-text" style={{ color: "white" }}>
                {" "}
                ||||||||||||AI-UNIVERSE SIGNAL ENCODER||||||||||||||
              </p>
              <div className="hex-prompt">
                <input
                  type="text"
                  className="prompt-input spaceship-display-screen"
                  value={extraText}
                  onChange={handleExtraTextChange}
                  onClick={e => {
                    e.stopPropagation();
                  }}
                />
                <div className="hex-data">
                  {stringToHex(modifiedPrompt)}
                  {stringToHex(modifiedPrompt)}
                  {stringToHex(modifiedPrompt)}
                  {stringToHex(modifiedPrompt)}
                  {stringToHex(modifiedPrompt)}
                  {stringToHex(modifiedPrompt)}
                  {stringToHex(modifiedPrompt)}
                  {stringToHex(modifiedPrompt)}
                </div>
                {modifiedPrompt}
                <br />
                <button
                  className="description-text spaceship-display-screen"
                  style={{ border: "1px solid", margin: "10px", alignContent: "right" }}
                  onClick={e => {
                    {
                      generateModifiedPrompt();
                    }
                    e.stopPropagation();
                  }}
                >
                  Submit
                </button>
              </div>
              <br />
              <div className="spaceship-display-screen switchboard-attribute-container">
                |||||||||||-------|DETECTED SIGNATURE DATA|----|||||||||||||
                <div className="switchboard-real">
                  {attributes.map(attribute => {
                    const displayName =
                      !excludedAttributes.includes(attribute) && promptData[attribute as keyof typeof promptData]
                        ? promptData[attribute as keyof typeof promptData]
                        : attribute;
                    const isChecked = checkedAttributes.includes(attribute);

                    return (
                      <div
                        key={attribute}
                        className={`switchboard-attribute ${isChecked ? "checked" : ""} spaceship-panel`}
                        onClick={e => {
                          e.stopPropagation();
                          handleToggle(attribute);
                        }}
                      >
                        <span className="">{displayName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div>ENCODER OUT OF RANGE</div>
          )}
        </div>
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
