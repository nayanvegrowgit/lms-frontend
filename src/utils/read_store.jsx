import { LocalVariable } from "./consts.jsx";
export function write_local(value) {
  localStorage.setItem(String(LocalVariable), JSON.stringify(value));
}
export function read_local() {
  const local_val = localStorage.getItem(String(LocalVariable));
  return JSON.parse(local_val);
}
