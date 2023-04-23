import React, { useEffect, useState } from "react";

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
    if (description.length > 0) {
      setScanning(false);
    }
  }, [description]);

  const handleButtonClick = () => {
    setDescriptionIndex(prevIndex => (prevIndex + 1) % description.length);
  };

  return (
    <div
      className={`${
        focused
          ? "focused-right spaceship-display-screen screen-border transition-all duration-300 "
          : "unfocused-right scale-100 spaceship-display-screen"
      } transition-all duration-300 spaceship-panel overflow-auto screen-border `}
      style={{
        overflow: "auto",
      }}
      onClick={handleClick}
    >
      <h3 className="description-text text-xl font-bold mb-2">INTERGALACTIC COMMUNICATIONS</h3>
      <div className={focused ? "spaceship-display-screen" : ""}>
        {description.length === 0 && !scanning && selectedTokenId ? (
          <div>
            <button
              className={"py-2 px-4 rounded font-bold text-white  hover:bg-blue-700"}
              onClick={e => {
                e.stopPropagation();
                handleButtonClick();
                handleScanClick();
              }}
            >
              {}
              SCAN
            </button>
            {" ||"}
          </div>
        ) : scanning ? (
          <>
            <p className="description-text">Scanning...</p>
            <div className="spaceship-display-screen"></div>
          </>
        ) : (
          <div className="spaceship-screen-display overflow-auto">
            {travelStatus !== "NoTarget" && (
              <div className="spaceship-screen-display overflow-auto">
                <h1 className="py-2 px-4 font-bold">INCOMING AI-U ASSISTANCE REQUESTS</h1>

                {interplanetaryStatusReport ? (
                  <div>
                    <div>
                      <h2>MESSAGE:</h2>
                      <p className="spaceship-display-screen overflow-auto">{interplanetaryStatusReport}</p>
                      <button
                        className={"py-2 px-4 rounded font-bold text-white  hover:bg-blue-700"}
                        onClick={e => {
                          e.stopPropagation();
                          handleButtonClick();
                        }}
                      >
                        NEXT MESSAGE
                      </button>
                      {" ||"}
                    </div>
                  </div>
                ) : !selectedTokenId ? (
                  <>
                    <p>Select a transmission ID to scan</p>
                  </>
                ) : (
                  <p>
                    <button
                      className={"py-2 px-4 rounded font-bold text-white  hover:bg-blue-700"}
                      onClick={e => {
                        e.stopPropagation();
                        handleButtonClick();
                      }}
                    >
                      SET COORDINATES
                    </button>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionPanel;
