import { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { item } from "../Interfaces";
import EditIcon from "@mui/icons-material/Edit";
import SubTodoItem from "./SubTodoItem";
import { RootState } from "../Redux/store";
import { useSelector, useDispatch } from "react-redux";
import { setTasks } from "../Redux/Misc";
import { editTask, setTaskInFocus } from "../Redux/NewTaskSlice";
import Checkbox from "@mui/material/Checkbox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toggleSubtaskDialogOpen } from "../Redux/NewTaskSlice";
import useApi from "../Hooks/useApi";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { setCustomSnackbar, setErrorSnackbar } from "../Redux/Misc";

const useStyles = makeStyles({
  checkBox: {
    margin: "1em",
  },
  paper: {
    margin: "0.75em",
    padding: "0.5em",
    paddingRight: "1em",
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
  const [open, setOpen] = useState(false);
  const subtasks = useSelector(
    (state: RootState) => state.misc.subtasks
  ).filter((subtask) => subtask.task_id === item.id);
  const dispatch = useDispatch();
  const { authPatch, authDelete } = useApi();

  const isOverdue =
    new Date(item.deadline).getTime() - 28800000 - new Date().getTime() < 0;

  const handleDelete = async (id: number) => {
    let deleteUrl = api_url + `/tasks/${id}`;
    await authDelete(deleteUrl)
      .then((response) => {
        dispatch(setTasks(tasks.filter((x: item) => x.id !== item.id))); //Removes the deleted element from the state
        dispatch(
          setCustomSnackbar({
            message: "Task Deleted Successfully!",
            type: "success",
          })
        );
      })
      .catch((error) => dispatch(setErrorSnackbar()));
  };

  const handleComplete = async (id: number, bool: boolean) => {
    await authPatch(
      api_url + `/tasks/${id}`,
      JSON.stringify({
        completed: bool,
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

  return (
    <>
      <Paper
        elevation={3}
        className={classes.paper}
        sx={{ borderRadius: 20, backgroundColor: "#d8e2dc" }}
      >
        <Grid container rowSpacing={1} margin={2} alignItems="center">
          <Checkbox
            defaultChecked={item.completed}
            className={classes.checkBox}
            onChange={(e) => handleComplete(item.id, e.target.checked)}
          />
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h5" component="div">
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  style={{ marginBottom: "0.4em" }}
                >
                  {item.description}
                </Typography>
                <Grid container direction="row" alignItems="center">
                  {isOverdue && (
                    <Grid item>
                      <WarningAmberOutlinedIcon
                        style={{ marginRight: "0.2em", color: "red" }}
                      />
                    </Grid>
                  )}
                  <Grid item>
                    <Typography
                      variant="body2"
                      color={isOverdue ? "red" : "text.secondary"} //To check if Task is overdue
                    >
                      {dateFormatter(item.deadline)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            {item.tag && (
              <Paper
                elevation={2}
                className={classes.tag}
                sx={{ borderRadius: 8, backgroundColor: "#999999" }}
              >
                {item.tag}
              </Paper>
            )}
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
          <Grid item>
            <IconButton onClick={() => setOpen(!open)}>
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Grid>
        </Grid>
        <Collapse in={open}>
          {subtasks.map((subtask) => (
            <SubTodoItem {...subtask} key={subtask.id} />
          ))}
          <IconButton
            style={{ marginLeft: "3em" }}
            onClick={() => {
              dispatch(setTaskInFocus(item.id));
              dispatch(toggleSubtaskDialogOpen());
            }}
          >
            <AddCircleOutlineIcon style={{ margin: "0.5em" }} />
            Add new Sub-Task
          </IconButton>
        </Collapse>
      </Paper>
    </>
  );
};

export default TodoItem;
