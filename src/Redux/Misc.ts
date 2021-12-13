import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {item} from '../Interfaces';


interface miscState  {
  apiUrl: string;
  tasks: item[];
}

const initialState:miscState= {
  apiUrl: "http://localhost:3001/api/v1",
  tasks : [],
}

export const newTaskSlice = createSlice({
  name: 'misc',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<item[]>) => {
      state.tasks = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setTasks } = newTaskSlice.actions 
export default newTaskSlice.reducer