import React, { useEffect, useState } from "react";
import LogViewer from "../LogViewer";

interface StoreState {
  interplanetaryStatusReports: string[];
  scanningResults: string[][];
  imagesStored: string[];
}

interface DescriptionPanelProps {
  handleClearAppState: () => void;
  handleActiveState: (imageUrl: string, selectedDescription: string, interplanetaryStatusReport: string) => void;

  storeState: StoreState;
  scanning: boolean;
  handleScanning: (scanning: boolean) => void;
  travelStatus: string;
  description: string[];

  onDescriptionIndexChange: (index: number) => void;
  selectedTokenId: string | undefined;
  handleDescribeClick: () => void;
  interplanetaryStatusReport: string;
  handleSubmit: (type: "character" | "background") => Promise<void>;
}

export const DescriptionPanel: React.FC<DescriptionPanelProps> = ({
  handleClearAppState,
  handleActiveState,
  handleSubmit,
  scanning,
  handleScanning,
  travelStatus,
  interplanetaryStatusReport,
  description,

  handleDescribeClick,
  onDescriptionIndexChange,
  selectedTokenId,
  storeState,
}) => {
  const [focused, setFocused] = useState(false);

  const [waitingForDescription, setWaitingForDescription] = useState<boolean>(false);
  const [toggle, setToggle] = useState<boolean>(false);

  const handleClick = () => {
    setFocused(!focused);
  };

  useEffect(() => {
    setWaitingForDescription(scanning);
  }, [scanning]);

  const handleScanClick = () => {
    handleScanning(true);
    setToggle(!toggle);
    handleDescribeClick();
  };

  const handleButtonClick = () => {
    handleScanning(true);
    handleSubmit("background");
    setToggle(!toggle);
  };

  useEffect(() => {
    if (travelStatus === "TargetAcquired" && description.length > 0) {
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
        height: "50%",
        width: "23%",
        left: "70%",
        top: "30%",
      }}
      onClick={handleClick}
    >
      <img
        style={{
          top: "10%",
          position: "absolute",
          height: "80%",
          width: "100%",
          objectFit: "fill",
          left: "4%",
          padding: "5.5rem",
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
        <p
          className=""
          style={{
            scale: "2.3",
          }}
        >
          {" "}
          AI-UNIVERSE
        </p>
        <p
          style={{
            color: "white",
            scale: "1",
            marginTop: "0%",
            marginBottom: "-5%",
          }}
        >
          {" "}
          INTERGALACTIC SCANNER
        </p>
        <br />
        <>
          {travelStatus === "NoTarget" && <>TARGETING SYSTEM NOT ENGAGED</>}

          {description && travelStatus !== "NoTarget" ? ( //wip
            <>
              <p
                className="description-text"
                style={{
                  top: "71%",
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
                  height: "45%",
                  padding: "15px",
                  paddingLeft: "3rem",
                  marginBottom: "-6rem",
                  top: "8%",
                  bottom: "20%",
                  width: "110%",
                  left: "0%",
                  justifyContent: "right",
                  scale: "1.1",
                }}
              >
                <div
                  className="hex-data"
                  style={{
                    opacity: "0.3",

                    pointerEvents: "none",
                  }}
                >
                  {description}
                </div>
                <div
                  onClick={e => {
                    e.stopPropagation();
                  }}
                >
                  <LogViewer
                    storeState={storeState}
                    handleActiveState={handleActiveState}
                    handleClearAppState={handleClearAppState}
                  />
                </div>
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
              height: "20%",
              width: "100%",
              top: "78%",
              left: "0%",

              flexDirection: "row",
              backdropFilter: "blur(3px)",

              position: "absolute",
            }}
          >
            {travelStatus !== "NoTarget" && (
              <div
                style={{
                  fontWeight: "bold",
                  position: "relative",
                  height: "100%",
                  width: "100%",
                }}
              >
                {" "}
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
                  {travelStatus === "AcquiringTarget" && selectedTokenId && !scanning && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <button
                        className={
                          "py-2 px-4 rounded font-bold  hover:bg-green-700 description-text spaceship-text screen-border"
                        }
                        style={{
                          border: "15px solid black",
                          width: "50%",
                          height: "100%",
                          margin: "0.2rem",
                          marginTop: "-1.6rem",
                          fontSize: "1.8rem",
                          fontWeight: "bold",
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
                  {toggle && (
                    <button
                      className={`spaceship-button screen-border`}
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
                      }}
                    >
                      <div
                        className="spaceship-button-container spaceship-button-text spaceship-display-screen"
                        style={{
                          margin: "0rem",
                          position: "absolute",
                          top: "12%",
                          left: "0%",
                          width: "100%",
                          height: "160%",
                          paddingBottom: "-30%",
                          marginBottom: "-30%",
                          scale: "1.2",
                        }}
                      >
                        {travelStatus === "TargetAcquired" ? (
                          <p
                            className={"spaceship-button-text"}
                            style={{ color: "white", scale: "0.8", position: "relative" }}
                          >
                            COORDINATES SET
                          </p>
                        ) : (
                          <div
                            className={"spaceship-button-text"}
                            style={{
                              pointerEvents: "none",
                              color: "white",
                              scale: "0.8",
                              marginTop: "8%",
                            }}
                          >
                            SET COORDINATES
                          </div>
                        )}
                      </div>
                    </button>
                  )}
                  <div
                    className="spaceship-display-screen"
                    style={{
                      position: "absolute",
                      display: "flex",
                      flexDirection: "column",
                      scale: "1.2",
                      left: "55%",
                      bottom: "23%",
                      width: "43%",
                      height: "100%",
                    }}
                  >
                    <p
                      style={{
                        color: "white",
                        marginBottom: "0rem",
                        top: "-20%",
                        bottom: "25%",
                      }}
                    >
                      {" "}
                      - STATUS -
                    </p>
                    SCANNING: {scanning ? "ON" : "OFF"}
                    <br />
                    <br />
                    {travelStatus === "TargetAcquired" ? (
                      <>|COORDINATES SET|</>
                    ) : description.length > 0 ? (
                      <>COMPUTING COORDINATES</>
                    ) : (
                      <>SETTING COODRINATES</>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className={"spaceship-display-screen"}>{travelStatus === "NoTarget" && <>NO TARGETS AVAILABLE</>}</div>
          </div>
        </>
      </div>
    </div>
  );
};

export default DescriptionPanel;
