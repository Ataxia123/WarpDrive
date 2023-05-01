// WarpSpeedCanvas.tsx
import React, { useEffect, useRef } from "react";

interface WarpSpeedCanvasProps {
  loadingProgress: number;
  active: boolean;
}

function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle) {
  const radius = 2;
  const x = (particle.x - ctx.canvas.width / 2) * (ctx.canvas.width / particle.z);
  const y = (particle.y - ctx.canvas.height / 2) * (ctx.canvas.width / particle.z);
  const size = radius * (ctx.canvas.width / particle.z);
  const opacity = 1 - particle.z / ctx.canvas.width;

  const gradient = ctx.createRadialGradient(
    x + ctx.canvas.width / 2,
    y + ctx.canvas.height / 2,
    0,
    x + ctx.canvas.width / 2,
    y + ctx.canvas.height / 2,
    size,
  );

  gradient.addColorStop(0, `rgba(242, 152, 47, ${opacity})`);
  gradient.addColorStop(0.5, `rgba(242, 152, 47, ${opacity * 0.5})`);
  gradient.addColorStop(1, `rgba(242, 152, 47, 0)`);

  ctx.beginPath();
  ctx.arc(x + ctx.canvas.width / 2, y + ctx.canvas.height / 2, size, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

class Particle {
  x: number;
  y: number;
  z: number;
  speed: number;

  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.z = Math.random() * window.innerWidth;
    this.speed = Math.random() * 2 + 0.5;
  }

  update(loadingProgress: number) {
    this.z -= this.speed * (1 + loadingProgress / 100);
    if (this.z <= 0) {
      this.z = window.innerWidth;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawParticle(ctx, this);
  }
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
    const particleCount = 2000;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const particle of particles as Particle[]) {
        particle.update(loadingProgress); // Add this line to update particle positions
        particle.draw(ctx);
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
