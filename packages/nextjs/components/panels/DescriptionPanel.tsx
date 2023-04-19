import React, { useEffect, useState } from "react";

interface DescriptionPanelProps {
  description: string[];
  selectedDescriptionIndex: number;
  onDescriptionIndexChange: (index: number) => void;
  selectedTokenId: string | undefined;
  handleDescribeClick: () => void;
  interplanetaryStatusReport: string;
}

export const DescriptionPanel: React.FC<DescriptionPanelProps> = ({
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
    console.log("descriptionIndex", descriptionIndex);
    console.log("selectedDescriptionIndex", selectedDescriptionIndex);
  };

  return (
    <>
      <div
        className={`${
          focused ? "focused-right " : "unfocused-right scale-100 "
        } transition-all duration-300 spaceship-panel`}
        onClick={handleClick}
      >
        <h3 className="description-text text-xl font-bold mb-2 spaceship-display-screen">
          INTERGALACTIC COMMUNICATIONS
        </h3>
        <div className={focused ? "spaceship-display-screen" : ""}>
          {description.length === 0 && !scanning && selectedTokenId ? (
            <div>
              <button
                className={"py-2 px-4 rounded font-bold text-white  hover:bg-blue-700"}
                onClick={e => {
                  e.stopPropagation();
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
            focused && (
              <>
                <div className="font-bold">
                  <h1 className="font-bold">INCOMING AI-U ASSISTANCE REQUESTS</h1>

                  {interplanetaryStatusReport ? (
                    <div>
                      {focused && (
                        <div>
                          <h2>MESSAGE:</h2>
                          <p>{interplanetaryStatusReport}</p>
                          <button
                            className={"py-2 px-4 rounded font-bold text-white  hover:bg-blue-700"}
                            onClick={handleButtonClick}
                          >
                            NEXT MESSAGE
                          </button>
                          {" ||"}
                        </div>
                      )}
                    </div>
                  ) : !selectedTokenId ? (
                    <>
                      <p>Select a transmission ID to scan</p>
                    </>
                  ) : (
                    <p>
                      <button
                        className={"py-2 px-4 rounded font-bold text-white  hover:bg-blue-700"}
                        onClick={handleButtonClick}
                      >
                        SET COORDINATES
                      </button>
                    </p>
                  )}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default DescriptionPanel;
