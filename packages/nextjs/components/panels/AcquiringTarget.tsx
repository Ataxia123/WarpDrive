import React from "react";

interface AcquiringTargetProps {
  travelStatus: string;
  selectedTokenId: string | undefined;
}

const AcquiringTarget: React.FC<AcquiringTargetProps> = ({ travelStatus, selectedTokenId }) => {
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
      {selectedTokenId && (
        <div className="acquiring-target-circle" style={{ backgroundColor: getColor() }}>
          <h1>{selectedTokenId}</h1> <h2>TARGET</h2>
        </div>
      )}
    </div>
  );
};

export default AcquiringTarget;
