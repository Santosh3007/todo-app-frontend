import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import PrivateRoute from "./Helpers/PrivateRoute";
import App from "./App";
import Account from "./Routes/Account";
import Login from "./Routes/Login";
import Drawer from "./Drawer/Drawer";
import SignUp from "./Routes/SignUp";
import TodoList from "./Components/TodoList";
import store from "./Redux/store";
import { Provider } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Drawer />}>
            <Route path="home" element={<TodoList completed={false} />} />
            <Route path="completed" element={<TodoList completed={true} />} />
            <Route path="account" element={<h1>Account Management</h1>} />
          </Route>
          <Route path="*" element={<h1>Error 404! Try again!</h1>} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
