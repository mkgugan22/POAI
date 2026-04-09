import React from "react";

export default function SharedView() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#0a0e1a", color: "#f0f4ff",
      fontFamily: "'Space Grotesk', sans-serif", flexDirection: "column", gap: 16,
    }}>
      <div style={{ fontSize: 48 }}>⬡</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>Shared conversation</div>
      <div style={{ fontSize: 14, color: "#7a8aaa" }}>This link is no longer valid or has expired.</div>
      <a href="/" style={{ marginTop: 8, color: "#00d2ff", fontSize: 14, fontWeight: 600 }}>
        ← Go to FSAI
      </a>
    </div>
  );
}