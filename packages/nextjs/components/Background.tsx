// Background.tsx
import React, { useEffect, useState } from "react";
import styles from "./Background.module.css";

interface BackgroundProps {
  warped: boolean;
  dynamicImageUrl: string;
  fixedImageUrl: string;
  travelStatus: string;
}

const Background: React.FC<BackgroundProps> = ({ dynamicImageUrl, warped, fixedImageUrl, travelStatus }) => {
  const [bgPosition, setBgPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [warpSpeedOpacity, setWarpSpeedOpacity] = useState("0");
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
    if (warped === true) {
      setWarpSpeedOpacity("1");

      // Wait for 5 seconds (5000 milliseconds) before executing the following code
      setTimeout(() => {
        // Change the opacity back to 0 after changing the background
        setWarpSpeedOpacity("0");
      }, 5000);
    }
  }, [travelStatus]);
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
      <div className={`warpSpeedEffect ${travelStatus === "Target Acquired" ? "warpSpeedActive" : ""}`}>
        <div className="warpImage warpImage1" />
        <div className="warpImage warpImage2" />
      </div>
    </div>
  );
};

export default Background;
