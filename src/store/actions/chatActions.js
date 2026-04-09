export const ADD_MESSAGE               = "ADD_MESSAGE";
export const REPLACE_MESSAGES          = "REPLACE_MESSAGES";
export const SET_LOADING               = "SET_LOADING";
export const ADD_CONVERSATION          = "ADD_CONVERSATION";
export const SET_ACTIVE_CONVERSATION   = "SET_ACTIVE_CONVERSATION";
export const UPDATE_CONVERSATION_TITLE = "UPDATE_CONVERSATION_TITLE";
export const SET_SIDEBAR_OPEN          = "SET_SIDEBAR_OPEN";
export const SET_API_CONV_ID           = "SET_API_CONV_ID";
export const DELETE_CONVERSATION       = "DELETE_CONVERSATION";
export const RESET_FOR_USER            = "RESET_FOR_USER";

export const addMessage = (conversationId, message) => ({
  type: ADD_MESSAGE, payload: { conversationId, message },
});
export const replaceMessages = (conversationId, messages) => ({
  type: REPLACE_MESSAGES, payload: { conversationId, messages },
});
export const setLoading = (isLoading) => ({
  type: SET_LOADING, payload: isLoading,
});
export const addConversation = (conversation) => ({
  type: ADD_CONVERSATION, payload: conversation,
});
export const setActiveConversation = (conversationId) => ({
  type: SET_ACTIVE_CONVERSATION, payload: conversationId,
});
export const updateConversationTitle = (id, title) => ({
  type: UPDATE_CONVERSATION_TITLE, payload: { id, title },
});
export const setSidebarOpen = (isOpen) => ({
  type: SET_SIDEBAR_OPEN, payload: isOpen,
});
export const setApiConvId = (localConvId, apiConvId) => ({
  type: SET_API_CONV_ID, payload: { localConvId, apiConvId },
});
export const deleteConversation = (conversationId) => ({
  type: DELETE_CONVERSATION, payload: conversationId,
});
export const resetForUser = (userId) => ({
  type: RESET_FOR_USER, payload: userId,
});