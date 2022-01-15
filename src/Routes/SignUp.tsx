import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import { RootState } from "../Redux/store";
import { setIsAuthenticated } from "../Redux/Auth";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCfm, setPasswordCfm] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const dispatch = useDispatch();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(e.target);
    formSubmit(e.target);
  };

  const formSubmit = async (formData) => {
    let data = new FormData(formData);
    console.log(Array.from(data));
    await fetch("http://localhost:3001/authenticate", {
      method: "POST",
      mode: "cors",
      body: data,
    })
      .then((response) => {
        if (response.status === 401) {
          dispatch(setIsAuthenticated(false));
        }
        console.log(response);
        return response.json();
      })
      .then((response) => {
        localStorage.setItem("token", response.auth_token);
        if (response.auth_token) {
          dispatch(setIsAuthenticated(true));
          navigate("/home");
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <>
      <Outlet />
      <Grid
        container
        spacing={0}
        alignItems="center"
        style={{
          minHeight: "100vh",
          minWidth: "93%", //100% make it once it is alone without drawer
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper>
          <form onSubmit={handleSubmit} id="task_form">
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <TextField
                  value={username}
                  label="Username"
                  name="username"
                  onChange={(e) => {
                    e.preventDefault();
                    setUsername(e.target.value);
                  }}
                  style={{ margin: "1em" }}
                />
              </Grid>
              <Grid item>
                <TextField
                  value={email}
                  label="Email"
                  name="email"
                  onChange={(e) => {
                    e.preventDefault();
                    setEmail(e.target.value);
                  }}
                  style={{ margin: "1em" }}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  label="Password"
                  name="password"
                  onChange={(e) => {
                    e.preventDefault();
                    setPassword(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  style={{ margin: "1em" }}
                />
              </Grid>
              <Grid item>
                <TextField
                  error={!isPasswordMatch}
                  helperText={!isPasswordMatch ? "Passwords do not match." : ""}
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={passwordCfm}
                  name="password_confirmation"
                  onChange={(e) => {
                    e.preventDefault();
                    setPasswordCfm(e.target.value);
                    setIsPasswordMatch(e.target.value === password);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  label="Confirm Password"
                  style={{ margin: "1em" }}
                />
              </Grid>
              <Grid item>
                <Button variant="outlined" type="submit">
                  Create new Account
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </>
  );
};

export default SignUp;