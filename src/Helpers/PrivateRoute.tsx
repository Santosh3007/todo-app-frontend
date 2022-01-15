import { Route, Navigate, RouteProps } from "react-router-dom";
import { RootState } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import Login from "../Routes/Login";
import { setIsAuthenticated } from "../Redux/Auth";
import React, { useEffect } from "react";
import { render } from "@testing-library/react";
import useAuth from "../Hooks/useAuth";
export { PrivateRoute };

interface ProtectedRouteProps extends RouteProps {
  path: string;
  component: any;
}

async function PrivateRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch();
  useAuth().checkToken();
  return useAuth() ? children : <Navigate to="/login" />;
  // return <>{isAuthenticated ? children : <Navigate to="/" />}</>;
  // if (isAuthenticated) {
  //   return children;
  // } else {
  //   return <Navigate to="/" />;
  // }
  // return res ? children : <Navigate to="/" />;
}

export default PrivateRoute;
//DELETE THIS WHOLE ASS THING
