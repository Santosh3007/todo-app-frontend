import React, { useEffect } from "react";
import TodoItem from "./TodoItem";
import Grid from "@mui/material/Grid";
import TodoForm from "./TodoForm";
import { item } from "../Interfaces";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { toggleDialogOpen } from "../Redux/NewTaskSlice";
import { setTasks } from "../Redux/Misc";
import MiniDrawer from "../Drawer/Drawer";
import { RootState } from "../Redux/store";

import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

const TodoList = () => {
  // const [tasks, setTasks] = useState<item[]>([]);
  const api_url = useSelector((state: RootState) => state.misc.apiUrl);
  const tasks = useSelector((state: RootState) => state.misc.tasks);
  const dispatch = useDispatch();

  const getTasks = () => {
    fetch(api_url + "/tasks")
      .then((response) => response.json())
      .then((response_items: item[]) => {
        dispatch(setTasks(response_items));
      })
      .catch((error) => console.log("here" + error));
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div>
      <Grid container>
        <Grid item xs={2}>
          <MiniDrawer />
        </Grid>
        <Grid item>
          <ul>
            {tasks.map((item) => (
              <TodoItem {...item} key={item.id} />
            ))}
          </ul>
          <TodoForm />
          <Grid container justifyContent="flex-end">
            <IconButton
              style={{ color: "#E480F6" }}
              onClick={() => {
                dispatch(toggleDialogOpen());
                console.log(tasks);
              }}
            >
              <AddCircleOutlinedIcon
                sx={{ fontSize: 85 }}
                style={{ color: "" }}
              />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default TodoList;
