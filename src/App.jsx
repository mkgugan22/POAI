import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatArea from "./components/Chat/ChatArea";
import ShareModal from "./components/Modals/ShareModal";
import Toast from "./components/UI/Toast";
import AmbientBackground from "./components/UI/AmbientBackground";
import { addConversation, setActiveConversation } from "./store/actions/chatActions";

export default function App() {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((s) => s.chat);
  const [shareMsg, setShareMsg] = useState(null);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("light", theme === "light");
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const showToast = (msg) => setToast(msg);

  const handleNewChat = () => {
    const id = `conv_${Date.now()}`;
    dispatch(addConversation({ id, title: "New Chat", createdAt: Date.now() }));
  };

  const handleSelectConv = (id) => {
    dispatch(setActiveConversation(id));
  };

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative", zIndex: 1, overflow: "hidden" }}>
      <AmbientBackground />

      <Sidebar
        onNewChat={handleNewChat}
        onSelectConv={handleSelectConv}
        theme={theme}
        onSetTheme={setTheme}
      />

      <ChatArea
        showToast={showToast}
        onShareMsg={setShareMsg}
      />

      {shareMsg && (
        <ShareModal message={shareMsg} onClose={() => setShareMsg(null)} showToast={showToast} />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
