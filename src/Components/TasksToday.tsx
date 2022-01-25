import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { RootState } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import useApi from "../Hooks/useApi";
import { setTasks, setSubtasks } from "../Redux/Misc";
import Typography from "@mui/material/Typography";
import { item, subTask } from "../Interfaces";
import { setCustomSnackbar, setErrorSnackbar } from "../Redux/Misc";

const compare = (a, b: item) => {
  return a.deadline < b.deadline ? -1 : a.deadline > b.deadline ? 1 : 0;
};

const TasksToday = (props: { type: String }) => {
  let subtasks = useSelector((state: RootState) => state.misc.subtasks)
    .map((item) => {
      return { ...item, isTask: false };
    })
    .filter((item) => !item.completed);
  const api_url = useSelector((state: RootState) => state.misc.apiUrl);

  let tasks = useSelector((state: RootState) => state.misc.tasks)
    .map((item) => {
      return { ...item, isTask: true };
    })
    .filter((item) => !item.completed)
    .concat(subtasks)
    .filter((item) => {
      const res =
        new Date(item.deadline).getTime() - 28800000 - new Date().getTime();
      if (props.type == "today") {
        return res > 0 && res < 604800000;
      } else if (props.type == "week") {
        return res > 0 && res < 604800000 * 7;
      } else if (props.type == "overdue") {
        //overdue
        return res < 0;
      }
    })
    .sort(compare);

  //Helps to format the date into a new DD MMM, HH:MM format
  const dateFormatter = (date: string | Date) => {
    const newDate = new Date(date).toUTCString();
    const day = newDate.slice(0, 3); //Show Day instead of date if date falls within same week
    const dateString = newDate.slice(5, 11);
    const time = newDate.slice(17, 22);
    return props.type == "today"
      ? time
      : props.type == "week"
      ? day + ", " + time
      : dateString + ", " + time;
  };

  useEffect(() => {
    console.log("rerender");
  }, [tasks]);

  tasks = tasks;

  let allTasks = tasks.map((item) => {
    return {
      deadline: item.deadline,
      component: (
        <div key={item.id}>
          <ListItem>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={1}>
                <Checkbox
                  defaultChecked={item.completed}
                  onChange={(e) =>
                    item.isTask
                      ? handleTaskComplete(item.id)
                      : handleSubtaskComplete(item.id)
                  }
                />
              </Grid>

              <Grid item xs={7.2} display="flex" textAlign="left">
                <Typography variant="body1" textAlign="left">
                  {item.title}
                </Typography>
              </Grid>

              <Grid item xs={1.9}>
                {item.tag && (
                  <Paper
                    elevation={2}
                    style={{ textAlign: "center", padding: "0.3em" }}
                    sx={{
                      borderRadius: 8,
                      backgroundColor: "#b4b3b6",
                    }}
                  >
                    {item.tag}
                  </Paper>
                )}
              </Grid>

              <Grid item xs textAlign="right">
                <Typography
                  variant="body2"
                  color={props.type == "overdue" ? "red" : "text.secondary"} //To check if Task is overdue
                >
                  {dateFormatter(item.deadline)}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider variant="middle" component="li" />
        </div>
      ),
    };
  });

  const dispatch = useDispatch();
  const { authPatch } = useApi();

  const handleTaskComplete = async (id: number) => {
    await authPatch(
      api_url + `/tasks/${id}`,
      JSON.stringify({
        completed: true,
      })
    )
      .then((response) => response.json())
      .then((response) => {
        dispatch(setTasks(tasks.filter((x) => x.id !== id).concat([response])));
        dispatch(
          setCustomSnackbar({
            message: "Task Completed Successfully!",
            type: "success",
          })
        );
      })
      .catch((error) => dispatch(setErrorSnackbar()));
  };

  const handleSubtaskComplete = async (id: number) => {
    await authPatch(
      api_url + `/subtasks/${id}`,
      JSON.stringify({
        completed: true,
      })
    )
      .then((response) => response.json())
      .then((response) => {
        dispatch(
          setSubtasks(subtasks.filter((x) => x.id !== id).concat([response]))
        );
        dispatch(
          setCustomSnackbar({
            message: "Task Completed Successfully!",
            type: "success",
          })
        );
      })
      .catch((error) => dispatch(setErrorSnackbar()));
  };
  console.log(props.type);
  console.log(allTasks);
  return (
    <>
      <Typography variant="h5" style={{ marginLeft: "2em" }}>
        {props.type === "today"
          ? "Upcoming Tasks Today"
          : props.type === "week"
          ? "Upcoming Tasks This Week"
          : props.type === "overdue"
          ? "Overdue Tasks"
          : "Progress Bar"}
      </Typography>
      <Paper
        elevation={3}
        style={{
          overflow: "auto",
          height: "36vh",
          marginLeft: "2rem",
          marginRight: "2rem",
          marginBottom: "1.2rem",
          marginTop: "0.6rem",
          borderRadius: 20,
          backgroundColor: "#f1e9da",
        }}
      >
        <List>
          {allTasks.map((item) => item.component)}
          {!allTasks.length && (
            <>
              <ListItem>
                <Typography variant="body1" textAlign="left">
                  {props.type == "progress"
                    ? "Coming Soon!"
                    : "Good job! You have completed all your tasks!"}
                </Typography>
              </ListItem>
              <Divider variant="middle" component="li" />
            </>
          )}
        </List>
      </Paper>
    </>
  );
};

export default TasksToday;
