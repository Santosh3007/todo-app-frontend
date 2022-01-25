import { useState, useEffect } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Grid from "@mui/material/Grid";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, Outlet } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import CustomSnackbar from "../Components/CustomSnackbar";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const { checkToken, logout } = useAuth();
  useEffect(() => {
    checkToken();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const iconListTop = (index: number) => {
    switch (index) {
      case 0:
        return (
          <Link to="/home">
            <HomeIcon style={{ fontSize: "300%", color: "black" }} />
          </Link>
        );
      case 1:
        return (
          <Link to="/tasks">
            <ListAltOutlinedIcon style={{ fontSize: "300%", color: "black" }} />
          </Link>
        );
      case 2:
        return (
          <Link to="/completed">
            <AssignmentTurnedInIcon
              style={{ fontSize: "300%", color: "black" }}
            />
          </Link>
        );
      default:
        return <InboxIcon style={{ fontSize: "300%", color: "black" }} />;
    }
  };

  const iconListBottom = (index: number) => {
    switch (index) {
      case 0:
        return (
          <Link to="/account">
            <ManageAccountsIcon style={{ fontSize: "300%", color: "black" }} />
          </Link>
        );
      case 1:
        return (
          <Link to="/login" onClick={logout}>
            <LogoutIcon style={{ fontSize: "300%", color: "black" }} />;
          </Link>
        );
      default:
        return <LogoutIcon style={{ fontSize: "300%", color: "black" }} />;
    }
  };

  return (
    <>
      <Box
        style={{
          display: "flex",
        }}
      >
        <CssBaseline />

        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            {open ? (
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
              >
                <MenuIcon fontSize="large" />
              </IconButton>
            )}
          </DrawerHeader>
          <Divider />
          <List style={{ justifyContent: "center" }}>
            {["Home", "Upcoming Tasks", "Completed"].map((text, index) => (
              <ListItem button key={text} style={{ justifyContent: "center" }}>
                <ListItemIcon
                  style={{ marginRight: "1rem", marginLeft: "1rem" }}
                >
                  {iconListTop(index)}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List
            style={{
              //  position: "absolute",
              bottom: "0px",
              justifyContent: "center",
            }}
          >
            <Divider />
            {["Account", "Log Out"].map((text, index) => (
              <ListItem
                button
                key={text}
                style={{ justifyContent: "center", textAlign: "left" }}
              >
                <ListItemIcon
                  style={{ marginRight: "1rem", marginLeft: "1rem" }}
                >
                  {iconListBottom(index)}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Outlet />
        <CustomSnackbar />
      </Box>
    </>
  );
}
