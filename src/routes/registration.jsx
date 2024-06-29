import React, { useState } from "react";
import { useNavigate, useLocation, Form } from "react-router-dom";

import { write_local_userdata } from "../utils/read_store";
import axios from "axios";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { Role } from "../utils/consts";
function Registration() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = location.state.role;

  const [emaili, setEmail] = useState("");
  const [passwordi, setPassword] = useState("");
  const [confirm_passwordi, setConfirmPassword] = useState("");
  const [username, setUserName] = useState("");

  function handleSubmit(e) {
    if (confirm_passwordi != passwordi) {
      alert("password and confirm_passwrd do not match");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUserName("");
      return;
    }

    console.log("sending request role: ", role);
    axios
      .post("http://127.0.0.1:3001/signup", {
        user: {
          email: emaili,
          password: passwordi,
          name: username,
          role_id: role,
        },
      })
      .then((response) => {
        if (response.data.status.code === 200) {
          const s = {
            user: response.data.user,
            token: response.headers.authorization,
          };
          write_local_userdata(s);
          alert("Registration Scuccessful !!!");
          navigate("/dashboard");
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.log("Registration error", error);
        window.location.reload();
      });

    e.preventDefault();
  }

  return (
    <div>
      <Form>
        <Box
          display="flex"
          alignItems="center"
          margin="50px auto"
          marginBottom={0}
          minWidth="350px"
          flexDirection="column"
        >
          <Stack spacing={2} minWidth="250px">
            <Typography component="h3" variant="h3">
              {`${Role[role - 1]} Registration`}
            </Typography>
            <TextField
              required
              id="Name"
              label="Name"
              name="Name"
              value={username}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
            <TextField
              required
              id="emailid"
              label="Email"
              name="email"
              value={emaili}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              required
              id="passid"
              label="Password"
              name="password"
              type="password"
              value={passwordi}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <TextField
              required
              id="conf_passid"
              label="Confirm_Password"
              name="confirm_password"
              type="password"
              value={confirm_passwordi}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            <Button variant="contained" type="submit" onClick={handleSubmit}>
              Register
            </Button>
            <Button
              variant="text"
              margin="10px auto"
              onClick={() => {
                navigate(-1);
              }}
            >
              ---Back---
            </Button>
          </Stack>
        </Box>
      </Form>
    </div>
  );
}
export default Registration;
