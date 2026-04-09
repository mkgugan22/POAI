import React, { useState } from "react";
import { buildShareUrl, copyToClipboard } from "../../utils/helpers";
import { CloseIcon, LinkIcon, CopyIcon, CheckIcon } from "../UI/Icons";

export default function ShareModal({ message, onClose, showToast }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = buildShareUrl(message.content);

  const handleCopyLink = async () => {
    await copyToClipboard(shareUrl);
    setCopied(true);
    showToast("Share link copied!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyText = async () => {
    await copyToClipboard(message.content);
    showToast("Full response copied!");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        animation: "fadeSlideUp 0.22s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 22,
          padding: "32px 30px",
          maxWidth: 500,
          width: "92%",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.03)",
          animation: "fadeSlideUp 0.28s cubic-bezier(0.34,1.36,0.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--accent-strong)",
                marginBottom: 4,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <LinkIcon size={20} color="var(--accent)" /> Share Response
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "'Nunito', sans-serif",
                fontSize: 13,
              }}
            >
              Share this expert answer with other farmers
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: 7,
              cursor: "pointer",
              color: "rgba(255,255,255,0.45)",
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
            }
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Preview snippet */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 16,
            fontSize: 13,
            color: "var(--muted)",
            fontFamily: "'Nunito', sans-serif",
            lineHeight: 1.55,
            maxHeight: 80,
            overflow: "hidden",
          }}
        >
          {message.content.slice(0, 140)}
          {message.content.length > 140 ? "…" : ""}
        </div>

        {/* Share URL */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: 12,
            padding: "12px 14px",
            border: "1px solid var(--border)",
            marginBottom: 18,
            wordBreak: "break-all",
            color: "var(--accent)",
            fontFamily: "monospace",
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          {shareUrl}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleCopyLink}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 12,
              cursor: "pointer",
              background: copied
                ? "linear-gradient(135deg, rgba(138,161,118,1), rgba(107,129,98,1))"
                : "rgba(138,161,118,0.18)",
              border: "1px solid rgba(138,161,118,0.4)",
              color: "#fff",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: 14,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
            }}
            onMouseEnter={(e) => {
              if (!copied)
                e.currentTarget.style.background = "rgba(138,161,118,0.26)";
            }}
            onMouseLeave={(e) => {
              if (!copied)
                e.currentTarget.style.background = "rgba(138,161,118,0.18)";
            }}
          >
            {copied ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
            {copied ? "Link Copied!" : "Copy Link"}
          </button>

          <button
            onClick={handleCopyText}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 12,
              cursor: "pointer",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--muted)",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
            }
          >
            <CopyIcon size={15} /> Copy Text
          </button>
        </div>

        {/* Social share row */}
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.2)",
              letterSpacing: 1.5,
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            {/* SHARE VIA */}
          </div>
          {/* <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {[
              { icon: "💬", label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(shareUrl)}` },
              { icon: "✉️", label: "Email",    href: `mailto:?subject=Poultry Expert Advice&body=${encodeURIComponent(shareUrl)}` },
              { icon: "🐦", label: "Twitter",  href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out this poultry farming advice!` },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "8px 16px",
                  color: "var(--muted)",
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.18s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(138,161,118,0.12)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "var(--muted)";
                }}
              >
                {s.icon} {s.label}
              </a>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}
