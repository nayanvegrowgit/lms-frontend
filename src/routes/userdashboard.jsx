import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { Box } from "@mui/material";
import { read_local } from "../utils/read_store";
import ClippedDrawer from "../Components/clippeddrawer";

const UserDashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userData = read_local();
    if (!userData) {
      navigate("/loginpage");
    }
  }, []);
  return (
    <div>
      <Box position={"fixed"}>
        <ClippedDrawer />
      </Box>
      <Outlet />
    </div>
  );
};
export default UserDashboard;
