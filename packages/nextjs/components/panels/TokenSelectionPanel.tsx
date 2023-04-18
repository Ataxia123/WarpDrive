import React, { useEffect, useState } from "react";
import ReadAIU from "../ReadAIU";

interface TokenSelectionPanelProps {
  onMetadataReceived: (metadata: any) => void;
  onImageSrcReceived: (imageSrc: string) => void;
  onTokenIdsReceived: (tokenIds: string[]) => void;
  onSelectedTokenIdRecieved: (selectedTokenId: string) => void;
  interplanetaryStatusReport: string;
}

const TokenSelectionPanel: React.FC<TokenSelectionPanelProps> = ({
  onMetadataReceived,
  onImageSrcReceived,
  onTokenIdsReceived,
  onSelectedTokenIdRecieved,
  interplanetaryStatusReport,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  useEffect(() => {
    if (interplanetaryStatusReport !== "") {
      setIsFocused(true);
    }
  }, [interplanetaryStatusReport]);

  const handleClick = () => {
    if (!isMinimized) {
      setIsMinimized(true);
    }
    setIsMinimized(false);
  };
  return (
    <div className="token-selection-panel">
      <div className="dropdown-container">
        <ReadAIU
          isMinimized={isMinimized} // Pass isMinimized as a prop
          onMetadataReceived={onMetadataReceived}
          onImageSrcReceived={onImageSrcReceived}
          onTokenIdsReceived={onTokenIdsReceived}
          onSelectedTokenIdRecieved={onSelectedTokenIdRecieved}
          isFocused={isFocused} // Pass isMinimized as a prop
          onToggleMinimize={handleClick} // Pass handleClick as a prop
        />
      </div>
      <button className="toggle-minimize-button" onClick={handleClick}>
        {"Minimize"}
      </button>
    </div>
  );
};

export default TokenSelectionPanel;
