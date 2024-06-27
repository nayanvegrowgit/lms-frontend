import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { read_local, write_local } from "../utils/read_store";
import { login } from "../utils/logout_login";

export default function LoginPage() {
  const [email, setEmailInput] = useState("");
  const [password, setPasswordInput] = useState("");
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setUserData(read_local());
    console.log("userdata in login page  :: ", userData);
    if (userData?.token && userData?.user?.id) {
      navigate("/app/dashboard");
    }
  }, []);

  function handleSubmit(e) {
    console.log("sending login request : ");

    login(email, password)
      .then((response) => {
        if (response.data.status.code === 200) {
          const s = {
            user: response.data.status.data.user,
            token: response.headers.authorization,
          };
          write_local(s);
          console.log("wrote : ", s);
          navigate("/app/dashboard");
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        alert(`Login error, ${error}`);
        if (error.response?.data?.error == "Signature has expired") {
          write_local(null);
          navigate("/loginpage");
        }
        window.location.reload();
      });
    //login(email, password);
    e.preventDefault();
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        minWidth: "300px",

        backgroundColor: "background.paper", // Use Material UI theme palette
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "background.secondary", // Use Material UI theme palette
          padding: 4,
          borderRadius: 4,
        }}
      >
        <Stack spacing={2} minWidth={"300px"}>
          <Typography component="h3" variant="h3">
            Login
          </Typography>
          <TextField
            required
            id="emailid"
            label="Email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmailInput(e.target.value);
            }}
          />
          <TextField
            required
            id="passid"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPasswordInput(e.target.value);
            }}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Login
          </Button>
        </Stack>
        <Button
          variant="text"
          margin="10px auto"
          onClick={() => navigate("/registration", { state: { role: 3 } })}
        >
          New User?
        </Button>
      </Box>
    </Box>
  );
}
