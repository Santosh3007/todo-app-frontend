import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {item} from "../Interfaces"

export interface itemState {
  value: number
}


const initialState= {
  id: -1,
  title: '',
  description: '',
  deadline:  new Date(new Date().toLocaleString()),
  tag: '',
  tagColor: 'purple',
  completed: false,
  dialogOpen: false
}

export const newTaskSlice = createSlice({
  name: 'newTask',
  initialState,
  reducers: {
    toggleCompleted: (state) => {
      state.completed = !state.completed
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload
    },
    setDeadline: (state, action: PayloadAction<Date>) => {
      state.deadline = action.payload
    },
    setTag: (state, action: PayloadAction<string>) => {
      state.tag = action.payload
    },
    toggleDialogOpen: (state) => {
        state.dialogOpen = !state.dialogOpen
    },
    resetTask: (state) => {
      state.id = -1;
      state.title= '';
      state.description= '';
      state.deadline=  new Date(new Date().toLocaleString());
      state.tag= '';
      state.tagColor= 'purple';
      state.completed= false;
      state.dialogOpen= false;
    },
    editTask: (state, action: PayloadAction<item>) => {
      state.id = action.payload.id;
      state.title= action.payload.title;
      state.description= action.payload.description;
      state.deadline=  action.payload.deadline;
      state.tag= action.payload.tag;
      state.tagColor= action.payload.tagColor;
      state.completed= action.payload.completed;
      state.dialogOpen= true;
    }
  },
})

// Action creators are generated for each case reducer function
export const { toggleCompleted, setTitle, setDescription, setDeadline, setTag, toggleDialogOpen,resetTask,editTask } = newTaskSlice.actions

export default newTaskSlice.reducer