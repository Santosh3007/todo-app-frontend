import React from "react";
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
  toggleDialogOpen,
} from "../Redux/NewTaskSlice";
import { RootState } from "../Redux/store";
import { ClassNames } from "@emotion/react";

const useStyles = makeStyles({
  form: {
    borderRadius: 515,
  },
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

const TodoForm = ({ apiUrl, updateTodoList }) => {
  //Redux State
  const title = useSelector((state: RootState) => state.newTask.title);
  const description = useSelector(
    (state: RootState) => state.newTask.description
  );
  const deadline = useSelector((state: RootState) => state.newTask.deadline);
  const dialogOpen = useSelector(
    (state: RootState) => state.newTask.dialogOpen
  );
  const dispatch = useDispatch();

  //Styling
  const classes = useStyles();

  //Event handlers
  const handleClose = () => {
    dispatch(toggleDialogOpen());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(e.target);
    formSubmit(e.target);
    dispatch(toggleDialogOpen());
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
    console.log(Array.from(data));
    await fetch(apiUrl, {
      method: "POST",
      mode: "cors",
      body: data,
    })
      .then((response) => response.json())
      .then((response) => {
        updateTodoList(response);

        dispatch(setTitle(""));
        dispatch(setDescription(""));
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Dialog open={dialogOpen} onClose={handleClose} sx={{ borderRadius: 40 }}>
        <DialogTitle>Add a new Task</DialogTitle>
        {/* <Grid container> */}
        {/* <Grid item xs></Grid> */}
        {/* <Grid item xs={10}> */}
        <form onSubmit={handleSubmit} id="task_form" autoComplete="off">
          <DialogContent>
            {/* <Grid container> */}
            {/* <Grid item xs={12}> */}
            <TextField
              id="task_input"
              label="Name"
              variant="outlined"
              type="text"
              name="task[title]" //Determines Form Data(IMP!)
              value={title}
              onChange={handleTaskChange}
            />
            {/* </Grid> */}
            {/* <Grid item xs={12}> */}
            <TextField
              id="description_input"
              label="Description"
              type="text"
              variant="outlined"
              name="task[description]" //Determines Form Data(IMP!)
              onChange={handleDescriptionChange}
              value={description}
            ></TextField>
            {/* </Grid> */}
            {/* </Grid> */}
            {/* <Grid item xs={2}> */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                renderInput={(params) => (
                  <TextField
                    id="deadline_input"
                    type="date"
                    name="task[deadline]"
                    value={deadline}
                    className={classes.dateTimePicker}
                    {...params}
                  />
                )}
                value={deadline}
                onChange={(newDate: Date | null) => {
                  newDate && dispatch(setDeadline(newDate));
                }}
              />
            </LocalizationProvider>
            {/* </Grid> */}
            {/* <Grid item xs={2}> */}
            <TagPicker />
            {/* </Grid> */}
          </DialogContent>
          {/* <Grid item xs={2}> */}
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
              Add Task
            </Button>
          </DialogActions>
          {/* </Grid> */}
        </form>
        {/* </Grid> */}
        {/* <Grid item xs></Grid> */}
        {/* </Grid> */}
      </Dialog>
    </>
  );
};

export default TodoForm;
