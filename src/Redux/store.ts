import { configureStore } from "@reduxjs/toolkit";
import newTaskReducer from './NewTaskSlice';
import miscReducer from './Misc'

 const store = configureStore({
  reducer: {
    newTask: newTaskReducer,
    misc: miscReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type RootState = ReturnType<typeof store.getState>
export default store;
