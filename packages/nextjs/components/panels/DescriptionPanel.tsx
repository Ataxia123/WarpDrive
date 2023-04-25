import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface DescriptionPanelProps {
  handleScanning: (scanning: boolean) => void;
  travelStatus: string;
  description: string[];
  selectedDescriptionIndex: number;
  onDescriptionIndexChange: (index: number) => void;
  selectedTokenId: string | undefined;
  handleDescribeClick: () => void;
  interplanetaryStatusReport: string;
}

export const DescriptionPanel: React.FC<DescriptionPanelProps> = ({
  handleScanning,
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

  const handleClick = () => {
    setFocused(!focused);
  };

  const handleScanClick = () => {
    handleScanning(true);
    setScanning(true);
    handleDescribeClick();
  };

  const handleButtonClick = () => {
    setScanning(true);
    setDescriptionIndex(prevIndex => (prevIndex + 1) % description.length);
  };

  useEffect(() => {
    if (travelStatus === "TargetAcquired" && description.length > 0) {
      handleScanning(false);
      setScanning(false);
      setWaitingForDescription(false);
    }
  }, [travelStatus, interplanetaryStatusReport]);

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
          left: "4%",
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
                className={
                  "py-2 px-4 rounded font-bold text-white  hover:bg-green-700 description-text spaceship-text screen-border"
                }
                style={{
                  border: "1px solid white",
                  height: "17rem",
                  top: "10%",
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
                  top: "17%",
                  position: "absolute",
                }}
              >
                {" "}
                INCOMING TRANSMISSION:
                <br />
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
                  <p
                    className={"scroll-text"}
                    style={{
                      padding: "0.2rem",
                      marginRight: "1.2rem",
                      color: "white",
                    }}
                  >
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

          <div
            className="screen-border"
            style={{
              height: "30%",
              width: "100%",
              top: "65%",
              left: "0%",

              flexDirection: "row",
              backdropFilter: "blur(3px)",

              position: "absolute",
            }}
          >
            {!scanning && description[0] ? (
              <div
                style={{
                  fontWeight: "bold",
                  position: "relative",
                  height: "100%",
                  width: "100%",
                }}
              >
                {" "}
                {travelStatus !== "NoTarget" && (
                  <div
                    className="spaceship-screen-display"
                    style={{
                      position: "absolute",
                      display: "flex",
                      flexDirection: "row",
                      scale: "1",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <button
                      className={`spaceship-button ${waitingForDescription ? "active" : ""}`}
                      style={{
                        position: "relative",
                        height: "110%",
                        width: "50%",
                        marginBottom: "1.2rem",
                        padding: "0.2rem",
                        margin: "0.2rem",
                        marginTop: "1.4rem",
                        bottom: "53%",
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        handleButtonClick();
                        setWaitingForDescription(!waitingForDescription);
                      }}
                    >
                      <div
                        className="spaceship-button-container spaceship-button-text spaceship-display-screen"
                        style={{
                          margin: "0rem",
                          position: "absolute",
                          top: "0%",
                          left: "0%",
                          width: "100%",
                          height: "160%",
                          paddingBottom: "-30%",
                          marginBottom: "-30%",
                          scale: "1",
                        }}
                      >
                        {travelStatus === "TargetAcquired" ? (
                          <p className={"spaceship-button-text"} style={{ color: "white", scale: "0.8" }}>
                            NEXT TRANSMISSION
                          </p>
                        ) : interplanetaryStatusReport ? (
                          <div
                            className={"spaceship-button-text"}
                            style={{
                              pointerEvents: "none",
                              color: "white",
                              scale: "0.8",
                            }}
                          >
                            CONFIGURING TARGETING COMPUTER
                          </div>
                        ) : (
                          <p className={"spaceship-button-text"} style={{ scale: "0.8" }}>
                            <>SET COORDINATES</>
                          </p>
                        )}
                      </div>
                    </button>
                    <div
                      className="spaceship-display-screen"
                      style={{
                        position: "absolute",
                        display: "flex",
                        flexDirection: "column",
                        scale: ".6",
                        padding: "0.4rem",
                        paddingLeft: "-1.4rem",
                        margin: "0.5rem",
                        marginRight: "-2.6rem",
                        width: "83%",
                        height: "180%",
                        left: "31%",
                        top: "-80%",
                        bottom: "25%",
                        marginBottom: "0rem",
                      }}
                    >
                      <br /> STATUS
                      <br />
                      {travelStatus}
                      <br /> DECODED ID : {selectedTokenId}
                      <br />
                      {travelStatus === "TargetAcquired" ? (
                        <>|COORDINATES SET|</>
                      ) : interplanetaryStatusReport ? (
                        <>COMPUTING COORDINATES</>
                      ) : (
                        <>SETTING COODRINATES</>
                      )}
                    </div>
                  </div>
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
