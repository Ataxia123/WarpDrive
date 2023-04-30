// WarpSpeedCanvas.tsx
import React, { useEffect, useRef } from "react";

interface WarpSpeedCanvasProps {
  loadingProgress: number;
  active: boolean;
}

const WarpSpeedCanvas: React.FC<WarpSpeedCanvasProps> = ({ loadingProgress, active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !active) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId: number;

    const particles = [] as Particle[];
    const particleCount = 600;

    class Particle {
      x: number;
      y: number;
      z: number;
      speed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * canvas.width;
        this.speed = Math.random() * 2 + 0.5;
      }

      update() {
        this.z -= this.speed * (1 + loadingProgress / 100);
        if (this.z <= 0) {
          this.z = canvas.width;
        }
      }

      draw() {
        const radius = 2;
        const x = (this.x - canvas.width / 2) * (canvas.width / this.z);
        const y = (this.y - canvas.height / 2) * (canvas.width / this.z);
        const size = radius * (canvas.width / this.z);
        const opacity = 1 - this.z / canvas.width;

        ctx?.beginPath();
        ctx?.arc(x + canvas.width / 2, y + canvas.height / 2, size, 0, Math.PI * 2);
        //@ts-ignore
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx?.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const render = () => {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      for (const particle of particles as Particle[]) {
        particle?.update();
        particle?.draw();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, loadingProgress, active]);

  return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />;
};

export default WarpSpeedCanvas;
