// SpaceParticles.tsx
import React, { useEffect, useRef } from "react";

const SpaceParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set the canvas size to match the parent div
    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    const particlesArray: Particle[] = [];
    const particleCount = 150;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor(canvas: HTMLCanvasElement | null) {
        this.x = Math.random() * (canvas?.width ?? window.innerWidth);
        this.y = Math.random() * (canvas?.height ?? window.innerHeight);
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
      }

      update(canvas: HTMLCanvasElement | null) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.1;

        if (this.x < 0 || this.x > (canvas?.width ?? 0) || this.y < 0 || this.y > (canvas?.height ?? 0)) {
          this.x = Math.random() * (canvas?.width ?? 0);
          this.y = Math.random() * (canvas?.height ?? 0);
          this.size = Math.random() * 5 + 1;
          this.speedX = Math.random() * 3 - 1.5;
          this.speedY = Math.random() * 3 - 1.5;
        }
      }

      draw(ctx: CanvasRenderingContext2D | null) {
        if (!ctx) return;
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.strokeStyle = "rgba(34, 147, 214, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particlesArray.push(new Particle(canvas));
    }

    for (let i = 0; i < particleCount; i++) {
      particlesArray.push(new Particle(canvas));
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      for (const particle of particlesArray) {
        particle.update(canvas);
        particle.draw(ctx);
      }

      // Add haze effect
      ctx.fillStyle = "rgba(0, 0, 30, 0.1)";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", zIndex: 2, pointerEvents: "none" }} />;
};

export default SpaceParticles;
