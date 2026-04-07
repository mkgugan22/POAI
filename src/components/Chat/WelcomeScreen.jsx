import React from "react";
import SuggestionChips from "../UI/SuggestionChips";
import { FEATURE_CARDS } from "../../constants";

export default function WelcomeScreen({ onSelect }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        padding: "20px",
        animation: "fadeSlideUp 0.5s ease forwards",
      }}
    >
      {/* Hero */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 74,
            marginBottom: 14,
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))",
            animation: "featherFloat 4s ease-in-out infinite",
          }}
        >
          🐓
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 38,
            fontWeight: 800,
            color: "var(--accent-strong)",
            marginBottom: 10,
            lineHeight: 1.15,
          }}
        >
          Poultry Expert AI
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontFamily: "'Nunito', sans-serif",
            fontSize: 16,
            maxWidth: 460,
            lineHeight: 1.65,
            margin: "0 auto",
          }}
        >
          Your AI-powered guide for poultry farming, disease diagnosis, medicine
          dosage, feed management, and more.
        </p>
      </div>

      {/* Feature grid */}
      <div
        className="welcome-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          maxWidth: 560,
          width: "100%",
        }}
      >
        {FEATURE_CARDS.map((card) => (
          <FeatureCard key={card.title} card={card} />
        ))}
      </div>

      {/* Quick-start chips */}
      <div style={{ width: "100%", maxWidth: 680 }}>
        <div
          style={{
            fontSize: 10,
            color: "var(--muted)",
            letterSpacing: 2,
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          QUICK START — TAP TO ASK
        </div>
        <SuggestionChips onSelect={onSelect} />
      </div>
    </div>
  );
}

function FeatureCard({ card }) {
  return (
    <div
      className="feature-card"
      style={{
        background: "var(--surface-soft)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "16px 12px",
        textAlign: "center",
        transition: "all 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--accent-soft)";
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.borderColor = "var(--border-strong)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--surface-soft)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ fontSize: 26, marginBottom: 7 }}>{card.icon}</div>
      <div
        style={{
          color: "var(--accent)",
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 800,
          fontSize: 12,
          marginBottom: 3,
        }}
      >
        {card.title}
      </div>
      <div
        style={{
          color: "var(--muted)",
          fontFamily: "'Nunito', sans-serif",
          fontSize: 11,
        }}
      >
        {card.desc}
      </div>
    </div>
  );
}
