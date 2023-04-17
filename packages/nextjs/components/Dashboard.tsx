// components/Dashboard/Dashboard.tsx
import React from "react";

interface DashboardProps {
  children: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  return <div className="dashboard">{children}</div>;
};

export default Dashboard;
