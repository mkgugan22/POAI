import {
  ADD_MESSAGE,
  REPLACE_MESSAGES,
  SET_LOADING,
  ADD_CONVERSATION,
  SET_ACTIVE_CONVERSATION,
  UPDATE_CONVERSATION_TITLE,
  SET_SIDEBAR_OPEN,
  SET_API_CONV_ID,
  DELETE_CONVERSATION,
  RESET_FOR_USER,
} from "../actions/chatActions";

function storageKey(userId) {
  return `fsai_conv_${userId || "guest"}`;
}

function saveState(userId, conversationList, conversations, apiConversationIds) {
  try {
    localStorage.setItem(
      storageKey(userId),
      JSON.stringify({ conversationList, conversations, apiConversationIds })
    );
  } catch {}
}

function loadState(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function freshState(userId) {
  const id   = `conv_${Date.now()}`;
  const conv = { id, title: "New Chat", createdAt: Date.now() };
  return {
    conversations:        { [id]: [] },
    conversationList:     [conv],
    activeConversationId: id,
    apiConversationIds:   {},
    currentUserId:        userId,
  };
}

function stateForUser(userId) {
  const saved = loadState(userId);
  if (saved && Array.isArray(saved.conversationList) && saved.conversationList.length > 0) {
    return {
      conversations:        saved.conversations      || {},
      conversationList:     saved.conversationList,
      activeConversationId: saved.conversationList[0].id,
      apiConversationIds:   saved.apiConversationIds || {},
      currentUserId:        userId,
    };
  }
  return freshState(userId);
}

const initialState = {
  ...freshState("guest"),
  isLoading:   false,
  sidebarOpen: true,
};

export default function chatReducer(state = initialState, action) {
  let next;

  switch (action.type) {

    case RESET_FOR_USER: {
      const userId = action.payload;
      const loaded = stateForUser(userId);
      return {
        ...state,
        ...loaded,
        isLoading:   false,
        sidebarOpen: state.sidebarOpen,
      };
    }

    case ADD_MESSAGE: {
      const { conversationId, message } = action.payload;
      const existing = state.conversations[conversationId] || [];
      next = {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: [...existing, message],
        },
      };
      saveState(next.currentUserId, next.conversationList, next.conversations, next.apiConversationIds);
      return next;
    }

    case REPLACE_MESSAGES: {
      const { conversationId, messages } = action.payload;
      next = {
        ...state,
        conversations: { ...state.conversations, [conversationId]: messages },
      };
      saveState(next.currentUserId, next.conversationList, next.conversations, next.apiConversationIds);
      return next;
    }

    case SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ADD_CONVERSATION:
      next = {
        ...state,
        conversationList: [action.payload, ...state.conversationList],
        conversations: { ...state.conversations, [action.payload.id]: [] },
        activeConversationId: action.payload.id,
      };
      saveState(next.currentUserId, next.conversationList, next.conversations, next.apiConversationIds);
      return next;

    case SET_ACTIVE_CONVERSATION:
      return { ...state, activeConversationId: action.payload };

    case UPDATE_CONVERSATION_TITLE:
      next = {
        ...state,
        conversationList: state.conversationList.map(c =>
          c.id === action.payload.id ? { ...c, title: action.payload.title } : c
        ),
      };
      saveState(next.currentUserId, next.conversationList, next.conversations, next.apiConversationIds);
      return next;

    case SET_SIDEBAR_OPEN:
      return { ...state, sidebarOpen: action.payload };

    case SET_API_CONV_ID:
      next = {
        ...state,
        apiConversationIds: {
          ...state.apiConversationIds,
          [action.payload.localConvId]: action.payload.apiConvId,
        },
      };
      saveState(next.currentUserId, next.conversationList, next.conversations, next.apiConversationIds);
      return next;

    case DELETE_CONVERSATION: {
      const id        = action.payload;
      const newList   = state.conversationList.filter(c => c.id !== id);
      const newConvs  = { ...state.conversations };
      const newApiIds = { ...state.apiConversationIds };
      delete newConvs[id];
      delete newApiIds[id];
      const newActive =
        state.activeConversationId === id
          ? newList[0]?.id || null
          : state.activeConversationId;
      next = {
        ...state,
        conversationList:     newList,
        conversations:        newConvs,
        apiConversationIds:   newApiIds,
        activeConversationId: newActive,
      };
      saveState(next.currentUserId, next.conversationList, next.conversations, next.apiConversationIds);
      return next;
    }

    default:
      return state;
  }
}