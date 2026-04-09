import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, extractResponseText } from "../api/mistralApi";
import {
  addMessage,
  replaceMessages,
  setLoading,
  updateConversationTitle,
  setApiConvId,
  addConversation,
  setActiveConversation,
} from "../store/actions/chatActions";
import { generateId, truncate } from "../utils/helpers";

/**
 * useChat
 * Encapsulates all send/receive logic, keeping components clean.
 */
export function useChat() {
  const dispatch = useDispatch();
  const { activeConversationId, conversations, conversationList, isLoading, apiConversationIds } =
    useSelector((s) => s.chat);

  // ✅ FIX: Always return a safe array — never undefined
  const currentMessages = Array.isArray(conversations[activeConversationId])
    ? conversations[activeConversationId]
    : [];

  const sendUserMessage = useCallback(
    async (text) => {
      const content = text.trim();
      if (!content || isLoading) return;

      // ✅ FIX: If somehow there's no active conversation, create one before sending
      let convId = activeConversationId;
      if (!convId) {
        const newId = `conv_${Date.now()}`;
        dispatch(addConversation({ id: newId, title: "New Chat", createdAt: Date.now() }));
        dispatch(setActiveConversation(newId));
        convId = newId;
      }

      // 1. Append user message
      const userMsg = {
        id: generateId("msg"),
        role: "user",
        content,
        timestamp: Date.now(),
      };
      dispatch(addMessage(convId, userMsg));

      // 2. Auto-title from first user message
      const conv = conversationList.find((c) => c.id === convId);
      if (conv?.title === "New Chat") {
        dispatch(updateConversationTitle(convId, truncate(content, 38)));
      }

      // 3. Show typing indicator
      const loadingMsg = {
        id: generateId("loading"),
        role: "assistant",
        content: "",
        isLoading: true,
        timestamp: Date.now(),
      };
      dispatch(addMessage(convId, loadingMsg));
      dispatch(setLoading(true));

      try {
        // 4. Call Mistral API
        const apiConvId = apiConversationIds[convId] || null;
        const data = await sendMessage(content, apiConvId);

        // 5. Store Mistral conversation id for follow-up turns
        if (data.id && !apiConvId) {
          dispatch(setApiConvId(convId, data.id));
        }

        // 6. Extract assistant text
        const responseText = extractResponseText(data);

        // 7. Replace loading bubble with real response
        // ✅ FIX: Read from store snapshot via getState equivalent — use closure safely
        const currentMsgs = Array.isArray(conversations[convId]) ? conversations[convId] : [];
        const withoutLoading = currentMsgs.filter((m) => !m.isLoading);
        const assistantMsg = {
          id: generateId("msg"),
          role: "assistant",
          content: responseText,
          timestamp: Date.now(),
        };
        dispatch(replaceMessages(convId, [...withoutLoading, assistantMsg]));
      } catch (err) {
        const currentMsgs = Array.isArray(conversations[convId]) ? conversations[convId] : [];
        const withoutLoading = currentMsgs.filter((m) => !m.isLoading);
        const errorMsg = {
          id: generateId("err"),
          role: "assistant",
          content: `⚠️ **Connection Error**\n\nCould not reach the Poultry Expert API.\n\n**Details:** ${err.message}\n\nPlease check your internet connection and try again.`,
          timestamp: Date.now(),
          isError: true,
        };
        dispatch(replaceMessages(convId, [...withoutLoading, errorMsg]));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [activeConversationId, apiConversationIds, conversations, conversationList, isLoading, dispatch]
  );

  return {
    currentMessages,
    isLoading,
    activeConversationId,
    sendUserMessage,
  };
}