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
    if (isMinimized === false) {
      console.log("minimized");
      setIsMinimized(true);
      return;
    }
    setIsMinimized(false);
    console.log("unminimized");
  };
  //det focus handling
  return (
    <>
      <ReadAIU
        isMinimized={isMinimized} // Pass isMinimized as a prop
        onMetadataReceived={onMetadataReceived}
        onImageSrcReceived={onImageSrcReceived}
        onTokenIdsReceived={onTokenIdsReceived}
        onSelectedTokenIdRecieved={onSelectedTokenIdRecieved}
        isFocused={isFocused} // Pass isMinimized as a prop
        onToggleMinimize={handleClick} // Pass handleClick as a prop
      />
    </>
  );
};

export default TokenSelectionPanel;
