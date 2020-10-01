import React from "react";
import "antd/dist/antd.css";
import { Input, Button, List } from "antd";

const TodoListUI = props => {
  return (
    <div>
      <div style={{ margin: 30 }}>
        <Input style={{ width: 300 }} placeholder="please enter" onChange={props.handleInputChange} value={props.currentMessage} />
        <Button style={{ marginLeft: 10 }} type="primary" onClick={props.handleSubmit}>
          SUBMIT
        </Button>
        <List bordered style={{ marginTop: 20, width: 300 }} dataSource={props.messages} renderItem={(item, idx) => <List.Item onClick={() => props.handleDelete(idx)}>{item}</List.Item>} />
      </div>
    </div>
  );
};

export default TodoListUI;
