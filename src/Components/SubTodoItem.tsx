import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { subTask } from "../Interfaces";
import EditIcon from "@mui/icons-material/Edit";
import { RootState } from "../Redux/store";
import { useSelector, useDispatch } from "react-redux";
import { setTasks, setSubtasks } from "../Redux/Misc";
import { editSubtask } from "../Redux/NewTaskSlice";
import Checkbox from "@mui/material/Checkbox";
import useApi from "../Hooks/useApi";

const useStyles = makeStyles({
  checkBox: {
    margin: "0.5em",
  },
  paper: {
    margin: "0.7em",
    padding: "1em",
    // textAlign: "justify",
    width: "auto",
  },
  tag: {
    margin: "0.5em",
    padding: "0.8em",
    textAlign: "justify",
  },
  darkMode: {
    backgroundColor: " black",
    color: "white",
  },
});

//Helps to format the date into a new DD MMM, HH:MM format
const dateFormatter = (date: string | Date) => {
  const newDate = new Date(date).toUTCString();
  const day = newDate.slice(0, 3); //Show Day instead of date if date falls within same week
  const dateString = newDate.slice(5, 11);
  const time = newDate.slice(17, 22);
  return dateString + ", " + time;
};

const SubTodoItem = (subtask: subTask) => {
  const classes = useStyles();
  const api_url = useSelector((state: RootState) => state.misc.apiUrl);
  const tasks = useSelector((state: RootState) => state.misc.tasks);
  const [open, setOpen] = useState(false);
  const subtasks = useSelector((state: RootState) => state.misc.subtasks);
  const dispatch = useDispatch();
  const { authDelete, authPatch } = useApi();

  const handleDelete = async (id: number) => {
    let deleteUrl = api_url + `/subtasks/${id}`;
    await authDelete(deleteUrl)
      .then(() => {
        dispatch(
          setSubtasks(
            subtasks.filter((x: subTask) => {
              return x.id !== subtask.id;
            })
          )
        ); //Removes the deleted element from the state
      })
      .catch((error) => console.log(error));
  };

  const handleComplete = async (id: number, bool: boolean) => {
    await authPatch(
      api_url + `/subtasks/${id}`,
      JSON.stringify({
        completed: bool,
      })
    )
      .then((response) => response.json())
      .then((response) => {
        dispatch(
          setSubtasks(subtasks.filter((x) => x.id !== id).concat([response]))
        );
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Paper elevation={3} className={classes.paper} sx={{ borderRadius: 20 }}>
        <Grid container rowSpacing={1} margin={0.5} alignItems="center">
          <Checkbox
            defaultChecked={subtask.completed}
            className={classes.checkBox}
            onChange={(e) => handleComplete(subtask.id, e.target.checked)}
          />
          <Grid item xs={12} md container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h6" component="div">
                  {subtask.title}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {subtask.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dateFormatter(subtask.deadline)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Paper
              elevation={2}
              className={classes.tag}
              sx={{ borderRadius: 8, backgroundColor: "#E480F6" }}
            >
              {subtask.tag}
            </Paper>
          </Grid>
          <Grid item>
            <Button
              color="inherit"
              size="medium"
              onClick={() => dispatch(editSubtask(subtask))} //Sets the newTask state with the existing values in item and opens the dialog
              startIcon={<EditIcon style={{ color: "primary" }} />}
            ></Button>
          </Grid>
          <Grid item>
            <Button
              color="inherit"
              size="medium"
              onClick={() => handleDelete(subtask.id)}
              startIcon={<DeleteOutlineIcon style={{ color: "red" }} />}
            ></Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default SubTodoItem;
