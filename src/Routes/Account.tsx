import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useApi from "../Hooks/useApi";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { setUsername, setEmail } from "../Redux/Auth";
import { RootState } from "../Redux/store";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { setCustomSnackbar, setErrorSnackbar } from "../Redux/Misc";
import useAuth from "../Hooks/useAuth";
import background from "../images/background.jpg";

const Account = () => {
  const [formUsername, setFormUsername] = useState(
    useSelector((state: RootState) => state.auth.username)
  );
  const email = useSelector((state: RootState) => state.auth.email);
  const [formEmail, setFormEmail] = useState(email);

  const userId = useSelector((state: RootState) => state.auth.userId);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [passwordCfm, setPasswordCfm] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showCfmPassword, setShowCfmPassword] = useState(false);
  const dispatch = useDispatch();
  const { authPatch } = useApi();
  const { checkToken } = useAuth();

  useEffect(() => {
    checkToken();
  });

  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showPassword);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowCfmPassword = () => {
    setShowCfmPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formSubmit(e.target);
  };

  const handlePasswordSubmit = (e) => {
    if (!isPasswordMatch) {
      dispatch(
        setCustomSnackbar({
          message: "Passwords do not match!",
          type: "error",
        })
      );
      return;
    }
    e.preventDefault();
    passwordFormSubmit(e.target);
  };

  const formSubmit = async (formData) => {
    let data = new FormData(formData);
    await authPatch(
      "http://todo-api-env.eba-xaznfkbj.ap-southeast-1.elasticbeanstalk.com/users/" +
        userId,
      data
    )
      .then((response) => {
        dispatch(
          setCustomSnackbar({
            message: "User information updated successfully!",
            type: "success",
          })
        );
        dispatch(setUsername(formUsername));
        dispatch(setEmail(email));
      })
      .catch((error) => dispatch(setErrorSnackbar()));
  };

  const passwordFormSubmit = async (formData) => {
    let data = new FormData(formData);
    await authPatch(
      "http://todo-api-env.eba-xaznfkbj.ap-southeast-1.elasticbeanstalk.com/update_password",
      JSON.stringify({
        old_password: oldPassword,
        password: password,
        password_confirmation: passwordCfm,
      })
    )
      .then((response) => {
        if (response.status === 400) {
          dispatch(
            setCustomSnackbar({
              message: "Incorrect Password! Please try again.",
              type: "error",
            })
          );
        } else if (response.status === 200) {
          dispatch(
            setCustomSnackbar({
              message: "Password changed successfully!",
              type: "success",
            })
          );
          setOldPassword("");
          setPassword("");
          setPasswordCfm("");
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
          backgroundColor: "#d8e2dc",
        }}
      >
        <Paper
          elevation={3}
          style={{
            borderRadius: "10px",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(255,255,255,0.1)",
            paddingTop: "1rem",
            boxShadow: "0 0 40px rgba(8,7,16,0.6)",
          }}
        >
          <Typography variant="h4" style={{ margin: "1.5rem" }}>
            Update User Information
          </Typography>
          <form onSubmit={handleSubmit} id="task_form">
            <Grid container alignItems="center" direction="row">
              <Grid item xs>
                <Grid container direction="column">
                  <Grid item>
                    <TextField
                      id="username_input"
                      label="Username"
                      variant="outlined"
                      type="text"
                      name="user[name]"
                      value={formUsername}
                      onChange={(e) => {
                        e.preventDefault();
                        setFormUsername(e.target.value);
                      }}
                      style={{ margin: "1em" }}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      id="email_input"
                      label="Email"
                      variant="outlined"
                      name="user[email]"
                      value={formEmail}
                      onChange={(e) => {
                        e.preventDefault();
                        setFormEmail(e.target.value);
                      }}
                      style={{ margin: "1em" }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs textAlign="center">
                <Button variant="outlined" type="submit">
                  Update
                </Button>
              </Grid>
            </Grid>
          </form>
          <Divider variant="middle" />

          <Typography variant="h4" style={{ margin: "1.5rem" }}>
            Change Password
          </Typography>
          <form onSubmit={handlePasswordSubmit} id="password_form">
            <Grid container alignItems="center">
              <Grid item>
                <Grid item>
                  <TextField
                    id="outlined-adornment-passwordold"
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    label="Old Password"
                    name="user[old_password]"
                    onChange={(e) => {
                      e.preventDefault();
                      setOldPassword(e.target.value);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowOldPassword}
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
                    style={{ margin: "1em" }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    error={!isPasswordMatch}
                    helperText={
                      !isPasswordMatch ? "Passwords do not match." : ""
                    }
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
                    style={{ margin: "1em" }}
                  />
                </Grid>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  type="submit"
                  style={{ margin: "1.5rem" }}
                >
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </>
  );
};

export default Account;
