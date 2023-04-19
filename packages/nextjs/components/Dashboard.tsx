// components/Dashboard/Dashboard.tsx
import React from "react";
import Background from "./Background";

interface DashboardProps {
  children: React.ReactNode;
  travelStatus: string;
  dynamicImageUrl: string;
}

const Dashboard: React.FC<DashboardProps> = ({ children, travelStatus, dynamicImageUrl }) => {
  return (
    <>
      <div className="dashboard" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        <img className="staticOverlay" src="assets/view.png" alt="Static Image Overlay" />
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
