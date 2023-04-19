import React from "react";

interface AcquiringTargetProps {
  travelStatus: string;
  selectedTokenId: string | undefined;
  loading: boolean;
}

const AcquiringTarget: React.FC<AcquiringTargetProps> = ({ travelStatus, selectedTokenId, loading }) => {
  const getColor = () => {
    switch (travelStatus) {
      case "NoTarget":
        return "red";
      case "AcquiringTarget":
        return "yellow";
      case "TargetAcquired":
        return "green";
      default:
        return "red";
    }
  };

  return (
    <div className="acquiring-target-card spaceship-display-screen">
      {!selectedTokenId && travelStatus == "NoTarget" && (
        <div>
          Select <br /> Token <br /> ID
        </div>
      )}
      <h1>Token ID: {selectedTokenId}</h1>
      <h2>STATUS: {travelStatus}</h2>
      {selectedTokenId && <div className="acquiring-target-circle" style={{ backgroundColor: getColor() }}></div>}
    </div>
  );
};

export default AcquiringTarget;
