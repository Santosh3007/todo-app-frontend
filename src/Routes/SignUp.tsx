import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import { RootState } from "../Redux/store";
import { setIsAuthenticated } from "../Redux/Auth";
import { setCustomSnackbar, setErrorSnackbar } from "../Redux/Misc";
import background from "../images/background.jpg";
import logo from "../images/logo1.png";
import { Typography } from "@mui/material";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCfmPassword, setShowCfmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCfm, setPasswordCfm] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowCfmPassword = () => {
    setShowPassword(!showCfmPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formSubmit(e.target);
  };

  const formSubmit = async (formData) => {
    let data = new FormData(formData);
    await fetch(
      "http://todo-api-env.eba-xaznfkbj.ap-southeast-1.elasticbeanstalk.com/users",
      {
        method: "POST",
        mode: "cors",
        body: data,
      }
    )
      .then((response) => {
        return response.status >= 400
          ? Promise.reject("error")
          : response.json();
      })
      .then((response) => {
        if (response.auth_token) {
          localStorage.setItem("token", response.auth_token);
          dispatch(setIsAuthenticated(true));
          dispatch(
            setCustomSnackbar({
              message: "Account Created Successfully!",
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
              <Grid item textAlign="center" style={{ marginBottom: "1em" }}>
                <Typography variant="h3" style={{ fontFamily: "Merriweather" }}>
                  Get It Done
                </Typography>
                <Typography
                  variant="body1"
                  style={{ fontFamily: "Merriweather" }}
                >
                  Now or Never
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  value={username}
                  label="Username"
                  name="user[name]"
                  onChange={(e) => {
                    e.preventDefault();
                    setUsername(e.target.value);
                  }}
                  style={{ margin: "0.5em", width: "260px" }}
                />
              </Grid>
              <Grid item>
                <TextField
                  value={email}
                  label="Email"
                  name="user[email]"
                  onChange={(e) => {
                    e.preventDefault();
                    setEmail(e.target.value);
                  }}
                  style={{ margin: "0.5em", width: "260px" }}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  label="Password"
                  name="user[password]"
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
                  style={{ margin: "0.5em" }}
                />
              </Grid>
              <Grid item>
                <TextField
                  error={!isPasswordMatch}
                  helperText={!isPasswordMatch ? "Passwords do not match." : ""}
                  id="outlined-adornment-passwordcfm"
                  type={showCfmPassword ? "text" : "password"}
                  value={passwordCfm}
                  name="user[password_confirmation]"
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
                          onClick={handleClickShowCfmPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  label="Confirm Password"
                  style={{ margin: "0.5em" }}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  type="submit"
                  style={{ margin: "1em" }}
                >
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
