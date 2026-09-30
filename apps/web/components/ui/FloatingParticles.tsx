"use client";

/**
 * 漂浮科技背景 — 光斑漂移 + 网格 + 噪点
 */
export function FloatingParticles() {
  return (
    <div className="bg-canvas" aria-hidden="true">
      {/* 光斑 */}
      <div
        className="blob animate-float-a"
        style={{
          width: 620,
          height: 620,
          background: "#B8956A",
          top: -180,
          right: -160,
          opacity: 0.13,
        }}
      />
      <div
        className="blob animate-float-b"
        style={{
          width: 520,
          height: 520,
          background: "#2b3f63",
          bottom: -160,
          left: -140,
          opacity: 0.12,
        }}
      />
      <div
        className="blob animate-float-c"
        style={{
          width: 360,
          height: 360,
          background: "#8a6f45",
          top: "46%",
          left: "56%",
          opacity: 0.08,
        }}
      />

      {/* 网格 */}
      <div
        className="absolute inset-0 grid-mask"
        style={{
          backgroundImage:
            "linear-gradient(rgba(184,149,106,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(184,149,106,0.05) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />

      {/* 噪点 */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* 暗角 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, transparent 40%, rgba(14,12,10,0.75) 100%)",
        }}
      />
    </div>
  );
}
