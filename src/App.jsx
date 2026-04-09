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
import { useAuth }  from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

export default function App() {
  const dispatch = useDispatch();
  const { user, logout }            = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const sidebarOpen                 = useSelector((s) => s.chat.sidebarOpen);
  const [shareMsg, setShareMsg]     = useState(null);
  const [toast, setToast]           = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [sharedMessage, setSharedMessage] = useState(null);
  const [isSharedRoute, setIsSharedRoute] = useState(false);

  const prevUserIdRef = useRef(null);
  useEffect(() => {
    const uid = user?.id ?? "guest";
    if (uid !== prevUserIdRef.current) {
      prevUserIdRef.current = uid;
      dispatch(resetForUser(uid));
    }
  }, [user, dispatch]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const handleResize = () => setIsMobileView(mq.matches);
    handleResize();
    mq.addEventListener("change", handleResize);
    return () => mq.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const rawMessage = params.get("msg");
    const sharedFlag = params.get("shared") === "true";

    setSharedMessage(rawMessage ? decodeURIComponent(rawMessage) : null);
    setIsSharedRoute(url.pathname.startsWith("/share") || sharedFlag);
  }, []);

  // Apply theme on mount
  useEffect(() => {
    document.body.classList.toggle('light', !isDarkMode);
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

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

  if (isSharedRoute) {
    return <SharedView message={sharedMessage} />;
  }

  if (!user) return <AuthPage />;

  return (
    <div style={{
      display: "flex", height: "100vh",
      position: "relative", zIndex: 1, overflow: "hidden",
    }}>
      <AmbientBackground />

      {sidebarOpen && isMobileView && (
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
        theme={isDarkMode ? 'dark' : 'light'}
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