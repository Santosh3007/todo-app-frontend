import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface miscState {
  apiUrl: String;
  isAuthenticated: boolean;
  username: String;
  email: String;
  token: String;
}

const initialState: miscState = {
  apiUrl:
    "http://todo-api-env.eba-xaznfkbj.ap-southeast-1.elasticbeanstalk.com/api/v1",
  isAuthenticated: false,
  username: "",
  email: "",
  token: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
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
export const { setIsAuthenticated, setUsername, setEmail } = authSlice.actions;
export default authSlice.reducer;
