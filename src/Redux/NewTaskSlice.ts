import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {item,subTask} from "../Interfaces"

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
  taskDialogOpen: false,
  subtaskDialogOpen: false,
  taskInFocus: -1

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
    setTaskInFocus: (state, action: PayloadAction<number>) => {
      state.taskInFocus = action.payload
    },
    toggleTaskDialogOpen: (state) => {
        state.taskDialogOpen = !state.taskDialogOpen
    },
    
    toggleSubtaskDialogOpen: (state) => {
        state.subtaskDialogOpen = !state.subtaskDialogOpen
    },
    resetTask: (state) => {
      state.id = -1;
      state.title= '';
      state.description= '';
      state.deadline=  new Date(new Date().toLocaleString());
      state.tag= '';
      state.tagColor= 'purple';
      state.completed= false;
      state.taskDialogOpen= false;
      state.subtaskDialogOpen= false;
      state.taskInFocus=-1;
    },
    editTask: (state, action: PayloadAction<item>) => {
      state.id = action.payload.id;
      state.title= action.payload.title;
      state.description= action.payload.description;
      state.deadline=  action.payload.deadline;
      state.tag= action.payload.tag;
      state.tagColor= action.payload.tagColor;
      state.completed= action.payload.completed;
      state.taskDialogOpen= true;
    },
    editSubtask: (state, action: PayloadAction<subTask>) => {
      state.id = action.payload.id;
      state.title= action.payload.title;
      state.description= action.payload.description;
      state.deadline=  action.payload.deadline;
      state.tag= action.payload.tag;
      state.tagColor= action.payload.tagColor;
      state.completed= action.payload.completed;
      state.subtaskDialogOpen= true;
    }
  },
})

// Action creators are generated for each case reducer function
export const { toggleCompleted, setTitle, setDescription, setDeadline, setTag, setTaskInFocus,toggleTaskDialogOpen,toggleSubtaskDialogOpen,resetTask,editTask,editSubtask } = newTaskSlice.actions

export default newTaskSlice.reducer