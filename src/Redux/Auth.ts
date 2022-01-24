import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface miscState {
  apiUrl: String;
  isAuthenticated: boolean;
  userId: number;
  username: String;
  email: String;
  token: String;
}

const initialState: miscState = {
  apiUrl:
    "http://todo-api-env.eba-xaznfkbj.ap-southeast-1.elasticbeanstalk.com/api/v1",
  isAuthenticated: false,
  userId: 0,
  username: "",
  email: "",
  token: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<number>) => {
      state.userId = action.payload;
    },
    setUsername: (state, action: PayloadAction<String>) => {
      state.username = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setEmail: (state, action: PayloadAction<String>) => {
      state.email = action.payload;
    },
    setToken: (state, action: PayloadAction<String>) => {
      state.token = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserId, setIsAuthenticated, setUsername, setEmail } =
  authSlice.actions;
export default authSlice.reducer;
