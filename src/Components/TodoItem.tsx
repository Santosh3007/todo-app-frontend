import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { item } from "../Interfaces";
import EditIcon from "@mui/icons-material/Edit";
import { RootState } from "../Redux/store";
import { useSelector, useDispatch } from "react-redux";
import { setTasks } from "../Redux/Misc";
import { editTask } from "../Redux/NewTaskSlice";
import Checkbox from "@mui/material/Checkbox";

const useStyles = makeStyles({
  checkBox: {
    margin: "1em",
  },
  paper: {
    margin: "1em",
    padding: "1em",
    // textAlign: "justify",
    width: "auto",
  },
  tag: {
    margin: "1em",
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

const TodoItem = (item: item) => {
  const classes = useStyles();
  const api_url = useSelector((state: RootState) => state.misc.apiUrl);
  const tasks = useSelector((state: RootState) => state.misc.tasks);
  const dispatch = useDispatch();

  const handleDelete = async (id: number) => {
    let deleteUrl = api_url + `/tasks/${id}`;
    await fetch(deleteUrl, {
      method: "DELETE",
    })
      .then(() => {
        dispatch(setTasks(tasks.filter((x: item) => x.id !== item.id))); //Removes the deleted element from the state
      })
      .catch((error) => console.log(error));
  };

  const handleComplete = async (id: number) => {
    await fetch(api_url + `/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      mode: "cors",
      body: JSON.stringify({
        completed: true,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        // dispatch(setTasks(tasks.filter((x) => x.id !== id).concat([response])));
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Paper elevation={3} className={classes.paper} sx={{ borderRadius: 20 }}>
        <Grid container rowSpacing={1} margin={2} alignItems="center">
          <Checkbox
            defaultChecked={item.completed}
            className={classes.checkBox}
            onChange={(e) => e.target.checked && handleComplete(item.id)}
          />
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h5" component="div">
                  {item.title}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {item.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dateFormatter(item.deadline)}
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
              {item.tag}
            </Paper>
          </Grid>
          <Grid item>
            <Button
              color="inherit"
              size="medium"
              onClick={() => dispatch(editTask(item))} //Sets the newTask state with the existing values in item and opens the dialog
              startIcon={<EditIcon style={{ color: "primary" }} />}
            ></Button>
          </Grid>
          <Grid item>
            <Button
              color="inherit"
              size="medium"
              onClick={() => handleDelete(item.id)}
              startIcon={<DeleteOutlineIcon style={{ color: "red" }} />}
            ></Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default TodoItem;
