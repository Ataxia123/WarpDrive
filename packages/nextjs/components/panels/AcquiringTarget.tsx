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
          TRAVEL STATUw
          <div
            className="screen-border acquiring-target-card spaceship-display-screen"
            style={{
              fontWeight: "bold",
              paddingTop: "3rem",
              marginBottom: "1rem",
              fontSize: "1.2rem",
              alignContent: "center",
              justifyContent: "center",
              paddingBottom: "3rem",
              height: "100%",
            }}
          >
            <br />
            {travelStatus == "TargetAcquired" && (
              <>
                Target<br></br>Acquired
              </>
            )}
            {travelStatus == "AcquiringTarget" && (
              <>
                Acquiring<br></br>Target
              </>
            )}
            {travelStatus == "NoTarget" && (
              <>
                No<br></br>Target
              </>
            )}
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
