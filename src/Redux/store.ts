import { configureStore } from "@reduxjs/toolkit";
import newTaskReducer from "./NewTaskSlice";
import miscReducer from "./Misc";
import authReducer from "./Auth";

const store = configureStore({
  reducer: {
    newTask: newTaskReducer,
    misc: miscReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
