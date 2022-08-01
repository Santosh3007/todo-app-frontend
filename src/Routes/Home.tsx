import { useEffect } from "react";
import TasksToday from "../Components/TasksToday";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { Link } from "react-router-dom";
import useApi from "../Hooks/useApi";
import { item, subTask } from "../Interfaces";
import { setTasks, setSubtasks } from "../Redux/Misc";
import { setErrorSnackbar } from "../Redux/Misc";
import Button from "@mui/material/Button";
import { toggleTaskDialogOpen } from "../Redux/NewTaskSlice";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import TodoForm from "../Components/TodoForm";

const Home = () => {
  const username = useSelector((state: RootState) => state.auth.username);
  const api_url = useSelector((state: RootState) => state.misc.apiUrl);

  const { authFetch } = useApi();
  const dispatch = useDispatch();

  const getTasks = () => {
    authFetch(api_url + "/tasks")
      .then((response) => response.json())
      .then((response_items: item[]) => {
        dispatch(setTasks(response_items));
      })
      .catch((error) => dispatch(setErrorSnackbar()));

    authFetch(api_url + "/subtasks")
      .then((response) => response.json())
      .then((response_items: subTask[]) => {
        dispatch(setSubtasks(response_items));
      })
      .catch((error) => dispatch(setErrorSnackbar()));
  };

  useEffect(() => {
    getTasks();
  });

  return (
    <>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="space-evenly"
        style={{
          backgroundColor: "#d8e2dc",
          minHeight: "100vh",
          height: "auto",
        }}
      >
        <Grid item md={8} xs={12} alignContent="center">
          <Typography
            variant="h3"
            style={{
              fontSize: "2rem",
              marginLeft: "2rem",
              fontFamily: "Merriweather",
              marginBottom: "1rem",
            }}
          >
            Welcome back, {username}
          </Typography>
        </Grid>
        <Grid item xs alignContent="center">
          <Button
            style={{
              float: "right",
              borderColor: "#999999",
              backgroundColor: "#999999",
              fontSize: 16,
              marginLeft: "1em",
            }}
            variant="contained"
            onClick={() => {
              dispatch(toggleTaskDialogOpen());
            }}
            startIcon={
              <AddCircleOutlinedIcon
                sx={{ fontSize: 65 }}
                style={{ color: "" }}
              />
            }
          >
            Create New Task
          </Button>
        </Grid>
        <Grid item xs alignContent="center">
          <Typography
            variant="h5"
            style={{
              float: "right",
              marginRight: "1rem",
              textAlign: "center",
              fontFamily: "Merriweather",
              borderRadius: "1.2rem",
              padding: "0.5rem",
            }}
          >
            {new Date().toDateString()}
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <TasksToday type="today" />
        </Grid>
        <Grid item md={6} xs={12}>
          <TasksToday type="overdue" />
        </Grid>
        <Grid item md={6} xs={12}>
          <TasksToday type="week" />
        </Grid>
        <Grid item md={6} xs={12}>
          <TasksToday type="progress" />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="body1"
            style={{ marginLeft: "2rem", textAlign: "center" }}
          >
            <Link to="/tasks">Add/View/Edit more tasks</Link>
          </Typography>
        </Grid>
      </Grid>
      <TodoForm />
    </>
  );
};

export default Home;
