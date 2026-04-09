import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {  deleteConversation } from "../../store/actions/chatActions";
import { PlusIcon, TrashIcon, ChatIcon } from "../UI/Icons";
import { truncate } from "../../utils/helpers";

export default function Sidebar({ onNewChat, onSelectConv, theme, onSetTheme }) {
  const dispatch = useDispatch();
  const { conversationList, activeConversationId, sidebarOpen, conversations } =
    useSelector((s) => s.chat);

  return (
    <aside
      className={`sidebar ${sidebarOpen ? 'open' : ''}`}
      style={{
        width: sidebarOpen ? 280 : 0,
        flexShrink: 0,
        background: "linear-gradient(180deg, var(--surface-strong), var(--surface))",
        borderRight: "1px solid var(--border)",
        overflow: "hidden",
        transition: "width 0.32s cubic-bezier(0.4,0,0.2,1)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ minWidth: 280, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* ── Logo ── */}
        <div
          style={{
            padding: "28px 20px 20px",
            textAlign: "center",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 8, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.18))" }}>
            🐓
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              fontWeight: 800,
              color: "var(--text)",
              background: "none",
              WebkitBackgroundClip: "unset",
              WebkitTextFillColor: "unset",
              letterSpacing: 0.3,
              textShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            Poultry Expert
          </div>
          <div
            style={{
              fontSize: 10,
              color: "var(--muted)",
              fontFamily: "'Nunito', sans-serif",
              letterSpacing: 2,
              marginTop: 2,
              fontWeight: 700,
            }}
          >
            AI FARMING CONSULTANT
          </div>
        </div>

        {/* ── New Chat Button ── */}
        <div style={{ padding: "16px 16px 8px" }}>
          <button
            onClick={onNewChat}
            style={{
              width: "100%",
              padding: "11px 16px",
              background: "var(--surface-soft)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--accent-strong)",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(138,161,118,0.16)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--surface-soft)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <PlusIcon size={16} /> New Conversation
          </button>
        </div>

        {/* ── History Label ── */}
        <div
          style={{
            padding: "8px 20px 6px",
            fontSize: 10,
            color: "var(--muted)",
            letterSpacing: 1.8,
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
          }}
        >
          RECENT CHATS
        </div>

        {/* ── Conversation List ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 10px" }}>
          {conversationList.length === 0 && (
            <div
              style={{
                padding: "20px 10px",
                textAlign: "center",
                color: "rgba(255,255,255,0.2)",
                fontSize: 13,
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              No conversations yet
            </div>
          )}
          {conversationList.map((conv) => {
            const msgs = conversations[conv.id] || [];
            const preview =
              msgs.find((m) => m.role === "user")?.content?.slice(0, 42) ||
              "Start a new conversation…";
            const isActive = conv.id === activeConversationId;

            return (
              <ConversationItem
                key={conv.id}
                conv={conv}
                preview={preview}
                isActive={isActive}
                onSelect={() => onSelectConv(conv.id)}
                onDelete={(e) => {
                  e.stopPropagation();
                  dispatch(deleteConversation(conv.id));
                }}
              />
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              background: "var(--surface-soft)",
              borderRadius: 12,
              padding: "11px 14px",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "var(--accent)",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                marginBottom: 3,
              }}
            >
              🌿 Powered by G7 AI
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--muted)",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              Expert poultry farming guidance
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                marginTop: 12,
              }}
            >
              {[
                { label: "Dark Mode", value: "dark" },
                { label: "Light Mode", value: "light" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSetTheme(option.value)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: `1px solid ${theme === option.value ? "var(--accent)" : "var(--border)"}`,
                    background: theme === option.value ? "rgba(138,161,118,0.18)" : "var(--surface-soft)",
                    color: theme === option.value ? "var(--accent-strong)" : "var(--text)",
                    cursor: "pointer",
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    transition: "all 0.2s",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ConversationItem({ conv, preview, isActive, onSelect, onDelete }) {
  return (
    <div
      onClick={onSelect}
      style={{
        padding: "10px 10px",
        borderRadius: 10,
        marginBottom: 3,
        background: isActive ? "rgba(138,161,118,0.16)" : "transparent",
        border: isActive
          ? "1px solid rgba(138,161,118,0.28)"
          : "1px solid transparent",
        cursor: "pointer",
        transition: "all 0.15s",
        display: "flex",
        alignItems: "center",
        gap: 8,
        group: "true",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.querySelector(".delete-btn").style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent";
        e.currentTarget.querySelector(".delete-btn").style.opacity = "0";
      }}
    >
      <ChatIcon size={14} color={isActive ? "var(--accent-strong)" : "rgba(255,255,255,0.3)"} />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div
          style={{
            color: isActive ? "var(--accent-strong)" : "rgba(255,255,255,0.72)",
            fontSize: 13,
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {truncate(conv.title, 28)}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.28)",
            fontSize: 11,
            fontFamily: "'Nunito', sans-serif",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {truncate(preview, 34)}
        </div>
      </div>
      <button
        className="delete-btn"
        onClick={onDelete}
        title="Delete conversation"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(255,80,80,0.6)",
          padding: 4,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          opacity: 0,
          transition: "opacity 0.15s, color 0.15s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,80,80,1)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,80,80,0.6)")}
      >
        <TrashIcon size={13} />
      </button>
    </div>
  );
}
