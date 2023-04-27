// Background.tsx
import React, { useEffect, useState } from "react";
import styles from "./Background.module.css";
import SpaceParticles from "./SpaceParticles";

interface BackgroundProps {
  scanning: boolean;
  warping: boolean;
  dynamicImageUrl: string;
  fixedImageUrl: string;
  travelStatus: string;
}

const Background: React.FC<BackgroundProps> = ({ warping, dynamicImageUrl, fixedImageUrl, travelStatus, scanning }) => {
  const [bgPosition, setBgPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [warpSpeedOpacity, setWarpSpeedOpacity] = useState("0");
  const [lightSpeed, setLightSpeed] = useState(false);
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
      <div className={`warpSpeedEffect ${lightSpeed ? "warpSpeedActive" : ""}`}>
        <div className="warpImage warpImage1" />
        <div className="warpImage warpImage2" />
      </div>
    </div>
  );
};

export default Background;
