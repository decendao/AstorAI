"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  color: string;
  alpha: number;
}

const COLORS = [
  "rgba(212,166,74,",  // gold
  "rgba(126,230,233,", // cyan
  "rgba(167,139,250,", // violet
  "rgba(251,113,133,", // rose
];

export function FloatingParticles({
  count = 60,
  density = 1,
}: { count?: number; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    let w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    let h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const init = () => {
        particles = Array.from({ length: count * density }, () => ({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 0.6 + Math.random() * 1.4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: 0.3 + Math.random() * 0.5,
        }));
      };
    init();

    const draw = () => {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = cw; if (p.x > cw) p.x = 0;
        if (p.y < 0) p.y = ch; if (p.y > ch) p.y = 0;

        // 漂浮感: 加一点 sin 摆动
        const ox = Math.sin((Date.now() / 2000) + p.x * 0.01) * 1.5;
        const oy = Math.cos((Date.now() / 2500) + p.y * 0.01) * 1.5;

        ctx.beginPath();
        ctx.arc(p.x + ox, p.y + oy, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.fill();

        // 光晕
        ctx.beginPath();
        ctx.arc(p.x + ox, p.y + oy, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (p.alpha * 0.15) + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [count, density]);

  return (
    <canvas
      ref={ref}
      className="particle-canvas"
      aria-hidden
    />
  );
}

/** 浮动卡片背景动画 (CSS 驱动, 不消耗 JS) */
export function FloatingOrb({
  className = "",
  size = 320,
  delay = 0,
  color = "rgba(212,166,74,0.18)",
}: {
  className?: string;
  size?: number;
  delay?: number;
  color?: string;
}) {
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{
        width: size, height: size, background: color,
      }}
      animate={{
        y: [0, -20, 0, 20, 0],
        x: [0, 15, 0, -15, 0],
        scale: [1, 1.06, 1, 0.96, 1],
      }}
      transition={{ duration: 14 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}