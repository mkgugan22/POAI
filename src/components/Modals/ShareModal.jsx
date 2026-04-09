import React, { useState, useMemo } from "react";
import { buildShareUrl, copyToClipboard } from "../../utils/helpers";
import { CloseIcon, LinkIcon, CopyIcon, CheckIcon } from "../UI/Icons";

export default function ShareModal({ message, onClose, showToast }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // buildShareUrl is now synchronous — no async/useEffect needed
  const shareUrl = useMemo(() => buildShareUrl(message.content), [message.content]);

  // Show a clean truncated URL in the display box (not the raw base64)
  const displayUrl = useMemo(() => {
    if (!shareUrl) return "";
    if (shareUrl.length <= 72) return shareUrl;
    return shareUrl.slice(0, 48) + "…" + shareUrl.slice(-20);
  }, [shareUrl]);

  const handleCopyLink = async () => {
    await copyToClipboard(shareUrl);
    setCopiedLink(true);
    showToast("Share link copied!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyText = async () => {
    await copyToClipboard(message.content);
    setCopiedText(true);
    showToast("Full response copied!");
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(8px)",
        animation: "fadeSlideUp 0.22s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 22, padding: "28px 26px", maxWidth: 520, width: "92%",
          boxShadow: "0 24px 64px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,0.03)",
          animation: "fadeSlideUp 0.28s cubic-bezier(0.34,1.36,0.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", marginBottom: 18,
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontSize: 20,
              fontWeight: 700, color: "var(--accent-strong)", marginBottom: 3,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <LinkIcon size={18} color="var(--accent)" /> Share Response
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.4)",
              fontFamily: "'Nunito', sans-serif", fontSize: 13,
            }}>
              Share this expert answer with other farmers
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: 7, cursor: "pointer",
              color: "rgba(255,255,255,0.45)",
              display: "flex", alignItems: "center", flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* ── Share URL label ── */}
        <div style={{
          fontSize: 12, color: "var(--muted)", fontWeight: 700,
          fontFamily: "'Nunito', sans-serif",
          textTransform: "uppercase", letterSpacing: 1, marginBottom: 8,
        }}>
          Share URL
        </div>

        {/* ── URL box + Copy Link button ── */}
        <div style={{
          display: "flex", gap: 8, alignItems: "stretch", marginBottom: 16,
        }}>
          <div style={{
            flex: 1, minWidth: 0,
            background: "var(--surface-soft)",
            border: "1px solid var(--border)",
            borderRadius: 12, padding: "11px 14px",
            fontFamily: "monospace", fontSize: 12,
            color: "var(--accent)", wordBreak: "break-all",
            lineHeight: 1.5,
          }}>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={shareUrl}
              style={{
                color: "var(--accent)", textDecoration: "none",
                display: "block",
              }}
            >
              {displayUrl}
            </a>
          </div>
          <button
            onClick={handleCopyLink}
            style={{
              flexShrink: 0, padding: "11px 16px", borderRadius: 12,
              cursor: "pointer",
              background: copiedLink
                ? "linear-gradient(135deg, rgba(138,161,118,1), rgba(107,129,98,1))"
                : "rgba(138,161,118,0.18)",
              border: "1px solid rgba(138,161,118,0.4)",
              color: "#fff",
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13,
              transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!copiedLink) e.currentTarget.style.background = "rgba(138,161,118,0.28)";
            }}
            onMouseLeave={(e) => {
              if (!copiedLink) e.currentTarget.style.background = "rgba(138,161,118,0.18)";
            }}
          >
            {copiedLink ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            {copiedLink ? "Copied!" : "Copy link"}
          </button>
        </div>

        {/* ── Response preview label ── */}
        <div style={{
          fontSize: 12, color: "var(--muted)", fontWeight: 700,
          fontFamily: "'Nunito', sans-serif",
          textTransform: "uppercase", letterSpacing: 1, marginBottom: 8,
        }}>
          Response preview
        </div>

        {/* ── Preview snippet ── */}
        <div style={{
          background: "var(--surface-soft)", border: "1px solid var(--border)",
          borderRadius: 12, padding: "14px 16px", marginBottom: 18,
          fontSize: 14, color: "var(--text)", fontFamily: "'Nunito', sans-serif",
          lineHeight: 1.7, maxHeight: 160, overflowY: "auto",
          whiteSpace: "pre-wrap",
        }}>
          {message.content.slice(0, 300)}{message.content.length > 300 ? "…" : ""}
        </div>

        {/* ── Bottom action row ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        }}>
          <button
            onClick={handleCopyText}
            style={{
              padding: "10px 18px", borderRadius: 12, cursor: "pointer",
              background: copiedText
                ? "linear-gradient(135deg, rgba(138,161,118,1), rgba(107,129,98,1))"
                : "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: copiedText ? "#fff" : "var(--muted)",
              fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13,
              display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!copiedText) e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              if (!copiedText) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
          >
            {copiedText ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            {copiedText ? "Copied!" : "Copy text"}
          </button>

          <span style={{
            fontSize: 12, color: "rgba(255,255,255,0.3)",
            fontFamily: "'Nunito', sans-serif",
          }}>
            Share this response with other farmers.
          </span>
        </div>

      </div>
    </div>
  );
}