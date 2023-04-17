import React, { useEffect, useState } from "react";

interface BackgroundProps {
  dynamicImageUrl: string;
  fixedImageUrl: string;
}

const Background: React.FC<BackgroundProps> = ({ dynamicImageUrl, fixedImageUrl }) => {
  const [bgPosition, setBgPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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

  return (
    <div className="background">
      <img
        className="dynamicImage"
        src={dynamicImageUrl}
        alt="Dynamic Image"
        style={{
          transform: `translate(${bgPosition.x}px, ${bgPosition.y}px)`,
        }}
      />
      <img className="fixedImage" src={fixedImageUrl} alt="Fixed Image" />
    </div>
  );
};

export default Background;
