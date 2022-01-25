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
import { setSubtasks } from "../Redux/Misc";
import { editSubtask } from "../Redux/NewTaskSlice";
import Checkbox from "@mui/material/Checkbox";
import useApi from "../Hooks/useApi";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { setCustomSnackbar, setErrorSnackbar } from "../Redux/Misc";

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
  const subtasks = useSelector((state: RootState) => state.misc.subtasks);
  const dispatch = useDispatch();
  const { authDelete, authPatch } = useApi();

  const isOverdue =
    new Date(subtask.deadline).getTime() - 28800000 - new Date().getTime() < 0;

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
        dispatch(
          setCustomSnackbar({
            message: "Subtask Deleted Successfully!",
            type: "success",
          })
        );
      })
      .catch((error) => dispatch(setErrorSnackbar()));
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
        dispatch(
          setCustomSnackbar({
            message: "Subtask Completed Successfully!",
            type: "success",
          })
        );
      })
      .catch((error) => dispatch(setErrorSnackbar()));
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
                      {dateFormatter(subtask.deadline)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            {subtask.tag && (
              <Paper
                elevation={2}
                className={classes.tag}
                sx={{ borderRadius: 8, backgroundColor: "#999999" }}
              >
                {subtask.tag}
              </Paper>
            )}
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
