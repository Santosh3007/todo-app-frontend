import { configureStore } from "@reduxjs/toolkit";
import newTaskReducer from './NewTaskSlice';

 const store = configureStore({
  reducer: {
    newTask: newTaskReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type RootState = ReturnType<typeof store.getState>
export default store;
