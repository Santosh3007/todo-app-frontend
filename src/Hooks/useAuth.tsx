import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsAuthenticated,
  setUsername,
  setEmail,
  setUserId,
} from "../Redux/Auth";
import { useNavigate } from "react-router-dom";
import { RootState } from "../Redux/store";
import { setErrorSnackbar } from "../Redux/Misc";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const logout = () => {
    dispatch(setIsAuthenticated(false));
    dispatch(setUsername(""));
    dispatch(setEmail(""));
    localStorage.removeItem("token");
    navigate("/login");
  };

  const checkToken = async () => {
    if (isAuthenticated) {
      return;
    } else if (localStorage.getItem("token")) {
      await fetch(process.env.REACT_APP_API_URL + "/authorize", {
        method: "POST",
        headers: { Authorization: `${localStorage.getItem("token")}` },
      })
        .then((response) => {
          if (response.status === 200) {
            response.json().then((response) => {
              dispatch(setIsAuthenticated(true));
              dispatch(setUsername(response.user.name));
              dispatch(setEmail(response.user.email));
              dispatch(setUserId(response.user.id));
            });
            return true;
          } else if (response.status === 401) {
            logout();
            navigate("/login");
          }
        })
        .catch((error) => dispatch(setErrorSnackbar()));
    } else {
      navigate("/login");
    }
  };

  const login = (auth_token: string, username: string, email: string) => {
    dispatch(setIsAuthenticated(true));
    localStorage.setItem("token", auth_token);
    dispatch(setUsername(username));
    dispatch(setEmail(email));
  };

  return { logout, login, checkToken };
};

export default useAuth;
