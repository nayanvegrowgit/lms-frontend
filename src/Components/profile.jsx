import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";

import { read_local, write_local } from "../utils/read_store";
import { logout } from "../utils/logout_login";

const ProfileSection = () => {
  const roles = ["Admin", "Librarian", "Member"];
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const userData = read_local("localstate");

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = (e) => {
    logout()
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          write_local(null);
          alert("Logout Scuccessful !!!!!!!!!!!!!!!!");
          navigate("/loginpage");
        }
      })
      .catch((error) => {
        write_local(null);
        console.log("Logout Error!!!", error);
        navigate("/loginpage");
      });
    e.preventDefault();
  };

  return (
    <div>
      <Grid display={"flex"} flexDirection={"row-reverse"}>
        <IconButton ref={menuRef} onClick={handleProfileClick}>
          <Avatar sx={{ bgcolor: deepPurple[500] }}>
            {userData?.user?.name[0]}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem>
            <Typography variant="body2">{userData?.user?.name}</Typography>
          </MenuItem>
          <MenuItem>
            <Typography variant="body2">{userData?.user?.email}</Typography>
          </MenuItem>
          <MenuItem>
            <Typography variant="body2">
              {roles[userData?.user?.role_id - 1]}
            </Typography>
          </MenuItem>
          <MenuItem variant="body2">
            {
              <Button
                variant="contained"
                onClick={(e) => {
                  handleLogoutClick(e);
                }}
              >
                Logout
              </Button>
            }
          </MenuItem>
          {/* Add more items for your desired profile details */}
        </Menu>
      </Grid>
    </div>
  );
};
export default ProfileSection;
