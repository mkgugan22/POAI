import { createStore, combineReducers } from "redux";
import chatReducer from "./reducers/chatReducer";

const rootReducer = combineReducers({
  chat: chatReducer,
});

const store = createStore(
  rootReducer,
  // Uncomment below to enable Redux DevTools in browser
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
