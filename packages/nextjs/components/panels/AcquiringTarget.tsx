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
      <div className="tokenid-display spaceship-display-screen">
        <div className="screen-border">
          {!selectedTokenId && travelStatus == "NoTarget" ? (
            <div>
              Select <br /> Token ID
            </div>
          ) : (
            <div style={{ color: "white", fontSize: "0.8rem", fontWeight: "bold" }}>
              TOKEN ID
              <div>
                <p style={{ alignContent: "right", color: "white", fontSize: "1.1rem", fontWeight: "bold" }}>
                  {" "}
                  -| {selectedTokenId} |-
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedTokenId && (
        <div>
          {" "}
          <div className="screen-border acquiring-target-card spaceship-display-screen">
            <br />
            <p className="description-text acquiring-target-text">
              <br />
              STATUS
              <br />
              {travelStatus}
            </p>
            <div className="acquiring-target-circle" style={{ backgroundColor: getColor() }}>
              {" "}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AcquiringTarget;
