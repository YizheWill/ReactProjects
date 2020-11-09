import React, { userState } from "react";

export const Todolist = () => {
  const api_url = "http://localhost:3001/api/v1/todos";
  const [todos, settodos] = useState([]);
  return (
    <div>
      {todos.map(el, (index) => (
        <li key={index}>{el}</li>
      ))}
    </div>
  );
};
