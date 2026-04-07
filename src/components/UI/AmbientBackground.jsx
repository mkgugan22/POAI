import React from "react";

const FLOATERS = [
  { icon: "🌾", size: 30, opacity: 0.06, top: "14%", right: "4%",  duration: 4, delay: 0   },
  { icon: "🍃", size: 22, opacity: 0.05, top: "58%", right: "2.5%",duration: 6, delay: 1.5 },
  { icon: "🌿", size: 18, opacity: 0.04, top: "34%", right: "7%",  duration: 5, delay: 0.8 },
  { icon: "🌾", size: 14, opacity: 0.04, top: "78%", right: "12%", duration: 7, delay: 2.2 },
];

export default function AmbientBackground() {
  return (
    <>
      {/* Radial gradient blobs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 18% 18%, rgba(30,70,10,0.45) 0%, transparent 58%)," +
            "radial-gradient(ellipse at 82% 82%, rgba(60,100,20,0.28) 0%, transparent 58%)," +
            "radial-gradient(ellipse at 60% 10%, rgba(20,50,8,0.3) 0%, transparent 45%)," +
            "#060e04",
          pointerEvents: "none",
        }}
      />

      {/* Floating botanical decorations */}
      {FLOATERS.map((f, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            fontSize: f.size,
            opacity: f.opacity,
            zIndex: 0,
            top: f.top,
            right: f.right,
            animation: `featherFloat ${f.duration}s ease-in-out infinite`,
            animationDelay: `${f.delay}s`,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {f.icon}
        </div>
      ))}
    </>
  );
}
