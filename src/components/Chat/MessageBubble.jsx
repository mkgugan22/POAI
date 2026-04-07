import React, { useState } from "react";
import TypingIndicator from "../UI/TypingIndicator";
import { CopyIcon, ShareIcon, DownloadIcon, ThumbUpIcon, CheckIcon } from "../UI/Icons";
import { renderMarkdown } from "../../utils/markdown";
import { formatTime, copyToClipboard, downloadAsText } from "../../utils/helpers";

const ACTION_BTN_STYLE = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: "4px 11px",
  background: "var(--action-bg)",
  border: "1px solid var(--border)",
  borderRadius: 20,
  cursor: "pointer",
  color: "var(--accent)",
  fontSize: 11,
  fontFamily: "'Nunito', sans-serif",
  fontWeight: 700,
  transition: "all 0.18s",
};

function ActionButton({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        ...ACTION_BTN_STYLE,
        ...(active
          ? { background: "var(--accent-soft)", color: "var(--accent-strong)", borderColor: "var(--border-strong)" }
          : {}),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--accent-soft)";
        e.currentTarget.style.color = "var(--accent-strong)";
        e.currentTarget.style.borderColor = "var(--border-strong)";
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "var(--action-bg)";
          e.currentTarget.style.color = "var(--accent)";
          e.currentTarget.style.borderColor = "var(--border)";
        }
      }}
    >
      {icon}
      {label}
    </button>
  );
}

export default function MessageBubble({ msg, onShare, showToast }) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(msg.content);
    setCopied(true);
    showToast("Response copied to clipboard!");
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    downloadAsText(msg.content, `poultry-expert-${Date.now()}.txt`);
    showToast("Response downloaded as .txt!");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 26,
        animation: "fadeSlideUp 0.32s ease forwards",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          background: isUser
            ? "linear-gradient(135deg, #8e6f42, #b18d55)"
            : "linear-gradient(135deg, rgba(138,161,118,1), rgba(107,129,98,1))",
          boxShadow: isUser
            ? "0 4px 14px rgba(0,0,0,0.2)"
            : "0 4px 14px rgba(0,0,0,0.18)",
        }}
      >
        {isUser ? "👨‍🌾" : "🐔"}
      </div>

      <div style={{ maxWidth: "75%", minWidth: 60 }}>
        {/* Role label */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1.5,
            color: isUser ? "var(--accent-strong)" : "var(--accent)",
            textTransform: "uppercase",
            marginBottom: 5,
            textAlign: isUser ? "right" : "left",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          {isUser ? "You" : "Poultry Expert"}
        </div>

        {/* Bubble */}
        <div
          style={{
            background: isUser ? "var(--user-bubble)" : "var(--assistant-bubble)",
            border: isUser
              ? "1px solid rgba(180,138,72,0.28)"
              : "1px solid var(--border)",
            borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
            padding: "14px 18px",
            backdropFilter: "blur(14px)",
            boxShadow: "0 4px 22px rgba(0,0,0,0.28)",
          }}
        >
          {msg.isLoading ? (
            <TypingIndicator />
          ) : (
            <div
              className="msg-content"
              style={{
                color: isUser ? "#fff" : "var(--assistant-text)",
                fontSize: 15,
                lineHeight: 1.75,
                fontFamily: "'Nunito', sans-serif",
              }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
            />
          )}
        </div>

        {/* Action bar — assistant only */}
        {!isUser && !msg.isLoading && (
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 8,
              flexWrap: "wrap",
            }}
          >
            <ActionButton
              icon={copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
              label={copied ? "Copied!" : "Copy"}
              onClick={handleCopy}
              active={copied}
            />
            <ActionButton
              icon={<ShareIcon size={13} />}
              label="Share Link"
              onClick={() => onShare(msg)}
            />
            <ActionButton
              icon={<DownloadIcon size={13} />}
              label="Download"
              onClick={handleDownload}
            />
            <ActionButton
              icon={<ThumbUpIcon size={13} />}
              label={liked ? "Liked!" : "Like"}
              onClick={() => setLiked(!liked)}
              active={liked}
            />
          </div>
        )}

        {/* Timestamp */}
        <div
          style={{
            fontSize: 10,
            color: "var(--timestamp)",
            textAlign: isUser ? "right" : "left",
            marginTop: 5,
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          {formatTime(msg.timestamp)}
        </div>
      </div>
    </div>
  );
}
