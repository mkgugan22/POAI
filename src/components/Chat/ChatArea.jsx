import React from "react";
import ChatHeader     from "./ChatHeader";
import MessageList    from "./MessageList";
import ChatInput      from "./ChatInput";
import WelcomeScreen  from "./WelcomeScreen";
import { useChat }    from "../../hooks/useChat";
import { useAuth }    from "../../context/AuthContext";
import { useTheme }   from "../../context/ThemeContext";

export default function ChatArea({
  showToast,
  onShareMsg,
  onMobileMenuToggle,
  onLogout,
  user: userProp,
}) {
  const { messages, isLoading, sendMessage, activeTitle } = useChat({ showToast });
  const { user: ctxUser }           = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const user = userProp || ctxUser;

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      overflow: "hidden", minWidth: 0, position: "relative",
    }}>
      <ChatHeader
        title={activeTitle}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onMobileMenuToggle={onMobileMenuToggle}
        onLogout={onLogout}
        user={user}
      />

      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
        {messages.length === 0 ? (
          <WelcomeScreen onSend={sendMessage} />
        ) : (
          <MessageList
            messages={messages}
            isLoading={isLoading}
            onShareMsg={onShareMsg}
            showToast={showToast}
          />
        )}
      </div>

      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}