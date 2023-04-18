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
}) => {
  const [focused, setFocused] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleClick = () => {
    setFocused(!focused);
  };

  const handleScanClick = () => {
    setScanning(true);
    handleDescribeClick();
  };

  useEffect(() => {
    if (description.length > 0) {
      setScanning(false);
    }
  }, [description]);

  return (
    <div
      className={`${
        focused ? "focused-right " : "unfocused-right scale-100"
      } transition-all duration-300 spaceship-panel`}
      onClick={handleClick}
    >
      <div className="w-full px-8">
        <h3 className="description-text text-xl font-bold mb-2">MESSAGE LOG</h3>
        {description.length === 0 && !scanning ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={e => {
              e.stopPropagation();
              handleScanClick();
            }}
          >
            SCAN
          </button>
        ) : scanning ? (
          <p className="description-text">Scanning...</p>
        ) : (
          <>
            <div>
              <h1 className="description-text font-bold">Interplanetary Status Report</h1>
              {interplanetaryStatusReport ? (
                <div>
                  {focused && (
                    <div>
                      <h2>Report Message:</h2>
                      <p>{interplanetaryStatusReport}</p>
                    </div>
                  )}
                  :
                </div>
              ) : (
                <p>Loading report...</p>
              )}
            </div>

            <select
              value={selectedDescriptionIndex}
              onChange={e => onDescriptionIndexChange(Number(e.target.value))}
              className="block w-full mt-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              {description.map((desc, index) => (
                <option key={index} value={index}>
                  {desc}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
};

export default DescriptionPanel;
