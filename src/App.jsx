import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Sidebar           from "./components/Sidebar/Sidebar";
import ChatArea          from "./components/Chat/ChatArea";
import ShareModal        from "./components/Modals/ShareModal";
import Toast             from "./components/UI/Toast";
import AmbientBackground from "./components/UI/AmbientBackground";
import AuthPage          from "./components/AuthPage";
import SharedView        from "./components/SharedView";
import {
  addConversation,
  setActiveConversation,
  resetForUser,
} from "./store/actions/chatActions";
import { useAuth }  from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

/**
 * Returns true when the current URL is a share link.
 * Supports:
 *   /share?msg=BASE64     ← new self-contained format
 *   /?shared=true&sid=XX  ← old dpaste format (backward compat)
 */
function isSharedLink() {
  const path   = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  return (
    path === "/share" ||
    params.has("msg") ||
    params.get("shared") === "true"
  );
}

export default function App() {
  const dispatch = useDispatch();
  const { user }                    = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [shareMsg, setShareMsg]     = useState(null);
  const [toast, setToast]           = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ── Reset Redux chat store whenever the logged-in user changes ────────
  const prevUserIdRef = useRef(null);
  useEffect(() => {
    const uid = user?.id ?? "guest";
    if (uid !== prevUserIdRef.current) {
      prevUserIdRef.current = uid;
      dispatch(resetForUser(uid));
    }
  }, [user, dispatch]);

  const showToast = (msg) => setToast(msg);

  const handleNewChat = () => {
    const id = `conv_${Date.now()}`;
    dispatch(addConversation({ id, title: "New Chat", createdAt: Date.now() }));
    setMobileSidebarOpen(false);
  };

  const handleSelectConv = (id) => {
    dispatch(setActiveConversation(id));
    setMobileSidebarOpen(false);
  };

  // ── Shared-link gate: show public view regardless of auth state ────────
  if (isSharedLink()) return <SharedView />;

  // ── Auth gate: show login/signup if not logged in ──────────────────────
  if (!user) return <AuthPage />;

  return (
    <div style={{
      display: "flex", height: "100vh",
      position: "relative", zIndex: 1, overflow: "hidden",
    }}>
      <AmbientBackground />

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 45,
            background: "rgba(0,0,0,.55)", backdropFilter: "blur(3px)",
          }}
        />
      )}

      {/* Sidebar — NO logout prop, logout is only in ChatHeader */}
      <Sidebar
        onNewChat={handleNewChat}
        onSelectConv={handleSelectConv}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        mobileSidebarOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <ChatArea
        showToast={showToast}
        onShareMsg={setShareMsg}
        onMobileMenuToggle={() => setMobileSidebarOpen(o => !o)}
      />

      {shareMsg && (
        <ShareModal
          message={shareMsg}
          onClose={() => setShareMsg(null)}
          showToast={showToast}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}