// components/Dashboard/Dashboard.tsx
import React from "react";
import Background from "./Background";
import { MarqueePanel } from "./panels/MarqueePannel";

interface DashboardProps {
  children: React.ReactNode;
  travelStatus: string;
  dynamicImageUrl: string;
  imageUrl: string;
  srcUrl: string | undefined;
  onSubmitPrompt: (type: "character" | "background") => Promise<void>;
  onSubmit: (type: "character" | "background") => Promise<void>;
  handleButtonClick: (button: string, type: "character" | "background") => void;
  metadata: {
    Level: string;
    Power1: string;
    Power2: string;
    Power3: string;
    Power4: string;
    Alignment1: string;
    Alignment2: string;
    Side: string;
  };
  buttonMessageId: string;
  loading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  imageUrl,
  srcUrl,
  onSubmitPrompt,
  onSubmit,
  handleButtonClick,
  metadata,
  buttonMessageId,
  children,
  travelStatus,
  dynamicImageUrl,
  loading,
}) => {
  return (
    <>
      <div className="dashboard" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        <img className="staticOverlay" src="assets/view.png" alt="Static Image Overlay" />
        <MarqueePanel
          imageUrl={imageUrl}
          srcUrl={srcUrl}
          onSubmitPrompt={onSubmitPrompt}
          onSubmit={onSubmit}
          handleButtonClick={handleButtonClick}
          loading={loading}
          metadata={metadata}
          buttonMessageId={buttonMessageId}
        />
        <Background
          travelStatus={travelStatus}
          dynamicImageUrl={dynamicImageUrl}
          fixedImageUrl="assets/view.png"
        ></Background>
        {children}
      </div>
    </>
  );
};

export default Dashboard;
