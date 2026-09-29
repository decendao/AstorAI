"use client";
import { cn } from "@astorai/utils";

export function GlassCard({
  className,
  children,
  glow = false,
}: {
  className?: string;
  children: React.ReactNode;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 relative overflow-hidden",
        glow && "glass-strong",
        className,
      )}
    >
      {glow && (
        <div
          aria-hidden
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, #d4a64a 0%, transparent 70%)" }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}