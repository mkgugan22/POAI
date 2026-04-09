import React, { useEffect, useState, useMemo } from "react";
import { decodeShareMsg, copyToClipboard } from "../utils/helpers";
import { renderMarkdown } from "../utils/markdown";

export default function SharedView({ message, sid }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [error, setError] = useState("");

  // Decode message from URL param or use prop passed from App
  const visibleMessage = useMemo(() => {
    // Prefer the prop passed from App (already decoded)
    if (message) return message;
    // Fallback: try to decode from URL directly
    const params = new URLSearchParams(window.location.search);
    const msgParam = params.get("msg");
    if (msgParam) {
      const decoded = decodeShareMsg(msgParam);
      if (!decoded) setError("Could not decode this share link. It may be corrupted.");
      return decoded;
    }
    setError("No content found in this share link.");
    return null;
  }, [message]);

  // Allow the page to scroll (global.css sets overflow:hidden on body/#root)
  useEffect(() => {
    const els = [document.documentElement, document.body];
    const originals = els.map((el) => el.style.overflow);
    els.forEach((el) => { el.style.overflow = "auto"; });
    const root = document.getElementById("root");
    let rootOrig = "";
    if (root) { rootOrig = root.style.overflow; root.style.overflow = "auto"; }
    return () => {
      els.forEach((el, i) => { el.style.overflow = originals[i]; });
      if (root) root.style.overflow = rootOrig;
    };
  }, []);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const displayUrl = useMemo(() => {
    if (!shareUrl) return "";
    if (shareUrl.length <= 72) return shareUrl;
    return shareUrl.slice(0, 48) + "…" + shareUrl.slice(-20);
  }, [shareUrl]);

  const handleCopyLink = async () => {
    await copyToClipboard(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleCopyText = async () => {
    if (!visibleMessage) return;
    await copyToClipboard(visibleMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2200);
  };

  const handleOpenApp = () => {
    window.location.href = window.location.origin + "/";
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      background: "var(--bg)",
      color: "var(--text)",
      padding: "40px 16px 60px",
      fontFamily: "'Nunito', sans-serif",
      boxSizing: "border-box",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 980,
        borderRadius: 30,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 28px 80px rgba(0,0,0,0.32)",
        overflow: "hidden",
      }}>

        {/* ── Card top gradient header ── */}
        <div style={{
          background: "linear-gradient(180deg, rgba(138,161,118,0.14), transparent)",
          padding: "28px 28px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}>
          <div style={{
            display: "flex", alignItems: "flex-start",
            justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 0.3, color: "var(--text)" }}>
                Poultry Expert AI
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                Shared response
              </div>
            </div>
            <button
              onClick={handleOpenApp}
              style={{
                padding: "12px 20px", borderRadius: 14,
                background: "var(--surface-strong)",
                border: "1px solid var(--border)",
                color: "var(--text)", cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700, fontSize: 14,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(138,161,118,0.16)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--surface-strong)"}
            >
              Open App
            </button>
          </div>
        </div>

        {/* ── Card body ── */}
        <div style={{ padding: "24px 28px 32px" }}>

          {/* Share URL section */}
          <div style={{ marginBottom: 22 }}>
            <div style={{
              fontSize: 13, color: "var(--muted)", fontWeight: 700,
              fontFamily: "'Nunito', sans-serif", marginBottom: 10,
            }}>
              Share URL
            </div>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 10, alignItems: "stretch",
            }}>
              <div style={{
                flex: 1, minWidth: 0,
                background: "var(--surface-soft)",
                border: "1px solid var(--border)",
                borderRadius: 16, padding: "14px 16px",
                color: "var(--accent)", fontFamily: "monospace",
                fontSize: 13, lineHeight: 1.5,
                wordBreak: "break-all", overflowWrap: "anywhere",
              }}>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={shareUrl}
                  style={{
                    color: "var(--accent)", textDecoration: "none",
                    display: "block", width: "100%",
                  }}
                >
                  {displayUrl}
                </a>
              </div>
              <button
                onClick={handleCopyLink}
                style={{
                  flexShrink: 0, borderRadius: 14, padding: "14px 20px",
                  cursor: "pointer",
                  background: copiedLink
                    ? "linear-gradient(135deg, rgba(138,161,118,1), rgba(103,123,92,1))"
                    : "var(--surface-soft)",
                  border: "1px solid var(--border)",
                  color: copiedLink ? "#fff" : "var(--text)",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700, fontSize: 14,
                  transition: "all 0.2s", whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!copiedLink) e.currentTarget.style.background = "rgba(138,161,118,0.16)";
                }}
                onMouseLeave={(e) => {
                  if (!copiedLink) e.currentTarget.style.background = "var(--surface-soft)";
                }}
              >
                {copiedLink ? "✓ Link copied" : "Copy link"}
              </button>
            </div>
          </div>

          {/* Response preview section */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontSize: 13, color: "var(--muted)", fontWeight: 700,
              fontFamily: "'Nunito', sans-serif", marginBottom: 10,
            }}>
              Response preview
            </div>
            <div style={{
              borderRadius: 22,
              background: "var(--surface-strong)",
              border: "1px solid var(--border)",
              padding: 22,
              minHeight: 180,
              maxHeight: 420,
              overflowY: "auto",
              lineHeight: 1.8,
              color: "var(--text)",
              fontSize: 15,
            }}>
              {error ? (
                <div style={{ color: "#f87171", padding: "20px 0", textAlign: "center" }}>
                  ⚠ {error}
                </div>
              ) : visibleMessage ? (
                <div
                  className="msg-content"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(visibleMessage) }}
                />
              ) : (
                <div style={{ color: "var(--muted)", padding: "20px 0", textAlign: "center" }}>
                  Loading…
                </div>
              )}
            </div>
          </div>

          {/* Bottom action row */}
          {visibleMessage && !error && (
            <div style={{
              display: "flex", flexWrap: "wrap",
              gap: 10, alignItems: "center",
            }}>
              <button
                onClick={handleCopyText}
                style={{
                  borderRadius: 14, padding: "13px 20px", cursor: "pointer",
                  background: copiedText
                    ? "linear-gradient(135deg, rgba(138,161,118,1), rgba(103,123,92,1))"
                    : "var(--surface-soft)",
                  border: "1px solid var(--border)",
                  color: copiedText ? "#fff" : "var(--text)",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700, fontSize: 14,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!copiedText) e.currentTarget.style.background = "rgba(138,161,118,0.16)";
                }}
                onMouseLeave={(e) => {
                  if (!copiedText) e.currentTarget.style.background = "var(--surface-soft)";
                }}
              >
                {copiedText ? "✓ Copied" : "Copy text"}
              </button>
              <span style={{
                color: "var(--muted)", fontSize: 13,
                fontFamily: "'Nunito', sans-serif",
              }}>
                Share this response with other farmers.
              </span>
            </div>
          )}

          {/* Footer */}
          <div style={{
            marginTop: 28,
            display: "flex", justifyContent: "space-between",
            flexWrap: "wrap", gap: 12, alignItems: "center",
          }}>
            <div style={{
              color: "var(--muted)", fontSize: 13,
              fontFamily: "'Nunito', sans-serif",
            }}>
              Sign in or create a free account to ask your own poultry questions.
            </div>
            <button
              onClick={handleOpenApp}
              style={{
                padding: "14px 24px", borderRadius: 16,
                background: "linear-gradient(135deg, rgba(138,161,118,1), rgba(103,123,92,1))",
                border: "none", color: "#fff",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700, fontSize: 14,
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              Continue to App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}