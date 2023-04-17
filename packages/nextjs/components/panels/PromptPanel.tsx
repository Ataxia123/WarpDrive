import React, { useState } from "react";

interface PromptPanelProps {
  imageUrl: string;
  srcUrl: string | undefined;
  loading: boolean;
  onSubmitPrompt: (type: "character" | "background") => Promise<void>;
  onSubmit: (type: "character" | "background") => Promise<void>;
  handleButtonClick: (button: string, type: "character" | "background") => void;
}

export const PromptPanel: React.FC<PromptPanelProps> = ({ imageUrl, loading, srcUrl, onSubmit, handleButtonClick }) => {
  const [nijiFlag, setNijiFlag] = useState(false);
  const [vFlag, setVFlag] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const onNijiFlagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNijiFlag(event.target.checked);
  };

  const onVFlagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVFlag(event.target.checked);
  };

  const handleClick = () => {
    setIsFocused(!isFocused);
    setIsZoomed(!isZoomed); // Add this line
  };
  const AvailableButtons = () => {
    const buttons = ["U1", "U2", "U3", "U4", "🔄", "V1", "V2", "V3", "V4"];
    return (
      <div className="button-container">
        {buttons.map(button => (
          <button
            key={button}
            className={`spaceship-button ${isFocused ? "active" : ""}`}
            onClick={() => handleButtonClick(button, "character")}
          >
            {button}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`${isFocused ? "focused" : "unfocused"} ${
        !isZoomed ? "zoomed" : ""
      } prompt-panel bg-black rounded shadow-md p-4`}
      onClick={handleClick}
    >
      <h2 className="text-xl font-bold mb-2">Prompt</h2>
      {imageUrl && <img src={imageUrl} className="w-full rounded shadow-md mb-4" alt="nothing" />}
      <AvailableButtons />
      <div className="flex space-x-2">
        {/* ... other component JSX */}
        <label>
          <input type="checkbox" checked={nijiFlag} onChange={onNijiFlagChange} />
          --niji 5
        </label>
        <label>
          <input type="checkbox" checked={vFlag} onChange={onVFlagChange} />
          --v 5
        </label>
        {srcUrl ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => onSubmit("character")}
            disabled={loading || !srcUrl}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <div>
            <p>Get AIU</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptPanel;
