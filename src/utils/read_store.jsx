import { LocalVariable } from "./consts.jsx";
export function write_local_userdata(value) {
  localStorage.setItem(String(LocalVariable), JSON.stringify(value));
}
export function read_local_userdata() {
  const local_val = localStorage.getItem(String(LocalVariable));
  return JSON.parse(local_val);
}
