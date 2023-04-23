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
        className="spaceship-display-screen"
        style={{
          display: "flex",
          alignContent: "center",
          flexDirection: "column",

          padding: "0.4rem",
          overflowX: "hidden",
        }}
      >
        {" "}
        <p
          className="description-text text-xl font-bold mb-2"
          style={{
            color: "white",
            marginBottom: "2.4rem",
            paddingBottom: "1.4rem",
          }}
        >
          {" "}
          AI-U INTERGALACTIC ASSISTANCE COMMUNICATIONS
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
                  style={{
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <br />
                  INCOMING TRANSMISSION:
                </h2>
                <h3>
                  <br /> {interplanetaryStatusReport}
                </h3>

                <button
                  className={"py-2 px-4 rounded font-bold text-white spaceship-button"}
                  style={{
                    border: "1px solid",
                    backgroundColor: "black",
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    handleButtonClick();
                  }}
                >
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {travelStatus === "TargetAcquired" ? (
                      <>NEXT TRANSMISSION</>
                    ) : interplanetaryStatusReport ? (
                      <div
                        style={{
                          pointerEvents: "none",
                        }}
                      >
                        CONFIGURING TARGETING COMPUTER
                      </div>
                    ) : (
                      <>SET COORDINATES</>
                    )}
                  </div>
                </button>

                <div
                  className="screen-border"
                  style={{
                    position: "absolute",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    padding: "2rem",
                    scale: "0.8",
                    height: "50%",
                    width: "100%",
                    left: "4%",
                    top: "130%",
                    marginBottom: "-6rem",
                    bottom: "20%",
                    paddingBottom: "1.8rem",
                  }}
                >
                  ---------------------------------
                  {" ||"} STATUS {" ||"}
                  {" ||"} {travelStatus}
                  {" ||"} <br /> COORDINATES DECODED : {selectedTokenId}
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
            {!scanning && description[0] ? (
              <div style={{ fontWeight: "bold" }}>
                {travelStatus !== "NoTarget" && (
                  <p
                    style={{
                      padding: "0rem",
                      margin: "-0.3rem",
                      bottom: "5rem",
                      marginBottom: "-0rem",
                    }}
                  >
                    SCANNER READY
                  </p>
                )}
              </div>
            ) : scanning ? (
              <>
                <div className="spaceship-display-screen">
                  <p className="description-text">Scanning...</p>
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
