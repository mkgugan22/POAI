import React, { useState, useRef, useEffect } from "react";

const CSS = `
  @keyframes dropIn { from{opacity:0;transform:translateY(-8px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes orbPulse { 0%,100%{box-shadow:0 0 14px rgba(0,210,255,.3)} 50%{box-shadow:0 0 28px rgba(0,210,255,.55)} }
  .fsai-avatar-btn { transition:all .2s; }
  .fsai-avatar-btn:hover { transform:scale(1.07)!important; box-shadow:0 0 22px rgba(0,210,255,.5)!important; }
  .fsai-logout-btn { transition:background .18s; }
  .fsai-logout-btn:hover { background:rgba(255,95,95,.12)!important; }
`;

export default function ChatHeader({
  title,
  onNewChat,
  onMobileMenuToggle,
  isDarkMode,
  onToggleTheme,
  onLogout,
  user,
  // any other props your existing ChatHeader uses
  ...rest
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 20px", height: 60, flexShrink: 0,
      borderBottom: "1px solid rgba(100,150,255,.12)",
      background: "rgba(20,26,40,.85)", backdropFilter: "blur(20px)",
      position: "relative", zIndex: 10, gap: 12,
    }}>
      <style>{CSS}</style>

      {/* Left side */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        {/* Mobile hamburger */}
        {onMobileMenuToggle && (
          <button onClick={onMobileMenuToggle} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 34, height: 34, borderRadius: 8,
            background: "rgba(30,37,56,.7)", border: "1px solid rgba(100,150,255,.2)",
            color: "#b8c4d8", fontSize: 16, cursor: "pointer", flexShrink: 0,
          }}>☰</button>
        )}

        {/* Conversation title */}
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700,
          color: "#f0f4ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{title || "New Chat"}</span>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {/* New Chat button */}
        {onNewChat && (
          <button onClick={onNewChat} style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "6px 12px", borderRadius: 8,
            background: "rgba(0,210,255,.1)", border: "1px solid rgba(0,210,255,.25)",
            color: "#00d2ff", fontFamily: "'Syne',sans-serif", fontSize: 11,
            fontWeight: 800, letterSpacing: 1, cursor: "pointer",
            whiteSpace: "nowrap", textTransform: "uppercase",
          }}>
            + New Chat
          </button>
        )}

        {/* Theme toggle */}
        {onToggleTheme && (
          <button onClick={onToggleTheme} title={isDarkMode ? "Light mode" : "Dark mode"} style={{
            width: 32, height: 32, borderRadius: 8, fontSize: 15, cursor: "pointer",
            background: "rgba(30,37,56,.7)", border: "1px solid rgba(100,150,255,.2)",
            color: "#b8c4d8", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .2s",
          }}>
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        )}

        {/* User avatar + dropdown */}
        {user && (
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              className="fsai-avatar-btn"
              onClick={() => setMenuOpen(o => !o)}
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "linear-gradient(135deg,#7c3aed,#00d2ff)",
                border: "2px solid rgba(0,210,255,.4)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 14px rgba(0,210,255,.3)", flexShrink: 0,
                animation: "orbPulse 3s ease-in-out infinite",
              }}
            >
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 900, color: "#fff" }}>
                {user.avatar || user.name?.[0]?.toUpperCase() || "U"}
              </span>
            </button>

            {menuOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 10px)", right: 0, minWidth: 210,
                background: "rgba(20,26,40,.97)", border: "1px solid rgba(100,150,255,.2)",
                borderRadius: 12, padding: 6,
                boxShadow: "0 16px 40px rgba(0,0,0,.5),0 0 0 1px rgba(0,210,255,.06)",
                backdropFilter: "blur(20px)",
                animation: "dropIn .2s cubic-bezier(.16,1,.3,1)", zIndex: 100,
              }}>
                {/* User info */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px 8px" }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%",
                    background: "linear-gradient(135deg,#7c3aed,#00d2ff)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 900, color: "#fff", flexShrink: 0,
                  }}>
                    {user.avatar || user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700,
                      color: "#f0f4ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.name}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 500,
                      color: "#7a8aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email}
                    </div>
                  </div>
                </div>

                <div style={{ height: 1, background: "rgba(100,150,255,.12)", margin: "4px 0" }} />

                {/* Logout */}
                <button
                  className="fsai-logout-btn"
                  onClick={() => { setMenuOpen(false); onLogout && onLogout(); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 8,
                    padding: "9px 10px", borderRadius: 8, background: "transparent", border: "none",
                    color: "#ff5f5f", fontFamily: "'Syne',sans-serif", fontSize: 11,
                    fontWeight: 800, letterSpacing: 1, cursor: "pointer", textAlign: "left",
                    textTransform: "uppercase",
                  }}
                >
                  <span>⎋</span> Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}