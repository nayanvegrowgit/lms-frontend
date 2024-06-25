import axios from "axios";

import { read_local } from "./read_store";

export function logout() {
  const userData = read_local();
  const responce = axios.delete("http://localhost:3001/logout", {
    headers: {
      Authorization: String(userData.token), // Edit the authorization key here
    },
  });
  return responce;
}

export function login(email, password) {
  const responce = axios.post("http://127.0.0.1:3001/login", {
    user: {
      email: email,
      password: password,
    },
  });
  return responce;
}
