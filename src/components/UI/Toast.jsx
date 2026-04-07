import React, { useEffect } from "react";

export default function Toast({ message, onClose, duration = 2500 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 9999,
        background: "var(--accent)",
        color: "#fff",
        padding: "12px 22px",
        borderRadius: 14,
        boxShadow: "0 8px 32px rgba(0,0,0,0.24), 0 0 0 1px rgba(138,161,118,0.22)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 700,
        fontSize: 14,
        animation: "slideInToast 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: "pointer",
      }}
      onClick={onClose}
    >
      <span style={{ fontSize: 18 }}>✓</span>
      {message}
    </div>
  );
}
