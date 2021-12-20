import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// import Grid from "@mui/material/Grid";
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
import { setSubtasks } from "../Redux/Misc";

const useStyles = makeStyles({
  nameField: {
    margin: "1em",
  },
  descriptionField: {
    margin: "1em",
  },
  dateTimePicker: {
    margin: "1em",
    padding: "2em",
    size: "auto",
    textAlign: "justify",
    width: 300,
  },
  cancelBtn: {
    margin: "1em",
  },
  addBtn: { margin: "1em" },
});

const SubtodoForm = () => {
  //Redux State
  const dispatch = useDispatch();
  const title = useSelector((state: RootState) => state.newTask.title);
  const description = useSelector(
    (state: RootState) => state.newTask.description
  );
  const deadline = useSelector((state: RootState) => state.newTask.deadline);
  const dialogOpen = useSelector(
    (state: RootState) => state.newTask.subtaskDialogOpen
  );
  const api_url = useSelector((state: RootState) => state.misc.apiUrl);
  const subtasks = useSelector((state: RootState) => state.misc.subtasks);
  const id = useSelector((state: RootState) => state.newTask.id);
  const taskInFocus = useSelector(
    (state: RootState) => state.newTask.taskInFocus
  );
  //Styling
  const classes = useStyles();

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
    data.append("subtask[task_id]", taskInFocus.toString());
    console.log(Array.from(data));
    if (id === -1) {
      //If id===-1, creating new task, else updating existing task
      await fetch(api_url + "/subtasks", {
        method: "POST",
        mode: "cors",
        body: data,
      })
        .then((response) => response.json())
        .then((response) => {
          dispatch(setSubtasks(subtasks.concat([response])));
          dispatch(resetTask());
        })
        .catch((error) => console.log(error));
    } else {
      await fetch(api_url + `/subtasks/${id}`, {
        method: "PATCH",
        mode: "cors",
        body: data,
      })
        .then((response) => response.json())
        .then((response) => {
          dispatch(
            setSubtasks(subtasks.filter((x) => x.id !== id).concat([response]))
          );
          dispatch(resetTask());
        })
        .catch((error) => console.log(error));
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
        <DialogTitle>
          {id === -1 ? "Add a new SubTask" : "Edit SubTask"}
        </DialogTitle>
        <form onSubmit={handleSubmit} id="subtask_form" autoComplete="off">
          <DialogContent>
            <TextField
              id="subtask_input"
              label="Name"
              variant="outlined"
              type="text"
              name="subtask[title]" //Determines Form Data(IMP!)
              value={title}
              onChange={handleTaskChange}
            />
            <TextField
              id="description_input"
              label="Description"
              type="text"
              variant="outlined"
              name="subtask[description]" //Determines Form Data(IMP!)
              onChange={handleDescriptionChange}
              value={description}
            ></TextField>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                renderInput={(params) => (
                  <TextField
                    id="deadline_input"
                    type="text"
                    name="subtask[deadline]"
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
            <TagPicker typeOfTask="subtask" />
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
              {id === -1 ? "Add SubTask" : "Update SubTask"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default SubtodoForm;
