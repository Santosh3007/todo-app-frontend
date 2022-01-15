import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { item } from "../Interfaces";
import { useSelector, useDispatch } from "react-redux";
import { setTag } from "../Redux/NewTaskSlice";
import { RootState } from "../Redux/store";

const filter = createFilterOptions<TagOptionType>();

export default function TagPicker(props: { typeOfTask: string }) {
  const api_url = useSelector((state: RootState) => state.misc.apiUrl);
  const tag = useSelector((state: RootState) => state.newTask.tag);
  const dispatch = useDispatch();

  const [tags, setTags] = useState<TagOptionType[]>([]);
  function onlyUnique(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
  }

  const getTasks = () => {
    fetch(api_url + "/tasks", {
      headers: { Authorization: `${localStorage.getItem("token")}` },
    })
      .then((response) => response.json())
      .then((response_items: item[]) => {
        setTags(
          //To retrieve tags from all tasks and filter out unique values
          response_items
            .map((item: item) => item.tag)
            .filter(onlyUnique)
            .map((tag: string) => {
              return {
                title: tag,
              };
            })
        );
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <React.Fragment>
      <Autocomplete
        value={tag}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            //When user clicks enter after typing new tag
            setTimeout(() => {
              dispatch(setTag(newValue));
            });
          } else if (newValue && newValue.inputValue) {
            //When user clicks on Add new tag in dropdown menu
            dispatch(setTag(newValue.inputValue));
          } else {
            // Choosing option from dropdown or closing
            newValue ? dispatch(setTag(newValue.title)) : dispatch(setTag(""));
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            //To display option of adding whatever user has typed so far
            filtered.push({
              inputValue: params.inputValue,
              title: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        id="tag-picker"
        options={tags}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.title;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => <li {...props}>{option.title}</li>}
        sx={{ width: 300 }}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tag"
            id="tag_input"
            type="text"
            name={props.typeOfTask + "[tag]"}
          />
        )}
      />
    </React.Fragment>
  );
}

interface TagOptionType {
  inputValue?: string;
  title: string;
}
