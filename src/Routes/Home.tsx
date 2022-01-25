import { useEffect } from "react";
import TasksToday from "../Components/TasksToday";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { Link } from "react-router-dom";
import useApi from "../Hooks/useApi";
import { item, subTask } from "../Interfaces";
import { setTasks, setSubtasks } from "../Redux/Misc";
import { setErrorSnackbar } from "../Redux/Misc";

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
  }, []);

  return (
    <>
      <Grid
        container
        alignItems={"center"}
        alignContent={"justify"}
        style={{ backgroundColor: "#d8e2dc" }}
      >
        <Grid item xs={10} alignContent="center">
          <Typography
            variant="h3"
            style={{
              marginLeft: "2rem",
              fontFamily: "Merriweather",
              marginBottom: "1rem",
            }}
          >
            Welcome back, {username}
          </Typography>
        </Grid>
        <Grid item xs alignContent="center">
          <Typography
            variant="h5"
            style={{
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
        <Grid item xs={6}>
          <TasksToday type="today" />
        </Grid>
        <Grid item xs={6}>
          <TasksToday type="overdue" />
        </Grid>
        <Grid item xs={6}>
          <TasksToday type="week" />
        </Grid>
        <Grid item xs={6}>
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
    </>
  );
};

export default Home;
