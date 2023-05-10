import React, { useEffect, useState } from "react";

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
interface SwitchboardProps {
  description: string;
  playHolographicDisplay: () => void;
  imageUrl: string;
  scanning: boolean;
  handleEngaged: (engaged: boolean) => void;
  travelStatus: string;
  engaged: boolean;
  warped: boolean;
  onModifiedPrompt: (modifiedPrompt: string) => void;
  attributes: string[];
  onToggle: (attribute: string, isEnabled: boolean) => void;
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

  promptData: Metadata;
  selectedAttributes: string[];
}

export const Switchboard: React.FC<SwitchboardProps> = ({
  description,
  playHolographicDisplay,
  imageUrl,
  scanning,
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
  const excludedAttributes = [""];
  const [modifiedPrompt, setModifiedPrompt] = useState("ALLIANCEOFTHEINFINITEUNIVERSE");
  const [checkedAttributes, setCheckedAttributes] = useState([...attributes]);

  // set string state to be either "character" or "background enforcing type
  const [type, setType] = useState<"character" | "background">("character");
  const [og, setOg] = useState<boolean>(false);
  const [nijiFlag, setNijiFlag] = useState<boolean>(false);
  const [vFlag, setVFlag] = useState<boolean>(false);
  const [displayPrompt, setDisplayPrompt] = useState("");

  const handleToggle = (attribute: string) => {
    if (checkedAttributes.includes(attribute)) {
      setCheckedAttributes(checkedAttributes.filter(attr => attr !== attribute));
    } else {
      setCheckedAttributes([...checkedAttributes, attribute]);
    }
  };

  useEffect(() => {
    generateModifiedPrompt();
    setDisplayPrompt(modifiedPrompt);
  }, [checkedAttributes]);

  const generateModifiedPrompt = () => {
    const {
      srcUrl,
      Level,
      Power1,
      Power2,
      Power3,
      Power4,
      Alignment1,
      Alignment2,
      selectedDescription,
      Side,
      interplanetaryStatusReport,
      abilities,
      funFact,

      equipment,
      healthAndStatus,
      alienMessage,
    } = promptData;

    const selectedData = {
      srcUrl,
      Level,
      Power1,
      Power2,
      Power3,
      Power4,
      Alignment1,
      Alignment2,
      selectedDescription,
      Side,
      interplanetaryStatusReport,
      abilities,
      funFact,
      equipment,

      healthAndStatus,
      alienMessage,
    };
    const filteredData: Partial<typeof selectedData> = {};

    checkedAttributes.forEach(attr => {
      const key = attr as keyof typeof selectedData;
      if (selectedData.hasOwnProperty(key)) {
        filteredData[key] = selectedData[key];
      }
    });

    const modifiedPrompt = generatePrompt(
      scanning ? "background" : "character",

      !og ? filteredData.srcUrl || "" : imageUrl || "",
      filteredData.Level || "",
      filteredData.Power1 || "",
      filteredData.Power2 || "",
      filteredData.Power3 || "",
      filteredData.Power4 || "",
      filteredData.Alignment1 || "",
      filteredData.Alignment2 || "",
      filteredData.selectedDescription || "",
      // Pass the additional text input here
      nijiFlag,
      vFlag,
      filteredData.Side || "",
      filteredData.interplanetaryStatusReport || "", // Pass the interplanetary status report here
      filteredData.abilities || "", // Pass the abilities here
      filteredData.funFact || "", // Pass the fun fact here
      filteredData.equipment || "", // Pass the equipment here
      filteredData.healthAndStatus || "", // Pass the health and status here
      filteredData.alienMessage || "", // Pass the alien message here
    );

    setModifiedPrompt(modifiedPrompt);
  };

  useEffect(() => {
    setDisplayPrompt(modifiedPrompt);
  }, [modifiedPrompt]);

  const renderCheckbox = (label: string, state: boolean, setState: React.Dispatch<React.SetStateAction<boolean>>) => (
    <label>
      {label}
      <input
        type="checkbox"
        checked={state}
        onChange={e => {
          e.stopPropagation();
          setState(e.target.checked);
        }}
      />
    </label>
  );

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
        <div
          onClick={e => {
            e.stopPropagation();
          }}
          className="spaceship-display-screen"
        >
          {travelStatus !== "NoTarget" ? (
            <>
              <p className="description-text" style={{ color: "white" }}>
                {" "}
                ||||||||||||AI-UNIVERSE SIGNAL ENCODER||||||||||||||
              </p>
              <div className="hex-prompt">
                <div
                  style={{
                    padding: "20px",
                    color: "white",
                  }}
                >
                  <input
                    style={{
                      top: "10%",
                      height: "10%",
                      left: "-0%",
                      position: "absolute",
                    }}
                    type="text"
                    className="prompt-input spaceship-display-screen overflow-hidden"
                    value={displayPrompt}
                    onChange={e => {
                      e.stopPropagation();
                      playHolographicDisplay();
                      setDisplayPrompt(e.target.value);
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
                </div>
                <br />
                <div
                  style={{
                    display: "flexbox",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                ></div>

                <br />
                <div
                  className="spaceship-display-screen switchboard-attribute-container"
                  style={{
                    position: "relative",
                  }}
                >
                  |||||||||||-------|DETECTED SIGNATURE DATA|----|||||||||||||
                  <div className="switchboard-real">
                    <button
                      className="description-text spaceship-display-screen"
                      style={{ border: "1px solid", margin: "10px", alignContent: "right" }}
                      onClick={e => {
                        {
                          generateModifiedPrompt();
                          playHolographicDisplay();
                          onModifiedPrompt(displayPrompt || "");
                        }
                        e.stopPropagation();
                      }}
                    >
                      Submit
                    </button>
                    <div
                      className="toggles-container"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        border: "1px solid",
                        margin: "10px",
                        alignContent: "right",

                        padding: "10px",
                        width: "38%",
                        backgroundColor: "black",
                        top: "0%",
                        position: "relative",
                      }}
                    >
                      {renderCheckbox("nijiFlag", nijiFlag, setNijiFlag)}
                      {renderCheckbox("vFlag", vFlag, setVFlag)}
                      {renderCheckbox("Original Image", og, setOg)}
                    </div>
                    {attributes.map(attribute => {
                      const displayName =
                        attribute === "selectedDescription"
                          ? "DESCRIPTION"
                          : attribute === "alienMessage"
                          ? "Alien Message"
                          : attribute === "funFact"
                          ? "FunFact"
                          : attribute === "healthAndStatus"
                          ? "Status"
                          : attribute === "abilities"
                          ? "Abilities"
                          : attribute === "equipment"
                          ? "Equipment"
                          : attribute === "interplanetaryStatusReport"
                          ? "Report"
                          : attribute === "selectedDescription"
                          ? "Scan"
                          : !excludedAttributes.includes(attribute) && promptData[attribute as keyof typeof promptData]
                          ? promptData[attribute as keyof typeof promptData]
                          : attribute;

                      const isChecked = !checkedAttributes.includes(attribute);

                      return (
                        <div
                          style={{ overflow: "hidden" }}
                          key={attribute}
                          className={`switchboard-attribute ${isChecked ? "checked" : ""} spaceship-panel`}
                          onClick={e => {
                            e.stopPropagation();
                            playHolographicDisplay();
                            generateModifiedPrompt();
                            handleToggle(attribute);
                          }}
                        >
                          <span className="">{displayName}</span>
                        </div>
                      );
                    })}
                  </div>
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
