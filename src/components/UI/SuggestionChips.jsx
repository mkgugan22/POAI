import React from "react";
import { SUGGESTION_CHIPS } from "../../constants";

export default function SuggestionChips({ onSelect }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center",
      }}
    >
      {SUGGESTION_CHIPS.map((chip) => (
        <button
          key={chip.text}
          onClick={() => onSelect(chip.text)}
          style={{
            background: "var(--surface-soft)",
            border: "1px solid var(--border)",
            borderRadius: 24,
            padding: "7px 16px",
            cursor: "pointer",
            color: "var(--accent-strong)",
            fontFamily: "'Nunito', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            transition: "all 0.18s",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(138,161,118,0.18)";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.borderColor = "rgba(138,161,118,0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--surface-soft)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <span>{chip.emoji}</span>
          {chip.text}
        </button>
      ))}
    </div>
  );
}
