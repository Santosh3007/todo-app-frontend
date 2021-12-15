import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Drawer from "./Drawer/Drawer";
import Account from "./Routes/Account";
import TodoList from "./Components/TodoList";
import store from "./Redux/store";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Drawer />}>
            <Route index element={<TodoList completed={false} />} />
            <Route path="home" element={<TodoList completed={false} />} />
            <Route path="completed" element={<TodoList completed={true} />} />
            <Route path="account" element={<Account />} />
          </Route>
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <h1>Error 404! There's nothing here!</h1>
              </main>
            }
          />
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
