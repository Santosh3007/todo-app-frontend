import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {item, subTask} from '../Interfaces';


interface miscState  {
  apiUrl: string;
  tasks: item[];
  subtasks: subTask[];
}

const initialState:miscState= {
  apiUrl: "http://localhost:3001/api/v1",
  tasks : [],
  subtasks: [],
}

export const newTaskSlice = createSlice({
  name: 'misc',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<item[]>) => {
      state.tasks = action.payload
    },
    setSubtasks: (state, action: PayloadAction<subTask[]>) => {
      state.subtasks = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setTasks, setSubtasks } = newTaskSlice.actions 
export default newTaskSlice.reducer