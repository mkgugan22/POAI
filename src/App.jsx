import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  setSidebarOpen,
} from "./store/actions/chatActions";
import { decodeShareMsg } from "./utils/helpers";
import { useAuth }  from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

/**
 * Detect share link and decode message once on app load.
 * Runs synchronously before first render — safe as a module-level call
 * because window is available in the browser at this point.
 */
function getSharedInfo() {
  const path     = window.location.pathname;
  const params   = new URLSearchParams(window.location.search);
  const msgParam = params.get("msg");
  const isShare  = path === "/share" || params.get("shared") === "true" || Boolean(msgParam);
  if (!isShare) return { isShared: false, message: null };
  const message = msgParam ? decodeShareMsg(msgParam) : null;
  return { isShared: true, message };
}

// Compute once at module load time (stable across re-renders)
const sharedInfo = getSharedInfo();

export default function App() {
  const dispatch = useDispatch();
  const { user, logout }            = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const sidebarOpen                 = useSelector((s) => s.chat.sidebarOpen);
  const [shareMsg, setShareMsg]     = useState(null);
  const [toast, setToast]           = useState(null);

  const prevUserIdRef = useRef(null);
  useEffect(() => {
    const uid = user?.id ?? "guest";
    if (uid !== prevUserIdRef.current) {
      prevUserIdRef.current = uid;
      dispatch(resetForUser(uid));
    }
  }, [user, dispatch]);

  // Apply theme body classes
  useEffect(() => {
    document.body.classList.toggle("light", !isDarkMode);
    document.body.classList.toggle("dark",  isDarkMode);
  }, [isDarkMode]);

  // Let the share page scroll (global.css sets overflow:hidden by default)
  useEffect(() => {
    if (!sharedInfo.isShared) return;
    document.body.classList.add("share-page");
    const root = document.getElementById("root");
    if (root) root.classList.add("share-page");
    return () => {
      document.body.classList.remove("share-page");
      if (root) root.classList.remove("share-page");
    };
  }, []);

  const showToast = (msg) => setToast(msg);

  const handleNewChat = () => {
    const id = `conv_${Date.now()}`;
    dispatch(addConversation({ id, title: "New Chat", createdAt: Date.now() }));
    dispatch(setSidebarOpen(false));
  };

  const handleSelectConv = (id) => {
    dispatch(setActiveConversation(id));
    dispatch(setSidebarOpen(false));
  };

  // ── Shared-link gate — shown to anyone, no login required ─────────────
  if (sharedInfo.isShared) {
    return (
      <div style={{
        minHeight: "100vh", width: "100%",
        background: "var(--bg)", overflowY: "auto",
      }}>
        <SharedView message={sharedInfo.message} />
      </div>
    );
  }

  // ── Auth gate ──────────────────────────────────────────────────────────
  if (!user) return <AuthPage />;

  return (
    <div style={{
      display: "flex", height: "100vh",
      position: "relative", zIndex: 1, overflow: "hidden",
    }}>
      <AmbientBackground />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          onClick={() => dispatch(setSidebarOpen(false))}
          style={{
            position: "fixed", inset: 0, zIndex: 8,
            background: "rgba(0,0,0,.45)",
          }}
        />
      )}

      <Sidebar
        onNewChat={handleNewChat}
        onSelectConv={handleSelectConv}
        theme={isDarkMode ? "dark" : "light"}
        onSetTheme={toggleTheme}
      />

      <ChatArea
        showToast={showToast}
        onShareMsg={setShareMsg}
        onMobileMenuToggle={() => dispatch(setSidebarOpen(!sidebarOpen))}
        onLogout={logout}
        user={user}
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