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
import { setCustomSnackbar, setErrorSnackbar } from "../Redux/Misc";
import useAuth from "../Hooks/useAuth";
import background from "../images/background.jpg";
import logo from "../images/logo1.png";
import { Typography } from "@mui/material";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isInvalid, setIsInValid] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const { checkToken } = useAuth();

  const dispatch = useDispatch();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formSubmit(e.target);
  };

  const formSubmit = async (formData) => {
    let data = new FormData(formData);
    await fetch(
      "http://todo-api-env.eba-xaznfkbj.ap-southeast-1.elasticbeanstalk.com/authenticate",
      {
        method: "POST",
        mode: "cors",
        body: data,
      }
    )
      .then((response) => {
        if (response.status === 401) {
          setIsInValid(true);
          dispatch(setIsAuthenticated(false));
          dispatch(
            setCustomSnackbar({
              message: "Invalid Credentials! Please Try Again.",
              type: "error",
            })
          );
        }
        return response.status >= 400
          ? Promise.reject("error")
          : response.json();
      })
      .then((response) => {
        localStorage.setItem("token", response.auth_token);
        if (response.auth_token) {
          dispatch(setIsAuthenticated(true));
          checkToken();
          dispatch(
            setCustomSnackbar({
              message: "Login Success!",
              type: "success",
            })
          );
          navigate("/home");
        }
      })
      .catch((error) => dispatch(setErrorSnackbar()));
  };
  return (
    <>
      <Grid
        container
        spacing={0}
        alignItems="center"
        style={{
          minHeight: "100vh",
          minWidth: "100%",
          display: "flex",
          justifyContent: "center",
          backgroundImage: `url(${background})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundColor: "black",
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
              style={{
                backgroundColor: "rgba(255,255,255,0.13)",
                height: "auto",
                width: "400px",
                position: "absolute",
                top: "30%",
                left: "40%",
                borderRadius: "10px",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255,255,255,0.1)",
                paddingTop: "1rem",
                // padding: "50px 35px",
                boxShadow: "0 0 40px rgba(8,7,16,0.6)",
              }}
            >
              <Grid item textAlign="center">
                <Grid container alignItems="center">
                  <Grid item>
                    <img src={logo} width="45px" height="45px" />
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="h3"
                      style={{
                        fontFamily: "Merriweather",
                        marginLeft: "0.2em",
                        marginRight: "0.5em",
                      }}
                    >
                      Get It Done
                    </Typography>
                  </Grid>
                </Grid>
                <Typography
                  variant="body1"
                  style={{ fontFamily: "Merriweather" }}
                >
                  Now or Never
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  error={isInvalid}
                  value={email}
                  label="Email"
                  name="email"
                  onChange={(e) => {
                    e.preventDefault();
                    setEmail(e.target.value);
                  }}
                  autoComplete="email"
                  style={{ margin: "1em", width: "260px" }}
                />
              </Grid>
              <Grid item>
                <TextField
                  error={isInvalid}
                  helperText={
                    isInvalid ? "Invalid Credentials. Please Try Again." : ""
                  }
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  name="password"
                  autoComplete="current-password"
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
                  label="Password"
                  style={{ margin: "1em" }}
                />
              </Grid>
              <Grid item>
                <Button variant="outlined" type="submit">
                  Login
                </Button>
              </Grid>
              <Grid item style={{ margin: "1rem" }}>
                <Link to="/signup">Don't have an account?</Link>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </>
  );
};

export default Login;
