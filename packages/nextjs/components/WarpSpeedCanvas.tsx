import React, { useEffect, useRef } from "react";
import Background from "./Background";

interface WarpSpeedCanvasProps {
  active: boolean;
  progress: number;
}

class Star {
  x: number;
  y: number;
  color: number;
  normalizedProgress: number;

  constructor(normalizedProgress: number) {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.color = 0;
    this.normalizedProgress = normalizedProgress;
  }
  // ...

  update() {
    const speedMult = 0.02 * (1 + this.normalizedProgress * 2);
    this.x += (this.x - window.innerWidth / 2) * speedMult;
    this.y += (this.y - window.innerHeight / 2) * speedMult;
    this.updateColor();

    if (this.x > window.innerWidth || this.x < 0) {
      this.x = Math.random() * window.innerWidth;
      this.color = 0;
    }
    if (this.y > window.innerHeight || this.y < 0) {
      this.y = Math.random() * window.innerHeight;
      this.color = 0;
    }
  }

  updateColor() {
    if (this.color < 255) {
      this.color += 5;
    } else {
      this.color = 255;
    }
  }
}

const WarpSpeedCanvas: React.FC<WarpSpeedCanvasProps> = ({ active, progress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const normalizedProgress = progress / 100;

  useEffect(() => {
    if (!canvasRef.current || !active) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId: number;

    const stars = [] as Star[];
    const starCount = 500 + normalizedProgress * 5000; // Increase star count by up to 1000 when progress goes from 0 to 100

    for (let i = 0; i < starCount; i++) {
      stars.push(new Star(normalizedProgress));
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        ctx.fillStyle = `rgb(${star.color}, ${star.color}, ${star.color})`;
        ctx.fillRect(star.x, star.y, star.color / 128, star.color / 128);
        star.update();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        opacity: 0.95,
        backgroundImage: "url(https://www.popsci.com/uploads/2019/10/25/BROOAKO2AURRGAKZZ27N5IOCHM.jpg)",
      }}
    />
  );
};

export default WarpSpeedCanvas;
