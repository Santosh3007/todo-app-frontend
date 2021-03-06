import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import DateTimePicker from "@mui/lab/DateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TagPicker from "./TagPicker";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
import {
  setTitle,
  setDeadline,
  setDescription,
  resetTask,
} from "../Redux/NewTaskSlice";
import { RootState } from "../Redux/store";
import { setTasks } from "../Redux/Misc";
import useApi from "../Hooks/useApi";
import { setCustomSnackbar, setErrorSnackbar } from "../Redux/Misc";

const useStyles = makeStyles({
  nameField: {
    margin: "0.5em",
  },
  descriptionField: {
    margin: "0.5em",
    width: "400px",
    heigh: "100px",
  },
  dateTimePicker: {
    margin: "0.5em",
    size: "auto",
    textAlign: "justify",
    width: "230px",
  },
  cancelBtn: {
    margin: "0.5em",
  },
  addBtn: { margin: "0.5em" },
});

const TodoForm = () => {
  //Redux State
  const dispatch = useDispatch();
  const title = useSelector((state: RootState) => state.newTask.title);
  const description = useSelector(
    (state: RootState) => state.newTask.description
  );
  const deadline = useSelector((state: RootState) => state.newTask.deadline);
  const dialogOpen = useSelector(
    (state: RootState) => state.newTask.taskDialogOpen
  );
  const api_url = useSelector((state: RootState) => state.misc.apiUrl);
  const tasks = useSelector((state: RootState) => state.misc.tasks);
  const id = useSelector((state: RootState) => state.newTask.id);
  //Styling
  const classes = useStyles();
  const { authPost, authPatch } = useApi();

  //Event handlers
  const handleClose = () => {
    dispatch(resetTask());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formSubmit(e.target);
  };

  const handleTaskChange = (e) => {
    e.preventDefault();
    dispatch(setTitle(e.target.value));
  };

  const handleDescriptionChange = (e) => {
    e.preventDefault();
    dispatch(setDescription(e.target.value));
  };

  const formSubmit = async (formData) => {
    let data = new FormData(formData);
    if (id === -1) {
      //If id===-1, creating new task, else updating existing task
      await authPost(api_url + "/tasks", data)
        .then((response) => response.json())
        .then((response) => {
          dispatch(setTasks(tasks.concat([response])));
          dispatch(resetTask());
          dispatch(
            setCustomSnackbar({
              message: "Task Created Successfully!",
              type: "success",
            })
          );
        })
        .catch((error) => dispatch(setErrorSnackbar()));
    } else {
      await authPatch(api_url + `/tasks/${id}`, data)
        .then((response) => response.json())
        .then((response) => {
          dispatch(
            setTasks(tasks.filter((x) => x.id !== id).concat([response]))
          );
          dispatch(resetTask());
          dispatch(
            setCustomSnackbar({
              message: "Task Updated Successfully!",
              type: "success",
            })
          );
        })
        .catch((error) => dispatch(setErrorSnackbar()));
    }
  };

  useEffect(() => {
    title === "" &&
      dispatch(setDeadline(new Date(new Date().toLocaleString()))); //default date in DateTime picker is always current time when dialog opens
  }, [dialogOpen]);
  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: 28,
          },
        }}
      >
        <DialogTitle>{id === -1 ? "Add a new Task" : "Edit Task"}</DialogTitle>
        <form onSubmit={handleSubmit} id="task_form" autoComplete="off">
          <DialogContent>
            <Grid>
              <Grid item xs={12}>
                <TextField
                  id="task_input"
                  label="Name"
                  variant="outlined"
                  className={classes.nameField}
                  type="text"
                  name="task[title]" //Determines Form Data(IMP!)
                  value={title}
                  onChange={handleTaskChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="description_input"
                  label="Description"
                  type="text"
                  className={classes.descriptionField}
                  variant="outlined"
                  name="task[description]" //Determines Form Data(IMP!)
                  onChange={handleDescriptionChange}
                  value={description}
                  multiline
                ></TextField>
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    renderInput={(params) => (
                      <TextField
                        id="deadline_input"
                        type="text"
                        name="task[deadline]"
                        className={classes.dateTimePicker}
                        {...params}
                      />
                    )}
                    value={deadline}
                    inputFormat="dd/MM/yyyy hh:mm a"
                    onChange={(newDate: Date | null) => {
                      newDate && dispatch(setDeadline(newDate));
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs>
                <TagPicker typeOfTask="task" />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} className={classes.cancelBtn}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ height: "100%" }}
            >
              {id === -1 ? "Add Task" : "Update Task"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default TodoForm;
