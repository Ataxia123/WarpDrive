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
    <div
      className={`${
        isFocused ? "focused" : "unfocused-right"
      } transition-all duration-300 transform w-full px-8 rounded-md bg-white`}
      onClick={handleClick}
    >
      <ReadAIU
        onMetadataReceived={onMetadataReceived}
        onImageSrcReceived={onImageSrcReceived}
        onTokenIdsReceived={onTokenIdsReceived}
        onSelectedTokenIdRecieved={onSelectedTokenIdRecieved}
      />
    </div>
  );
};

export default TokenSelectionPanel;
