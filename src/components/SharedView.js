// ═══════════════════════════════════════
// POAI – SharedView
// Public read-only page. Decodes base64-encoded content from URL param.
// Overrides global overflow:hidden so the page scrolls.
// ═══════════════════════════════════════
import React, { useEffect, useState } from "react";
import { renderMarkdown } from "../utils/markdown";

function clearSessionAuth() {
  try { sessionStorage.removeItem("poai_session_user"); } catch {}
}

/**
 * Decode content from URL.
 * Supports:
 *   ?msg=BASE64   — new self-contained format (no external fetch needed)
 *   ?sid=DPASTE   — old dpaste format (fetches from dpaste.com)
 */
function getContentFromUrl() {
  const params = new URLSearchParams(window.location.search);

  // New format: base64 encoded content in ?msg=
  const msg = params.get("msg");
  if (msg) {
    try {
      const decoded = decodeURIComponent(escape(atob(msg)));
      return { type: "inline", content: decoded };
    } catch {
      return { type: "error", error: "Could not decode this share link. It may be corrupted." };
    }
  }

  // Old format: dpaste sid
  const sid = params.get("sid");
  if (sid) {
    return { type: "dpaste", sid };
  }

  return { type: "error", error: "No content found in this share link." };
}

export default function SharedView() {
  const [content,   setContent]   = useState("");
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [copied,    setCopied]    = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  // ── Override global overflow:hidden so this page can scroll ──
  useEffect(() => {
    const els = [document.documentElement, document.body];
    const originals = els.map(el => el.style.overflow);
    els.forEach(el => { el.style.overflow = "auto"; });
    const root = document.getElementById("root");
    let rootOrig = "";
    if (root) { rootOrig = root.style.overflow; root.style.overflow = "auto"; }
    return () => {
      els.forEach((el, i) => { el.style.overflow = originals[i]; });
      if (root) root.style.overflow = rootOrig;
    };
  }, []);

  // ── Load content from URL ──
  useEffect(() => {
    clearSessionAuth();
    const parsed = getContentFromUrl();

    if (parsed.type === "inline") {
      // New format: content is already decoded, no fetch needed
      setContent(parsed.content);
      setLoading(false);
    } else if (parsed.type === "dpaste") {
      // Old format: fetch from dpaste
      fetch(`https://dpaste.com/${parsed.sid}.txt`)
        .then((res) => {
          if (!res.ok) throw new Error("Share link not found or has expired.");
          return res.text();
        })
        .then((text) => { setContent(text.trim()); setLoading(false); })
        .catch((err)  => { setError(err.message);  setLoading(false); });
    } else {
      setError(parsed.error);
      setLoading(false);
    }
  }, []);

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2200);
    });
  };

  const handleOpenApp = () => {
    window.location.href = window.location.origin + "/";
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      overflowY: "visible",
      background:
        "radial-gradient(ellipse at 18% 18%, rgba(30,70,10,0.45) 0%, transparent 58%)," +
        "radial-gradient(ellipse at 82% 82%, rgba(60,100,20,0.28) 0%, transparent 58%)," +
        "#060e04",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 20px 80px",
      boxSizing: "border-box",
      fontFamily: "'Nunito', sans-serif",
      color: "#e7e7d1",
      position: "relative",
    }}>

      {/* Botanicals */}
      {[
        { icon:"🌾", size:30, top:"8%",  right:"4%",  opacity:0.07, dur:4, delay:0   },
        { icon:"🍃", size:22, top:"55%", right:"2.5%",opacity:0.05, dur:6, delay:1.5 },
        { icon:"🌿", size:18, top:"30%", right:"8%",  opacity:0.04, dur:5, delay:0.8 },
      ].map((f,i) => (
        <div key={i} style={{
          position:"fixed", fontSize:f.size, opacity:f.opacity, zIndex:0,
          top:f.top, right:f.right, pointerEvents:"none", userSelect:"none",
          animation:`featherFloat ${f.dur}s ease-in-out infinite`,
          animationDelay:`${f.delay}s`,
        }}>{f.icon}</div>
      ))}

      <style>{`
        @keyframes featherFloat {
          0%,100%{ transform:translateY(0) rotate(-5deg); }
          50%    { transform:translateY(-14px) rotate(5deg); }
        }
        @keyframes fadeUp {
          from{ opacity:0; transform:translateY(22px); }
          to  { opacity:1; transform:translateY(0); }
        }
        @keyframes spinLoader { to { transform:rotate(360deg); } }
        .sv-btn-primary:hover { transform:translateY(-2px) !important; box-shadow:0 8px 28px rgba(0,0,0,.35) !important; }
        .sv-btn-ghost:hover   { background:rgba(138,161,118,.2) !important; color:#b0c49c !important; }
        .sv-btn-muted:hover   { background:rgba(255,255,255,.1) !important; }
        .sv-content .md-p   { margin-bottom:8px; line-height:1.75; }
        .sv-content .md-h1  { color:#b0c49c; font-size:18px; margin:14px 0 6px; font-family:'Playfair Display',serif; font-weight:700; }
        .sv-content .md-h2  { color:#8aa176; font-size:16px; margin:12px 0 5px; font-family:'Playfair Display',serif; font-weight:700; }
        .sv-content .md-h3  { color:#8aa176; font-size:14px; margin:10px 0 4px; font-family:'Nunito',sans-serif; font-weight:800; text-transform:uppercase; letter-spacing:.5px; }
        .sv-content .md-ul,
        .sv-content .md-ol  { padding-left:20px; margin:6px 0 10px; }
        .sv-content .md-li  { list-style:disc;    margin-bottom:5px; }
        .sv-content .md-oli { list-style:decimal; margin-bottom:5px; }
        .sv-content .md-blockquote {
          border-left:3px solid #8aa176; padding:6px 14px;
          color:rgba(231,231,212,.8); font-style:italic; margin:10px 0;
          background:rgba(255,255,255,.04); border-radius:0 8px 8px 0;
        }
        .sv-content .md-inline-code {
          background:rgba(255,255,255,.08); padding:2px 7px;
          border-radius:5px; font-size:13px; color:#b0c49c;
          font-family:'Courier New',monospace;
        }
        .sv-content .md-hr { border:none; border-top:1px solid rgba(138,161,118,.18); margin:14px 0; }
        .sv-content strong  { color:#e7e7d1; font-weight:700; }
        .sv-content em      { color:rgba(231,231,212,.7); font-style:italic; }
        @media (max-width: 600px) {
          .sv-header { flex-direction: column !important; align-items: flex-start !important; }
          .sv-header-btns { width: 100%; justify-content: flex-end; }
        }
      `}</style>

      {/* ── Header ── */}
      <div className="sv-header" style={{
        width:"100%", maxWidth:760,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:28, animation:"fadeUp .4s ease forwards",
        position:"relative", zIndex:2,
        flexWrap:"wrap", gap:12,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:36, filter:"drop-shadow(0 2px 8px rgba(0,0,0,.2))" }}>🐓</div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18,
              fontWeight:800, color:"#b0c49c", lineHeight:1.1 }}>
              Poultry Expert AI
            </div>
            <div style={{ fontSize:10, color:"rgba(231,231,212,.4)",
              letterSpacing:2, fontWeight:700, textTransform:"uppercase",
              fontFamily:"'Nunito',sans-serif" }}>
              Shared response
            </div>
          </div>
        </div>

        <div className="sv-header-btns" style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button className="sv-btn-ghost" onClick={handleOpenApp} style={{
            background:"rgba(255,255,255,.06)", border:"1px solid rgba(138,161,118,.25)",
            borderRadius:10, padding:"9px 18px", color:"#b0c49c",
            fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:13,
            cursor:"pointer", transition:"all .2s", letterSpacing:.5,
          }}>
            Open App →
          </button>
        </div>
      </div>

      {/* ── Card ── */}
      <div style={{
        width:"100%", maxWidth:760,
        background:"rgba(24,34,23,0.96)",
        border:"1px solid rgba(138,161,118,.18)", borderRadius:22,
        boxShadow:"0 24px 64px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.02)",
        overflow:"hidden",
        animation:"fadeUp .5s .1s ease both",
        position:"relative", zIndex:2,
      }}>

        {/* Card header */}
        <div style={{
          padding:"16px 24px", borderBottom:"1px solid rgba(138,161,118,.14)",
          background:"rgba(255,255,255,.03)", display:"flex", alignItems:"center", gap:12,
        }}>
          <div style={{
            width:36, height:36, borderRadius:"50%", flexShrink:0,
            background:"linear-gradient(135deg,rgba(138,161,118,1),rgba(107,129,98,1))",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, boxShadow:"0 4px 14px rgba(0,0,0,.2)",
          }}>🐔</div>
          <div>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:11,
              fontWeight:800, color:"#8aa176", letterSpacing:1.5, textTransform:"uppercase" }}>
              Poultry Expert
            </div>
            <div style={{ fontSize:11, color:"rgba(231,231,212,.38)",
              fontFamily:"'Nunito',sans-serif" }}>
              Shared farming advice
            </div>
          </div>
          <div style={{
            marginLeft:"auto", background:"rgba(138,161,118,.1)",
            border:"1px solid rgba(138,161,118,.25)", borderRadius:20,
            padding:"4px 12px", display:"flex", alignItems:"center", gap:6,
          }}>
            <div style={{ width:6, height:6, borderRadius:"50%",
              background:"#8aa176", flexShrink:0 }} />
            <span style={{ fontSize:11, color:"#b0c49c",
              fontFamily:"'Nunito',sans-serif", fontWeight:700 }}>
              AI Verified
            </span>
          </div>
        </div>

        {/* Share URL box — shown after content loads */}
        {!loading && !error && content && (
          <div style={{ padding:"14px 24px 0" }}>
            <div style={{
              background:"rgba(255,255,255,.04)",
              border:"1px solid rgba(138,161,118,.2)",
              borderRadius:10, padding:"10px 16px",
              display:"flex", alignItems:"center", gap:10, flexWrap:"wrap",
            }}>
              <span style={{
                fontSize:11, color:"rgba(231,231,212,.4)",
                fontFamily:"'Nunito',sans-serif", fontWeight:700,
                textTransform:"uppercase", letterSpacing:1, flexShrink:0,
              }}>Share URL</span>
              <span style={{
                flex:1, fontSize:12, color:"#8aa176",
                fontFamily:"monospace", wordBreak:"break-all", minWidth:0,
              }}>
                {window.location.href}
              </span>
              <button
                onClick={handleCopyLink}
                style={{
                  background: urlCopied
                    ? "linear-gradient(135deg,rgba(138,161,118,1),rgba(107,129,98,1))"
                    : "rgba(138,161,118,.18)",
                  border:"1px solid rgba(138,161,118,.4)",
                  borderRadius:8, padding:"6px 14px",
                  color:"#fff", cursor:"pointer",
                  fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:12,
                  transition:"all .2s", flexShrink:0, whiteSpace:"nowrap",
                }}
              >
                {urlCopied ? "✓ Copied!" : "Copy link"}
              </button>
            </div>
          </div>
        )}

        {/* Body */}
        <div style={{ padding:"26px 30px" }}>
          {loading && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
              gap:14, padding:"40px 0", color:"rgba(231,231,212,.45)",
              fontFamily:"'Nunito',sans-serif", fontSize:14 }}>
              <span style={{
                display:"inline-block", width:22, height:22,
                border:"2.5px solid rgba(138,161,118,.3)", borderTopColor:"#8aa176",
                borderRadius:"50%", animation:"spinLoader .8s linear infinite",
              }} />
              Loading shared content…
            </div>
          )}

          {!loading && error && (
            <div style={{ textAlign:"center", padding:"40px 0",
              color:"#f87171", fontFamily:"'Nunito',sans-serif", fontSize:14 }}>
              ⚠ {error}
            </div>
          )}

          {!loading && !error && content && (
            <div
              className="sv-content msg-content"
              style={{ fontSize:15, lineHeight:1.85, color:"#e7e7d1",
                fontFamily:"'Nunito',sans-serif" }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          )}
        </div>

        {/* Action bar */}
        {!loading && !error && content && (
          <div style={{
            padding:"14px 24px",
            borderTop:"1px solid rgba(138,161,118,.1)",
            background:"rgba(255,255,255,.02)",
            display:"flex", alignItems:"center", gap:10, flexWrap:"wrap",
          }}>
            <button className="sv-btn-primary" onClick={handleCopyContent} style={{
              padding:"9px 20px", borderRadius:10, cursor:"pointer",
              background: copied
                ? "linear-gradient(135deg,rgba(138,161,118,1),rgba(107,129,98,1))"
                : "rgba(138,161,118,.2)",
              border:"1px solid rgba(138,161,118,.4)", color:"#fff",
              fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:13,
              transition:"all .2s",
              boxShadow: copied ? "0 4px 16px rgba(0,0,0,.2)" : "none",
              display:"flex", alignItems:"center", gap:7,
            }}>
              {copied ? "✓ Copied!" : "📋 Copy text"}
            </button>

            <button className="sv-btn-muted" onClick={handleOpenApp} style={{
              padding:"9px 20px", borderRadius:10, cursor:"pointer",
              background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)",
              color:"rgba(231,231,212,.65)", fontFamily:"'Nunito',sans-serif",
              fontWeight:700, fontSize:13, transition:"all .2s",
              display:"flex", alignItems:"center", gap:7,
            }}>
              🐓 Ask Your Own Question
            </button>

            <span style={{ marginLeft:"auto", fontSize:11,
              color:"rgba(231,231,212,.22)", fontFamily:"'Nunito',sans-serif" }}>
              Powered by G7 AI · Poultry Expert
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop:28, textAlign:"center", fontSize:12,
        color:"rgba(231,231,212,.22)", fontFamily:"'Nunito',sans-serif",
        animation:"fadeUp .5s .2s ease both",
        maxWidth:480, lineHeight:1.7,
        position:"relative", zIndex:2,
      }}>
        This is a shared response from Poultry Expert AI.<br />
        <span onClick={handleOpenApp}
          style={{ color:"#8aa176", cursor:"pointer", fontWeight:700 }}>
          Sign in or create a free account
        </span>{" "}
        to ask your own poultry questions.
      </div>
    </div>
  );
}