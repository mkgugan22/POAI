import React, { useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import WelcomeScreen from "./WelcomeScreen";
import ChatInput from "./ChatInput";
import { useChat } from "../../hooks/useChat";

export default function ChatArea({ showToast, onShareMsg }) {
  const { currentMessages, sendUserMessage } = useChat();
  const [input, setInput] = useState("");

  const hasMessages = currentMessages.length > 0;

  const handleSend = (text) => {
    const value = (text || input).trim();
    if (!value) return;
    setInput("");
    sendUserMessage(value);
  };

  return (
    <main
      className="chat-area"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        zIndex: 2,
      }}
    >
      <ChatHeader />

      {hasMessages ? (
        <MessageList
          messages={currentMessages}
          onShare={onShareMsg}
          showToast={showToast}
        />
      ) : (
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <WelcomeScreen onSelect={handleSend} />
        </div>
      )}

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        hasMessages={hasMessages}
      />
    </main>
  );
}
