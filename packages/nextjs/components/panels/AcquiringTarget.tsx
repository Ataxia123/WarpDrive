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
    <div className="acquiring-target-card">
      {!selectedTokenId && travelStatus == "NoTarget" && (
        <div>
          Select <br /> Token <br /> ID
        </div>
      )}

      {selectedTokenId && (
        <div className="acquiring-target-circle" style={{ backgroundColor: getColor() }}>
          <h1>{selectedTokenId}</h1> <br />
          <h2>{travelStatus}</h2>
        </div>
      )}
    </div>
  );
};

export default AcquiringTarget;
