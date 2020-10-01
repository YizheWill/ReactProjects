import { takeEvery, put } from "redux-saga/effects";
import { GET_INIT_LIST } from "./actionTypes";
import { loadInit } from "./createActions";
import axios from "axios";
function* getInitList() {
  const res = yield axios({ method: "get", url: "https://jsonplaceholder.typicode.com/todos/1" });
  const action = loadInit(res.data.title);
  yield put(action);
}
function* todoSagas() {
  yield takeEvery(GET_INIT_LIST, getInitList);
}

export default todoSagas;
