import { debounce } from "@mui/material";

export const Role = ["Admin", "Libratian", "Member"];
export const LocalVariable = "localstate";
export const CurrentURL = "currenturl";
export function my_date() {
  const date = new Date();
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
  return formattedDate;
}
