import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { item, subTask } from "../Interfaces";

// interface actionType { "success" | "error" | "warning" | "info"}

interface miscState {
  apiUrl: string;
  tasks: item[];
  subtasks: subTask[];
  searchDialogOpen: boolean;
  snackbarMessage: String;
  snackbarType: "success" | "error" | "warning" | "info";
  snackbarOpen: boolean;
}

const initialState: miscState = {
  apiUrl:
    "http://todo-api-env.eba-xaznfkbj.ap-southeast-1.elasticbeanstalk.com/api/v1",
  tasks: [],
  subtasks: [],
  searchDialogOpen: false,
  snackbarMessage: "",
  snackbarType: "success",
  snackbarOpen: false,
};

export const newTaskSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<item[]>) => {
      state.tasks = action.payload;
    },
    setSubtasks: (state, action: PayloadAction<subTask[]>) => {
      state.subtasks = action.payload;
    },
    toggleSearchDialog: (state) => {
      state.searchDialogOpen = !state.searchDialogOpen;
    },
    setCustomSnackbar: (
      state,
      action: PayloadAction<{
        message: String;
        type: "success" | "error" | "warning" | "info";
      }>
    ) => {
      state.snackbarMessage = action.payload.message;
      state.snackbarType = action.payload.type;
      state.snackbarOpen = true;
    },
    setSnackbarOpen: (state, action: PayloadAction<boolean>) => {
      state.snackbarOpen = action.payload;
    },
    setErrorSnackbar: (state) => {
      state.snackbarMessage = "Something went wrong! Please try again!";
      state.snackbarType = "error";
      state.snackbarOpen = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setTasks,
  setSubtasks,
  toggleSearchDialog,
  setCustomSnackbar,
  setSnackbarOpen,
  setErrorSnackbar,
} = newTaskSlice.actions;
export default newTaskSlice.reducer;
