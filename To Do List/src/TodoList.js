import React, { Component } from "react";
import { getInitList, loadInit, createAddMessageAction, createDeleteMessageAction, createInputChangeAction } from "./store/createActions";
import store from "./store/index";
import TodoListUI from "./TodoListUI";
import axios from "axios";

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
    this.handleDelete = this.handleDelete.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    store.subscribe(() => {
      this.setState(store.getState());
    });
  }
  handleSubmit() {
    let action = createAddMessageAction();
    store.dispatch(action);
  }
  handleInputChange(e) {
    let action = createInputChangeAction(e.target.value);
    store.dispatch(action);
  }
  handleDelete(idx) {
    let action = createDeleteMessageAction(idx);
    store.dispatch(action);
  }
  render() {
    return <TodoListUI currentMessage={this.state.currentMessage} messages={this.state.messages} handleDelete={this.handleDelete} handleInputChange={this.handleInputChange} handleSubmit={this.handleSubmit} />;
  }
  componentDidMount() {
    //let action = getTodoList();
    //store.dispatch(action);
    // axios({
    //   method: "get",
    //   url: "https://jsonplaceholder.typicode.com/posts/1",
    //   header: {
    //     "Access-Control-Allow-Origin": "*"
    //   }
    // }).then(res => {
    //   let ret = res.data.title;
    //   const action = loadInit(ret);
    //   store.dispatch(action);
    // });
    const action = getInitList();
    store.dispatch(action);
  }
}

export default TodoList;
