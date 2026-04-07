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
} from "../actions/chatActions";

const INITIAL_CONV_ID = "conv_initial";

const initialState = {
  /** Map of localConvId → Message[] */
  conversations: {
    [INITIAL_CONV_ID]: [],
  },
  /** Ordered list of conversation metadata */
  conversationList: [
    { id: INITIAL_CONV_ID, title: "New Chat", createdAt: Date.now() },
  ],
  /** Currently visible conversation */
  activeConversationId: INITIAL_CONV_ID,
  /** Map of localConvId → Mistral API conversation id */
  apiConversationIds: {},
  isLoading: false,
  sidebarOpen: true,
};

export default function chatReducer(state = initialState, action) {
  switch (action.type) {

    case ADD_MESSAGE: {
      const { conversationId, message } = action.payload;
      const existing = state.conversations[conversationId] || [];
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: [...existing, message],
        },
      };
    }

    case REPLACE_MESSAGES: {
      const { conversationId, messages } = action.payload;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: messages,
        },
      };
    }

    case SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ADD_CONVERSATION:
      return {
        ...state,
        conversationList: [action.payload, ...state.conversationList],
        conversations: {
          ...state.conversations,
          [action.payload.id]: [],
        },
        activeConversationId: action.payload.id,
      };

    case SET_ACTIVE_CONVERSATION:
      return { ...state, activeConversationId: action.payload };

    case UPDATE_CONVERSATION_TITLE:
      return {
        ...state,
        conversationList: state.conversationList.map((c) =>
          c.id === action.payload.id ? { ...c, title: action.payload.title } : c
        ),
      };

    case SET_SIDEBAR_OPEN:
      return { ...state, sidebarOpen: action.payload };

    case SET_API_CONV_ID:
      return {
        ...state,
        apiConversationIds: {
          ...state.apiConversationIds,
          [action.payload.localConvId]: action.payload.apiConvId,
        },
      };

    case DELETE_CONVERSATION: {
      const id = action.payload;
      const newList = state.conversationList.filter((c) => c.id !== id);
      const newConvs = { ...state.conversations };
      const newApiIds = { ...state.apiConversationIds };
      delete newConvs[id];
      delete newApiIds[id];
      const newActive =
        state.activeConversationId === id
          ? newList[0]?.id || null
          : state.activeConversationId;
      return {
        ...state,
        conversationList: newList,
        conversations: newConvs,
        apiConversationIds: newApiIds,
        activeConversationId: newActive,
      };
    }

    default:
      return state;
  }
}
