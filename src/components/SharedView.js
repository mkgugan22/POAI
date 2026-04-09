import React from "react";

export default function SharedView({ message }) {
  const hasMessage = Boolean(message);
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      color: "var(--text)",
      padding: 20,
      fontFamily: "'Nunito', sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 760,
        borderRadius: 28,
        background: "rgba(24,34,23,0.96)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
        padding: "28px 24px",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 22,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 16,
              display: "grid",
              placeItems: "center",
              background: "rgba(138,161,118,0.16)",
              color: "var(--accent-strong)",
              fontSize: 24,
            }}>
              🐔
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 0.2 }}>
                Poultry Expert
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                Shared response
              </div>
            </div>
          </div>

          <a
            href="/"
            style={{
              padding: "12px 18px",
              borderRadius: 14,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
              textDecoration: "none",
              fontWeight: 700,
              transition: "all 0.2s",
            }}
          >
            Open App
          </a>
        </div>

        <div style={{
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.04)",
          padding: 24,
          minHeight: 200,
          maxHeight: 420,
          overflowY: "auto",
          lineHeight: 1.72,
          whiteSpace: "pre-wrap",
          fontSize: 15,
          color: "var(--text)",
        }}>
          {hasMessage ? (
            message
          ) : (
            <div style={{ color: "var(--muted)", lineHeight: 1.6 }}>
              This shared response is not available. The link may be missing content or has expired.
            </div>
          )}
        </div>

        <div style={{
          marginTop: 18,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Sign in or create a free account to ask your own questions.
          </div>
          <a
            href="/"
            style={{
              padding: "12px 18px",
              borderRadius: 14,
              background: "linear-gradient(135deg, rgba(138,161,118,1), rgba(103,123,92,1))",
              color: "#fff",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Continue to App
          </a>
        </div>
      </div>
    </div>
  );
}
