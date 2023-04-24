import React, { useEffect, useState } from "react";
import ReadAIU from "../ReadAIU";

interface TokenSelectionPanelProps {
  modifiedPrompt: string;
  setWarping: (warping: boolean) => void;
  setTravelStatus: (type: "NoTarget" | "AcquiringTarget" | "TargetAcquired") => void;
  handleEngaged: (engaged: boolean) => void;
  onMetadataReceived: (metadata: any) => void;
  onImageSrcReceived: (imageSrc: string) => void;
  onTokenIdsReceived: (tokenIds: string[]) => void;
  onSelectedTokenIdRecieved: (selectedTokenId: string) => void;
  onSubmit: (type: "character" | "background") => Promise<void>;
  interplanetaryStatusReport: string;
  engaged: boolean;
  travelStatus: string;
}

const TokenSelectionPanel: React.FC<TokenSelectionPanelProps> = ({
  modifiedPrompt,
  setWarping,
  setTravelStatus,
  handleEngaged,
  onMetadataReceived,
  onImageSrcReceived,
  onTokenIdsReceived,
  onSelectedTokenIdRecieved,
  interplanetaryStatusReport,
  onSubmit,
  travelStatus,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [engaged, setEngaged] = useState(false);

  const handleClick = () => {
    if (isMinimized === false) {
      console.log("minimized");
      setIsMinimized(true);
      return;
    }
    setIsMinimized(false);
    console.log("unminimized");
  };

  useEffect(() => {
    if (engaged === true) {
      handleEngaged(true);
    }
  }, [engaged]);

  return (
    <>
      <ReadAIU
        modifiedPrompt={modifiedPrompt}
        interplanetaryStatusReport={interplanetaryStatusReport}
        setWarping={setWarping}
        setTravelStatus={setTravelStatus}
        handleEngaged={handleEngaged}
        travelStatus={travelStatus}
        isMinimized={isMinimized} // Pass isMinimized as a prop
        onMetadataReceived={onMetadataReceived}
        onImageSrcReceived={onImageSrcReceived}
        onTokenIdsReceived={onTokenIdsReceived}
        onSelectedTokenIdRecieved={onSelectedTokenIdRecieved}
        isFocused={isFocused} // Pass isMinimized as a prop
        onToggleMinimize={handleClick} // Pass handleClick as a prop
        onSubmit={onSubmit}
      />
    </>
  );
};

export default TokenSelectionPanel;
