import axios from "axios";
import { useNavigate } from "react-router-dom";
import { read_local_userdata } from "./read_store";

export function logout() {
  const userData = read_local_userdata();
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
export function handleSessionExpiry() {
  const navigate = useNavigate();
  write_local_userdata(null);
  alert("Session expiired please login again");
  navigate("/loginpage");
}
