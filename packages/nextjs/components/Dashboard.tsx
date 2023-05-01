// components/Dashboard/Dashboard.tsx
import React from "react";
import Background from "./Background";
import { MarqueePanel } from "./panels/MarqueePannel";
import { Header } from "~~/components/Header";

interface DashboardProps {
  loadingProgress: number;
  scanning: boolean;
  response: string;
  error: string;
  warping: boolean;
  interplanetaryStatusReport: string;
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
  loadingProgress,
  response,
  error,
  warping,
  interplanetaryStatusReport,
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
  scanning,
}) => {
  return (
    <>
      <div className="dashboard">
        <img className="staticOverlay" src="assets/view.png" alt="Static Image Overlay" />

        <MarqueePanel
          loadingProgress={loadingProgress}
          error={error}
          response={response}
          interplanetaryStatusReport={interplanetaryStatusReport}
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
          loadingProgress={loadingProgress}
          scanning={scanning}
          warping={warping}
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
