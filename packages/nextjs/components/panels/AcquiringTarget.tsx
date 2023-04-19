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
    <>
      <div className="tokenid-display spaceship-display-screen  border: 1rem solid #32CD32">
        {!selectedTokenId && travelStatus == "NoTarget" ? (
          <div>
            Select <br /> Token ID
          </div>
        ) : (
          <div>
            Selected Token ID
            <div style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}> {selectedTokenId}</div>
          </div>
        )}
      </div>

      {selectedTokenId && (
        <div>
          <div
            className="acquiring-target-card acquiring-target-circle spaceship-display-screen"
            style={{ backgroundColor: getColor() }}
          >
            <br />
            STATUS {travelStatus}
            <br />
          </div>
        </div>
      )}
    </>
  );
};

export default AcquiringTarget;
