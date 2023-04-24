import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface DescriptionPanelProps {
  travelStatus: string;
  description: string[];
  selectedDescriptionIndex: number;
  onDescriptionIndexChange: (index: number) => void;
  selectedTokenId: string | undefined;
  handleDescribeClick: () => void;
  interplanetaryStatusReport: string;
}

export const DescriptionPanel: React.FC<DescriptionPanelProps> = ({
  travelStatus,
  interplanetaryStatusReport,
  description,
  selectedDescriptionIndex,
  handleDescribeClick,
  onDescriptionIndexChange,
  selectedTokenId,
}) => {
  const [focused, setFocused] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [descriptionIndex, setDescriptionIndex] = useState<number>(0);
  const [waitingForDescription, setWaitingForDescription] = useState<boolean>(false);

  useEffect(() => {
    if (selectedDescriptionIndex !== descriptionIndex) {
      onDescriptionIndexChange(descriptionIndex);
    }
  }, [descriptionIndex]);

  const { address } = useAccount();

  const handleMouseEnter = () => {
    setFocused(false);
  };

  const handleClick = () => {
    setFocused(!focused);
  };

  const handleScanClick = () => {
    setScanning(true);
    handleDescribeClick();
  };

  const handleFocus = () => {
    if (!focused) setFocused(true);
  };

  useEffect(() => {
    if (description) {
      setScanning(false);
    }
  }, [selectedTokenId, description]);

  const handleButtonClick = () => {
    setDescriptionIndex(prevIndex => (prevIndex + 1) % description.length);
  };

  useEffect(() => {
    setWaitingForDescription(!waitingForDescription);
  }, [interplanetaryStatusReport]);

  return (
    <div
      className={`${
        focused ? "focused-right spaceship-display-screen" : "unfocused-right scale-100 spaceship-display-screen"
      }  spaceship-panel screen-border `}
      style={{
        transition: "all 0.5s ease-in-out",
        padding: "0.2rem",
      }}
      onClick={handleClick}
    >
      <img
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          objectFit: "fill",
          left: "10%",
          padding: "1.2rem",
        }}
        src="aiu.png"
      ></img>
      <div
        className="spaceship-display-screen description-text"
        style={{
          display: "flex",
          alignContent: "center",
          flexDirection: "column",

          padding: "0.4rem",
          overflowX: "hidden",
        }}
      >
        {" "}
        AI-UNIVERSE
        <p
          className=""
          style={{
            color: "white",
            marginBottom: "1.4rem",
            paddingBottom: "1.4rem",
          }}
        >
          {" "}
          INTERGALACTIC SCANNER
        </p>
        <br />
        <>
          {travelStatus === "NoTarget" && <>TARGETING SYSTEM NOT ENGAGED</>}

          {travelStatus === "AcquiringTarget" && selectedTokenId && description.length == 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <button
                className={"py-2 px-4 rounded font-bold text-white  hover:bg-blue-700 description-text"}
                style={{
                  border: "1px solid white",
                }}
                onClick={e => {
                  e.stopPropagation();

                  handleScanClick();
                }}
              >
                {}
                SCAN
              </button>
            </div>
          )}
          {description.length > 0 && travelStatus !== "NoTarget" ? (
            <>
              <p
                className="description-text"
                style={{
                  top: "20%",
                  position: "absolute",
                }}
              >
                {" "}
                INCOMING TRANSMISSION:
              </p>
              <div
                className="screen-border"
                style={{
                  overflow: "auto",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  height: "600%",
                  padding: "15px",
                  paddingLeft: "3rem",
                  marginBottom: "-6rem",
                  top: "-10%",
                  bottom: "20%",
                  width: "110%",
                  left: "0%",
                  justifyContent: "right",
                  scale: "1.1",
                }}
              >
                <h2
                  className="scroll-text"
                  style={{
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <br />
                </h2>
                <div
                  className="hex-data"
                  style={{
                    opacity: "0.3",

                    pointerEvents: "none",
                  }}
                >
                  {description}
                </div>
                <h3>
                  <br />{" "}
                  <p className={"scroll-text"} style={{ color: "white" }}>
                    {interplanetaryStatusReport}
                  </p>
                </h3>
              </div>
            </>
          ) : (
            !selectedTokenId && (
              <>
                <p>Select a transmission ID</p>
              </>
            )
          )}

          <br />
          <div>
            <br />

            <div
              className="screen-border"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "33%",
                top: "68%",
                left: "-2%",
                opacity: "1",
                bottom: "10%",
                marginBottom: "1rem",
                paddingBottom: "1.5rem",
                color: "white",

                paddingTop: "2.6rem",
                justifyContent: "space-around",
                backdropFilter: "blur(5px)",
                scale: "1",
                fontSize: "0.7rem",
              }}
            >
              <div>
                <br /> {" ||"} {travelStatus}
                {" ||"} <br /> DECODED ID : {selectedTokenId}
                <br />
                {travelStatus === "TargetAcquired" ? (
                  <>|COORDINATES SET|</>
                ) : interplanetaryStatusReport ? (
                  <>COMPUTING COORDINATES</>
                ) : (
                  <>SETTING COODRINATES</>
                )}
              </div>
              {!scanning && description[0] ? (
                <div style={{ fontWeight: "bold" }}>
                  {travelStatus !== "NoTarget" && (
                    <p
                      style={{
                        backdropFilter: "blur(3px)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        top: "40%",
                        bottom: "-10%",
                        height: "10%",
                        width: "100%",
                        marginTop: "5rem",
                        margin: "0rem",
                      }}
                    >
                      <button
                        className={`spaceship-button ${
                          travelStatus === "AcquiringTarget" && !waitingForDescription === false ? "active" : ""
                        }`}
                        style={{
                          border: "2px solid",
                          backgroundColor: "black",
                          bottom: "10%",
                          marginBottom: "0rem",
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          handleButtonClick();
                          setWaitingForDescription(true);
                        }}
                      >
                        <div
                          className="spaceship-button-text"
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {travelStatus === "TargetAcquired" ? (
                            <>NEXT TRANSMISSION</>
                          ) : interplanetaryStatusReport ? (
                            <div
                              style={{
                                pointerEvents: "none",
                                color: "white",
                              }}
                            >
                              CONFIGURING TARGETING COMPUTER
                            </div>
                          ) : (
                            <>SET COORDINATES</>
                          )}
                        </div>
                      </button>
                      SCANNER READY
                    </p>
                  )}
                </div>
              ) : scanning ? (
                <>
                  <div className="spaceship-display-screen">
                    <p className="description-text screen-border">Scanning...</p>
                  </div>
                </>
              ) : (
                travelStatus === "NoTarget" && <div className="description-text">SCANNER OFFLINE</div>
              )}
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default DescriptionPanel;

// {!selectedTokenId && (
//   <>
//     <br />
//     SELECT A SIGNAL ID {} <>{selectedTokenId}</>
//     <br />
//     <button
//       className={"py-2 px-4 rounded font-bold text-white  hover:bg-blue-700"}
//       onClick={e => {
//         e.stopPropagation();

//         handleScanClick();
//       }}
//     >
//       {}
//       SCAN
//     </button>{" "}
//   </>
// )}
