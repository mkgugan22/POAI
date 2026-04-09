import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Sidebar           from "./components/Sidebar/Sidebar";
import ChatArea          from "./components/Chat/ChatArea";
import ShareModal        from "./components/Modals/ShareModal";
import Toast             from "./components/UI/Toast";
import AmbientBackground from "./components/UI/AmbientBackground";
import AuthPage          from "./components/AuthPage";
import {
  addConversation,
  setActiveConversation,
  resetForUser,
} from "./store/actions/chatActions";
import { useAuth }  from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

export default function App() {
  const dispatch = useDispatch();
  const { user, logout }            = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [shareMsg, setShareMsg]     = useState(null);
  const [toast, setToast]           = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  if (!user) return <AuthPage />;

  return (
    <div style={{
      display: "flex", height: "100vh",
      position: "relative", zIndex: 1, overflow: "hidden",
    }}>
      <AmbientBackground />

      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 45,
            background: "rgba(0,0,0,.55)", backdropFilter: "blur(3px)",
          }}
        />
      )}

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