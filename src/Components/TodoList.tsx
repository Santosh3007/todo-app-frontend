import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import Grid from "@mui/material/Grid";
import TodoForm from "./TodoForm";
import { item } from "../Interfaces";
import IconButton from "@mui/material/IconButton";
import { useDispatch } from "react-redux";
import { toggleDialogOpen } from "../Redux/NewTaskSlice";

import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

const api_url: string = "http://localhost:3001/api/v1/tasks";

const TodoList = () => {
  const [tasks, setTasks] = useState<item[]>([]);
  const dispatch = useDispatch();

  const getTasks = () => {
    fetch(api_url)
      .then((response) => response.json())
      .then((response_items: item[]) => {
        setTasks(response_items);
      })
      .catch((error) => console.log("here" + error));
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div>
      <ul>
        {tasks.map((item) => (
          <TodoItem {...item} key={item.id} />
        ))}
      </ul>
      <TodoForm apiUrl={api_url} updateTodoList={() => console.log("Hello")} />
      <Grid container justifyContent="flex-end">
        <IconButton
          style={{ color: "#E480F6" }}
          onClick={() => dispatch(toggleDialogOpen())}
        >
          <AddCircleOutlinedIcon sx={{ fontSize: 85 }} style={{ color: "" }} />
        </IconButton>
      </Grid>
    </div>
  );
};

export default TodoList;
