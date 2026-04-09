import React, { useEffect, useState } from "react";
import { copyToClipboard, readShareMessage } from "../utils/helpers";

export default function SharedView({ message, sid }) {
  const [shareUrl, setShareUrl] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [cacheMessage, setCacheMessage] = useState(null);
  const hasMessage = Boolean(message || cacheMessage);
  const shareActive = Boolean(shareUrl);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (!message && sid) {
      const saved = readShareMessage(sid);
      if (saved) {
        setCacheMessage(saved);
      }
    }
  }, [message, sid]);

  const visibleMessage = message || cacheMessage;

  const truncateMiddle = (text, maxLength = 76) => {
    if (!text || text.length <= maxLength) return text;
    const slice = Math.floor((maxLength - 3) / 2);
    return `${text.slice(0, slice)}...${text.slice(text.length - slice)}`;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = async () => {
    if (!shareUrl) return;
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
        maxWidth: 780,
        borderRadius: 30,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 28px 80px rgba(0,0,0,0.32)",
        overflow: "hidden",
      }}>
        <div style={{
          background: "linear-gradient(180deg, rgba(138,161,118,0.14), transparent)",
          padding: "28px 26px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 0.3 }}>
              Poultry Expert AI
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
              Shared response
            </div>
          </div>

          <a
            href={sid ? `/?sid=${sid}` : "/"}
            style={{
              padding: "12px 20px",
              borderRadius: 14,
              background: "var(--surface-strong)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Open App
          </a>
        </div>

        <div style={{ padding: "24px 26px 28px" }}>
          <div style={{
            marginBottom: 18,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            <div style={{ fontSize: 14, color: "var(--muted)", fontWeight: 700 }}>
              Share URL
            </div>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "stretch",
            }}>
              <div style={{
                flex: 1,
                minWidth: 0,
                background: "var(--surface-soft)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "14px 16px",
                color: "var(--accent)",
                fontFamily: "monospace",
                fontSize: 13,
                lineHeight: 1.5,
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}>
                {shareActive ? (
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={shareUrl}
                    style={{
                      color: "var(--accent)",
                      textDecoration: "none",
                    }}
                  >
                    {truncateMiddle(shareUrl)}
                  </a>
                ) : (
                  "Loading URL..."
                )}
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                disabled={!shareActive}
                style={{
                  flexShrink: 0,
                  borderRadius: 14,
                  background: copiedLink ? "linear-gradient(135deg, rgba(138,161,118,1), rgba(103,123,92,1))" : "var(--surface-soft)",
                  border: "1px solid var(--border)",
                  color: copiedLink ? "#fff" : "var(--text)",
                  fontWeight: 700,
                  padding: "14px 18px",
                  cursor: shareActive ? "pointer" : "not-allowed",
                }}
              >
                {copiedLink ? "Link copied" : "Copy link"}
              </button>
            </div>
          </div>

          <div style={{
            marginBottom: 22,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            <div style={{ fontSize: 14, color: "var(--muted)", fontWeight: 700 }}>
              Response preview
            </div>
            <div style={{
              borderRadius: 22,
              background: "var(--surface-strong)",
              border: "1px solid var(--border)",
              padding: 22,
              minHeight: 180,
              maxHeight: 380,
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              lineHeight: 1.8,
              color: "var(--text)",
            }}>
              {hasMessage ? (
                visibleMessage
              ) : sid ? (
                "This shared link is valid. Open the app to view the full response."
              ) : (
                "This shared response is not available. The link may be missing content or has expired."
              )}
            </div>
          </div>

          {hasMessage && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <button
                type="button"
                onClick={handleCopyText}
                style={{
                  borderRadius: 14,
                  background: copiedText ? "linear-gradient(135deg, rgba(138,161,118,1), rgba(103,123,92,1))" : "var(--surface-soft)",
                  border: "1px solid var(--border)",
                  color: copiedText ? "#fff" : "var(--text)",
                  fontWeight: 700,
                  padding: "14px 18px",
                  cursor: "pointer",
                }}
              >
                {copiedText ? "Copied" : "Copy text"}
              </button>
              <div style={{ color: "var(--muted)", fontSize: 13, alignSelf: "center" }}>
                Share this response with other farmers.
              </div>
            </div>
          )}

          <div style={{
            marginTop: 26,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
          }}>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              Sign in or create a free account to ask your own poultry questions.
            </div>
            <a
              href={sid ? `/?sid=${sid}` : "/"}
              style={{
                padding: "14px 22px",
                borderRadius: 16,
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
    </div>
  );
}
