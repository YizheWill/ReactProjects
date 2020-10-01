import { GET_INIT_LIST, DELETE_MESSAGE, ADD_MESSAGE, INPUT_CHANGE, LOAD_INIT } from "./actionTypes";
export const createAddMessageAction = () => {
  return { type: ADD_MESSAGE };
};

export const createDeleteMessageAction = idx => ({ type: DELETE_MESSAGE });
export const createInputChangeAction = value => ({ type: INPUT_CHANGE, value });
export const loadInit = value => ({ type: LOAD_INIT, value });

export const getInitList = value => {
  return {
    type: GET_INIT_LIST
  };
};

// export const getTodoList = () => {
//   return dispatch => {
//     axios({
//       method: "get",
//       url: "https://jsonplaceholder.typicode.com/posts/1",
//       responseType: "stream",
//       headers: {
//         "Access-Control-Allow-Origin": "*"
//       }
//     }).then(res => {
//       const data = res.data.title;
//       const action = loadInit(data);
//       dispatch(action);
//     });
//   };
// };
