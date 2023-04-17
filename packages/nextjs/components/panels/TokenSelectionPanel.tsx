import React, { useState } from "react";
import ReadAIU from "../ReadAIU";

interface TokenSelectionPanelProps {
  onMetadataReceived: (metadata: any) => void;
  onImageSrcReceived: (imageSrc: string) => void;
  onTokenIdsReceived: (tokenIds: string[]) => void;
  onSelectedTokenIdRecieved: (selectedTokenId: string) => void;
}

const TokenSelectionPanel: React.FC<TokenSelectionPanelProps> = ({
  onMetadataReceived,
  onImageSrcReceived,
  onTokenIdsReceived,
  onSelectedTokenIdRecieved,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = () => {
    setIsFocused(!isFocused);
  };
  return (
    <div className="token-selection-panel">
      <div className="dropdown-container">
        <ReadAIU
          onMetadataReceived={onMetadataReceived}
          onImageSrcReceived={onImageSrcReceived}
          onTokenIdsReceived={onTokenIdsReceived}
          onSelectedTokenIdRecieved={onSelectedTokenIdRecieved}
          isFocused={isFocused} // Pass isMinimized as a prop
          onToggleMinimize={handleClick} // Pass handleClick as a prop
        />
      </div>
      <button className="toggle-minimize-button" onClick={handleClick}>
        {!isFocused ? "Expand" : "Minimize"}
      </button>
    </div>
  );
};

export default TokenSelectionPanel;
