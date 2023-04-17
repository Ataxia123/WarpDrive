import React, { useState } from "react";

interface DescriptionPanelProps {
  description: string[];
  selectedDescriptionIndex: number;
  onDescriptionIndexChange: (index: number) => void;
  selectedTokenId: string | undefined;
  handleDercribeClick: () => void;
}

export const DescriptionPanel: React.FC<DescriptionPanelProps> = ({
  selectedTokenId,
  description,
  selectedDescriptionIndex,
  onDescriptionIndexChange,
}) => {
  const [focused, setFocused] = useState(false);

  const handleClick = () => {
    setFocused(!focused);
  };

  return (
    <div
      className={`${focused ? "focused scale-110" : "unfocused-bottom scale-100"} transition-all duration-300`}
      onClick={handleClick}
    >
      <div className="w-full px-8">
        <h3 className="text-xl font-bold mb-2">Description:</h3>
        <p>{description[selectedDescriptionIndex]}</p>
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
      </div>
    </div>
  );
};

export default DescriptionPanel;
