import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { SendIcon, MicIcon } from "../UI/Icons";
import SuggestionChips from "../UI/SuggestionChips";

export default function ChatInput({ input, setInput, onSend, hasMessages }) {
  const { isLoading } = useSelector((s) => s.chat);
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(input);
    }
  };

  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px";
  };

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <div
      style={{
        padding: "14px 20px 20px",
        background: "var(--surface)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)",
        flexShrink: 0,
      }}
    >
      {/* Suggestion chips shown above input when chat has messages */}
      {hasMessages && (
        <div style={{ maxWidth: 800, margin: "0 auto 12px" }}>
          <SuggestionChips onSelect={(text) => onSend(text)} />
        </div>
      )}

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Input box */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
            background: "var(--surface-strong)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "12px 14px",
            boxShadow: "0 4px 28px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.03)",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = "rgba(138,161,118,0.28)";
            e.currentTarget.style.boxShadow =
              "0 4px 28px rgba(0,0,0,0.18), 0 0 22px rgba(138,161,118,0.12)";
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow =
              "0 4px 28px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.03)";
          }}
        >
          <span style={{ fontSize: 20, flexShrink: 0, marginBottom: 3 }}>🌾</span>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Ask about poultry diseases, medicine dosage, feed management…"
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "var(--text)",
              fontFamily: "'Nunito', sans-serif",
              fontSize: 15,
              lineHeight: 1.6,
              maxHeight: 130,
              overflowY: "auto",
              caretColor: "var(--accent)",
            }}
          />

          <div style={{ display: "flex", gap: 7, alignItems: "flex-end", flexShrink: 0 }}>
            {/* Mic button */}
            <button
              title="Voice input (coming soon)"
              style={{
                background: "var(--surface-soft)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "8px",
                cursor: "pointer",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(138,161,118,0.16)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--surface-soft)")
              }
            >
              <MicIcon size={17} />
            </button>

            {/* Send button */}
            <button
              onClick={() => onSend(input)}
              disabled={!canSend}
              title="Send message"
              style={{
                background: canSend
                  ? "linear-gradient(135deg, rgba(138,161,118,1), rgba(103,123,92,1))"
                  : "rgba(138,161,118,0.14)",
                border: "none",
                borderRadius: 12,
                padding: "10px 18px",
                cursor: canSend ? "pointer" : "not-allowed",
                color: canSend ? "#fff" : "rgba(255,255,255,0.28)",
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800,
                fontSize: 14,
                transition: "all 0.2s",
                boxShadow: canSend ? "0 4px 16px rgba(0,0,0,0.18)" : "none",
              }}
              onMouseEnter={(e) => {
                if (canSend) e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              {isLoading ? (
                <div
                  style={{
                    width: 18,
                    height: 18,
                    border: "2.5px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spinLoader 0.7s linear infinite",
                  }}
                />
              ) : (
                <SendIcon size={17} />
              )}
              {isLoading ? "Thinking…" : "Ask"}
            </button>
          </div>
        </div>

        {/* Keyboard hint */}
        <div
          style={{
            textAlign: "center",
            marginTop: 7,
            fontSize: 10,
            color: "var(--muted)",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          Press{" "}
          <kbd
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 4,
              padding: "1px 5px",
              fontFamily: "monospace",
              fontSize: 10,
            }}
          >
            Enter
          </kbd>{" "}
          to send ·{" "}
          <kbd
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 4,
              padding: "1px 5px",
              fontFamily: "monospace",
              fontSize: 10,
            }}
          >
            Shift+Enter
          </kbd>{" "}
          for new line
        </div>
      </div>
    </div>
  );
}
