import { GET_INIT_LIST, DELETE_MESSAGE, ADD_MESSAGE, INPUT_CHANGE, LOAD_INIT } from "./actionTypes";

const defaultState = {
  messages: [],
  currentMessage: ""
};

const reducer = (state = defaultState, action) => {
  let res = state;
  switch (action.type) {
    case DELETE_MESSAGE:
      res.messages.splice(action.idx, 1);
      return res;
    case ADD_MESSAGE:
      res.messages.push(state.currentMessage);
      res.currentMessage = "";
      return res;
    case INPUT_CHANGE:
      res.currentMessage = action.value;
      return res;
    case LOAD_INIT:
      res.messages.push(action.value);
      res.currentMessage = "";
      return res;
    default:
      return res;
  }
};
export default reducer;
