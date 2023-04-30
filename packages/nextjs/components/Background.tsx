// Background.tsx
import React, { useEffect, useState } from "react";
import styles from "./Background.module.css";
import SpaceParticles from "./SpaceParticles";
import WarpSpeedCanvas from "./WarpSpeedCanvas";
import WarpTunnel from "./WarpTunnel";

interface BackgroundProps {
  loadingProgress: number;
  scanning: boolean;
  warping: boolean;
  dynamicImageUrl: string;
  fixedImageUrl: string;
  travelStatus: string;
}

const Background: React.FC<BackgroundProps> = ({
  warping,
  dynamicImageUrl,
  fixedImageUrl,
  travelStatus,
  scanning,
  loadingProgress,
}) => {
  const [bgPosition, setBgPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [warpSpeedOpacity, setWarpSpeedOpacity] = useState("0");
  const [lightSpeed, setLightSpeed] = useState(false);
  const warpImage1 = React.useRef<HTMLDivElement>(null);
  const warpImage2 = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    setBgPosition({ x: clientX / 50, y: clientY / 50 });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    setLightSpeed(warping);
  }, [warping]);

  useEffect(() => {
    if (warpImage1.current && warpImage2.current) {
      const duration = 12 - 4 * (loadingProgress / 10);
      warpImage1.current.style.animation = `zoomIn ${duration}s infinite linear`;
      warpImage2.current.style.animation = `zoomIn ${duration}s infinite linear 0.5s`;
    }
  }, [loadingProgress]);

  return (
    <div className={styles.background}>
      <img
        className={styles.dynamicImage}
        src={dynamicImageUrl}
        alt="Dynamic Image"
        style={{
          transform: `translate(${bgPosition.x}px, ${bgPosition.y}px)`,
        }}
      />
      <SpaceParticles />
      <WarpTunnel loadingProgress={loadingProgress} active={warping} />
      <WarpSpeedCanvas loadingProgress={loadingProgress} active={warping} />
    </div>
  );
};

export default Background;
