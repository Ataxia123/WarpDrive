// components/Dashboard/Dashboard.tsx
import React from "react";
import styles from "./Dashboard.module.css";

interface DashboardProps {
  children: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-container">{children}</div>
    </div>
  );
};

export default Dashboard;
