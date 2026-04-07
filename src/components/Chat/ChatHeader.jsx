import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOpen } from "../../store/actions/chatActions";
import { MenuIcon } from "../UI/Icons";

export default function ChatHeader() {
  const dispatch = useDispatch();
  const { sidebarOpen, isLoading } = useSelector((s) => s.chat);

  return (
    <header
      className="chat-header"
      style={{
        padding: "13px 20px",
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexShrink: 0,
        zIndex: 5,
      }}
    >
      {/* Sidebar toggle */}
      <button
        onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
        title="Toggle sidebar"
        style={{
          background: "var(--surface-soft)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "8px",
          cursor: "pointer",
          color: "var(--muted)",
          display: "flex",
          alignItems: "center",
          transition: "all 0.2s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(138,161,118,0.16)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-soft)")}
      >
        <MenuIcon size={20} />
      </button>

      {/* Brand */}
      <div className="brand" style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
        <div
          style={{
            fontSize: 30,
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.18))",
          }}
        >
          🐔
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 19,
              fontWeight: 800,
              color: "var(--text)",
              background: "none",
              WebkitBackgroundClip: "unset",
              WebkitTextFillColor: "unset",
              animation: "none",
              textShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            Poultry Expert AI
          </div>
          <div
            className="subtitle"
            style={{
              fontSize: 11,
              color: "var(--muted)",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Your Virtual Farming Consultant
          </div>
        </div>
      </div>

      {/* Status pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          background: "var(--surface-soft)",
          borderRadius: 20,
          padding: "6px 14px",
          border: "1px solid var(--border)",
          transition: "all 0.3s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: isLoading ? "#d4a14d" : "var(--accent)",
            animation: "pulseGlow 2s infinite",
          }}
        />
        <span
          style={{
            fontSize: 12,
            color: isLoading ? "#d4a14d" : "var(--accent-strong)",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
          }}
        >
          {isLoading ? "Thinking…" : "Online"}
        </span>
      </div>
    </header>
  );
}
