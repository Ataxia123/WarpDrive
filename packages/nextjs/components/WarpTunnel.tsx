// WarpTunnel.tsx
import React, { useEffect, useRef } from "react";

interface WarpTunnelProps {
  loadingProgress: number;
  active: boolean;
}

const WarpTunnel: React.FC<WarpTunnelProps> = ({ loadingProgress, active }) => {
  const tunnelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tunnelRef.current || !active) return;

    const tunnel = tunnelRef.current;

    const updateAnimation = () => {
      const speedMultiplier = 1 + loadingProgress / 50;
      const animationDuration = 5 / speedMultiplier;

      tunnel.style.animationDuration = `${animationDuration}s`;
    };

    updateAnimation();
  }, [loadingProgress, active]);

  return <div ref={tunnelRef} className={`warpTunnel ${active ? "warpTunnelActive" : ""}`} />;
};

export default WarpTunnel;
