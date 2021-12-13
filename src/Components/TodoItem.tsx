import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { item } from "../Interfaces";
import EditIcon from "@mui/icons-material/Edit";
import { RootState } from "../Redux/store";
import { useSelector, useDispatch } from "react-redux";
import { setTasks } from "../Redux/Misc";
import { editTask } from "../Redux/NewTaskSlice";

const useStyles = makeStyles({
  paper: {
    margin: "1em",
    padding: "2em",
    textAlign: "justify",
    maxWidth: 600,
  },
  tag: {
    margin: "1em",
    padding: "0.8em",
    textAlign: "justify",
  },
});

const TodoItem = (item: item) => {
  const classes = useStyles();
  const api_url = useSelector((state: RootState) => state.misc.apiUrl);
  const tasks = useSelector((state: RootState) => state.misc.tasks);
  const dispatch = useDispatch();

  const handleDelete = async (id: number) => {
    let deleteUrl = api_url + `/tasks/${id}`;
    await fetch(deleteUrl, {
      method: "DELETE",
    })
      .then(() => {
        dispatch(setTasks(tasks.filter((x: item) => x.id !== item.id))); //Removes the deleted element from the state
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Paper elevation={3} className={classes.paper} sx={{ borderRadius: 20 }}>
        <Grid container rowSpacing={1} margin={2} alignItems="center">
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h5" component="div">
                  {item.title}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {item.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.deadline.toString()}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Paper
              elevation={2}
              className={classes.tag}
              sx={{ borderRadius: 8, backgroundColor: "#E480F6" }}
            >
              {item.tag}
            </Paper>
          </Grid>
          <Grid item>
            <Button
              color="inherit"
              size="medium"
              onClick={() => dispatch(editTask(item))}
              startIcon={<EditIcon style={{ color: "primary" }} />}
            ></Button>
          </Grid>
          <Grid item>
            <Button
              color="inherit"
              size="medium"
              onClick={() => handleDelete(item.id)}
              startIcon={<DeleteOutlineIcon style={{ color: "red" }} />}
            ></Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default TodoItem;
