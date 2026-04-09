import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOpen } from "../../store/actions/chatActions";
import { MenuIcon } from "../UI/Icons";
import { useAuth } from "../../context/AuthContext";

export default function ChatHeader({ onMobileMenuToggle }) {
  const dispatch = useDispatch();
  const { sidebarOpen, isLoading } = useSelector((s) => s.chat);
  const { user, logout } = useAuth();
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
    <header className="chat-header" style={{
      padding: "10px 16px",
      borderBottom: "1px solid var(--border)",
      background: "var(--surface)",
      backdropFilter: "blur(20px)",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexShrink: 0,
      zIndex: 5,
      position: "relative",
      minHeight: 56,
      overflow: "visible",
    }}>

      {/* Desktop sidebar toggle */}
      <button
        onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
        title="Toggle sidebar"
        style={{
          background: "var(--surface-soft)", border: "1px solid var(--border)",
          borderRadius: 10, padding: 8, cursor: "pointer", color: "var(--muted)",
          display: "flex", alignItems: "center", transition: "all .2s",
          flexShrink: 0, minWidth: 36,
        }}
        className="desktop-sidebar-toggle"
        onMouseEnter={e => e.currentTarget.style.background = "rgba(138,161,118,.16)"}
        onMouseLeave={e => e.currentTarget.style.background = "var(--surface-soft)"}
      >
        <MenuIcon size={20} />
      </button>

      {/* Mobile sidebar toggle */}
      <button
        onClick={onMobileMenuToggle}
        title="Menu"
        style={{
          background: "var(--surface-soft)", border: "1px solid var(--border)",
          borderRadius: 10, padding: 8, cursor: "pointer", color: "var(--muted)",
          alignItems: "center", transition: "all .2s",
          flexShrink: 0, minWidth: 36,
          display: "none",
        }}
        className="mobile-menu-btn"
        onMouseEnter={e => e.currentTarget.style.background = "rgba(138,161,118,.16)"}
        onMouseLeave={e => e.currentTarget.style.background = "var(--surface-soft)"}
      >
        <MenuIcon size={20} />
      </button>

      {/* Brand — flex:1 with minWidth:0 so it shrinks and never pushes avatar off-screen */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        flex: 1, minWidth: 0, overflow: "hidden",
      }}>
        <div style={{
          fontSize: 28, flexShrink: 0,
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,.18))",
        }}>🐔</div>
        <div style={{ minWidth: 0, overflow: "hidden" }}>
          <div style={{
            fontFamily: "'Playfair Display', serif", fontSize: 17,
            fontWeight: 800, color: "var(--text)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            Poultry Expert AI
          </div>
          <div style={{
            fontSize: 11, color: "var(--muted)",
            fontFamily: "'Nunito', sans-serif",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            Your Virtual Farming Consultant
          </div>
        </div>
      </div>

      {/* Status pill — hidden on mobile so avatar always has room */}
      <div
        className="status-pill"
        style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "var(--surface-soft)", borderRadius: 20,
          padding: "6px 12px", border: "1px solid var(--border)",
          flexShrink: 0, whiteSpace: "nowrap",
        }}
      >
        <div style={{
          width: 7, height: 7, borderRadius: "50%",
          background: isLoading ? "#d4a14d" : "var(--accent)",
          animation: "pulseGlow 2s infinite",
        }} />
        <span style={{
          fontSize: 12,
          color: isLoading ? "#d4a14d" : "var(--accent-strong)",
          fontFamily: "'Nunito', sans-serif", fontWeight: 700,
        }}>
          {isLoading ? "Thinking…" : "Online"}
        </span>
      </div>

      {/* ── User avatar + dropdown — always visible, never hidden ── */}
      {user && (
        <div
          ref={menuRef}
          style={{ position: "relative", flexShrink: 0, zIndex: 100 }}
        >
          <button
            onClick={() => setMenuOpen(o => !o)}
            title={`${user.name} — click to sign out`}
            style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(138,161,118,1), rgba(107,129,98,1))",
              border: "2px solid rgba(138,161,118,.55)",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Nunito', sans-serif", fontSize: 15,
              fontWeight: 900, color: "#fff",
              boxShadow: "0 0 12px rgba(138,161,118,.35)",
              transition: "all .2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 0 22px rgba(138,161,118,.65)";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 0 12px rgba(138,161,118,.35)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {user.avatar}
          </button>

          {/* Dropdown — uses position:fixed so it's never clipped by parent overflow */}
          {menuOpen && (
            <div style={{
              position: "fixed",
              top: 62,
              right: 16,
              minWidth: 230,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14, padding: 6,
              boxShadow: "0 16px 48px rgba(0,0,0,.55), 0 0 0 1px rgba(138,161,118,.08)",
              animation: "dropIn .2s cubic-bezier(.16,1,.3,1)",
              zIndex: 9999,
              backdropFilter: "blur(24px)",
            }}>
              {/* User info */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 10px 8px",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(138,161,118,1), rgba(107,129,98,1))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Nunito', sans-serif", fontSize: 17,
                  fontWeight: 900, color: "#fff",
                }}>
                  {user.avatar}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Nunito', sans-serif", fontSize: 13,
                    fontWeight: 700, color: "var(--text)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    maxWidth: 150,
                  }}>
                    {user.name}
                  </div>
                  <div style={{
                    fontFamily: "monospace", fontSize: 11,
                    color: "var(--muted)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    maxWidth: 150,
                  }}>
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />

              {/* Sign out */}
              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 8,
                  padding: "9px 10px", borderRadius: 8,
                  background: "transparent", border: "none",
                  color: "#f87171",
                  fontFamily: "'Nunito', sans-serif", fontSize: 13,
                  fontWeight: 800, cursor: "pointer",
                  transition: "background .2s", letterSpacing: .5,
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(220,80,80,.12)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ fontSize: 16 }}>⎋</span> Sign Out
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity:0; transform:translateY(-8px) scale(.96); }
          to   { opacity:1; transform:translateY(0)   scale(1);   }
        }
        @media (max-width: 768px) {
          .desktop-sidebar-toggle { display: none !important; }
          .mobile-menu-btn        { display: flex !important; }
          .status-pill            { display: none !important; }
        }
        @media (max-width: 480px) {
          .status-pill { display: none !important; }
        }
      `}</style>
    </header>
  );
}