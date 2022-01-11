import React, { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import Grid from "@mui/material/Grid";
import TodoForm from "./TodoForm";
import SubTodoForm from "./SubtodoForm";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import DateTimePicker from "@mui/lab/DateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Button from "@mui/material/Button";

import { item, subTask } from "../Interfaces";
import { useDispatch, useSelector } from "react-redux";
import { toggleTaskDialogOpen } from "../Redux/NewTaskSlice";
import { setTasks, setSubtasks } from "../Redux/Misc";
import MiniDrawer from "../Drawer/Drawer";
import { RootState } from "../Redux/store";

import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

const compare = (a: item, b: item) => {
  return a.deadline < b.deadline ? -1 : a.deadline > b.deadline ? 1 : 0;
};

function onlyUnique(value: string, index: number, self: string[]) {
  return self.indexOf(value) === index;
}

const TodoList = (props: { completed: boolean }) => {
  // Props indicate whether tasks displayed are completed or not
  const api_url = useSelector((state: RootState) => state.misc.apiUrl);
  const tasks = useSelector((state: RootState) => state.misc.tasks).filter(
    (task) => task.completed === props.completed
  );

  const [searchText, setSearchText] = useState("");
  const [startDeadline, setStartDeadline] = useState<null | Date>();
  const [endDeadline, setEndDeadline] = useState<null | Date>();
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [order, setOrder] = React.useState("");
  const [isFilteredTasks, setIsFilteredTasks] = useState(false); // To check if tasks are filtered

  useEffect(() => {
    getTasks();
  }, []);

  const dispatch = useDispatch();

  const getTasks = () => {
    fetch(api_url + "/tasks")
      .then((response) => response.json())
      .then((response_items: item[]) => {
        dispatch(setTasks(response_items.sort(compare)));
      })
      .catch((error) => console.log(error));
    fetch(api_url + "/subtasks")
      .then((response) => response.json())
      .then((response_items: subTask[]) => {
        dispatch(setSubtasks(response_items.sort(compare)));
      })
      .catch((error) => console.log("here" + error));
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //Handler for onClick event of Filter button
    setAnchorEl(event.currentTarget);
    getTasks(); //Makes sure tasks is unfiltered before searching again
  };

  const handleClose = () => {
    //To close the dropdown menu for filter
    setAnchorEl(null);
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newOrder: string
  ) => {
    setOrder(newOrder);
  };

  const filterTasks = () => {
    let tempTasks = tasks.slice();
    if (order === "descending") {
      tempTasks.reverse();
    }
    if (searchTags.length !== 0) {
      tempTasks = tempTasks.filter(
        (task) => searchTags.indexOf(task.tag) !== -1
      );
    }

    if (endDeadline) {
      tempTasks = tempTasks.filter(
        (task) =>
          new Date(task.deadline).getTime() - 28800000 < endDeadline.getTime()
      );
    }
    if (startDeadline) {
      tempTasks = tempTasks.filter(
        (task) =>
          new Date(task.deadline).getTime() - 28800000 > startDeadline.getTime()
      );
    }
    dispatch(setTasks(tempTasks));
    setIsFilteredTasks(true);
    handleClose();
  };

  const clearSearch = () => {
    getTasks();
    setSearchTags([]);
    setOrder("");
    setStartDeadline(null);
    setEndDeadline(null);
    setSearchText("");
    setIsFilteredTasks(false);
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={2}>
          <MiniDrawer />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-search"
            placeholder="Search"
            type="search"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            style={{ margin: "2em", width: 800, marginLeft: "3.5em" }}
          />
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <FilterAltIcon sx={{ fontSize: 34, margin: "1em" }} />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <Grid>
              <Grid item>
                <TextField
                  id="outlined-search"
                  placeholder="Search"
                  type="search"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  style={{ margin: "1em" }}
                />
              </Grid>
              <Grid item>
                <ToggleButtonGroup
                  color="primary"
                  value={order}
                  exclusive
                  onChange={handleChange}
                  style={{ marginLeft: "1em" }}
                >
                  <ToggleButton value="ascending">Ascending</ToggleButton>
                  <ToggleButton value="descending">Descending</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item>
                <Autocomplete
                  multiple
                  id="tags-filled"
                  value={searchTags}
                  options={tasks.map((task) => task.tag).filter(onlyUnique)}
                  freeSolo
                  onChange={(e, v) => setSearchTags(v)}
                  renderTags={(value: string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Tags"
                      style={{ margin: "1em", width: "auto" }}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                Due After
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    renderInput={(params) => (
                      <TextField
                        id="deadline_input"
                        type="text"
                        name="task[deadline]"
                        // className={classes.dateTimePicker}
                        {...params}
                      />
                    )}
                    value={startDeadline}
                    inputFormat="dd/MM/yyyy hh:mm a"
                    onChange={(newDate: Date | null) => {
                      newDate && setStartDeadline(newDate);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item>
                Due Before
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    renderInput={(params) => (
                      <TextField
                        id="deadline_input"
                        type="text"
                        name="task[deadline]"
                        // className={classes.dateTimePicker}
                        {...params}
                      />
                    )}
                    value={endDeadline}
                    inputFormat="dd/MM/yyyy hh:mm a"
                    onChange={(newDate: Date | null) => {
                      newDate && setEndDeadline(newDate);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Button
                variant="outlined"
                startIcon={<FilterAltIcon />}
                onClick={filterTasks}
              >
                Filter
              </Button>
            </Grid>
          </Menu>

          <Button onClick={clearSearch} disabled={!isFilteredTasks}>
            Clear Search
          </Button>
        </Grid>
        <Grid item>
          <ul>
            {tasks
              .filter((task) =>
                task.title.toLowerCase().includes(searchText.toLowerCase())
              )
              .map((item) => (
                <TodoItem {...item} key={item.id} />
              ))}
          </ul>
          <TodoForm />
          <SubTodoForm />
          <Grid container justifyContent="flex-end">
            <IconButton
              style={{ color: "#E480F6" }}
              onClick={() => {
                dispatch(toggleTaskDialogOpen());
                // console.log(tasks);
              }}
            >
              <AddCircleOutlinedIcon
                sx={{ fontSize: 85 }}
                style={{ color: "" }}
              />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default TodoList;

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
];
