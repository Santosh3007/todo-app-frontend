import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuthenticated, setUsername, setEmail } from "../Redux/Auth";
import { useNavigate } from "react-router-dom";
import { RootState } from "../Redux/store";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     fetch("http://localhost:3001/authorize", {
  //       method: "POST",
  //       headers: { Authorization: `${localStorage.getItem("token")}` },
  //     }).then((response) => {
  //       if (response.status === 200) {
  //         dispatch(setIsAuthenticated(true));

  //         setRes(true);
  //       }
  //     });
  //   }
  // });

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
      console.log("Checking for Authorization");
      await fetch(
        "http://todo-api-env.eba-xaznfkbj.ap-southeast-1.elasticbeanstalk.com/authorize",
        {
          method: "POST",
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      )
        .then((response) => {
          response.json().then((response) => console.log(response));
          if (response.status === 200) {
            dispatch(setIsAuthenticated(true));
            return true;
          } else if (response.status === 401) {
            logout();
            navigate("/login");
          }
        })
        .catch((error) => console.log(error));
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
