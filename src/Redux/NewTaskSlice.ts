import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface itemState {
  value: number
}


const initialState= {
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
    }
  },
})

// Action creators are generated for each case reducer function
export const { toggleCompleted, setTitle, setDescription, setDeadline, setTag, toggleDialogOpen } = newTaskSlice.actions

export default newTaskSlice.reducer