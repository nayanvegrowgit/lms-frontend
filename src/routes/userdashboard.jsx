import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import {
  Box,
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";

import { deepPurple } from "@mui/material/colors";

import { read_local, write_local } from "../utils/read_store";
import { logout } from "../utils/logout_login";

import BookPage from "../Components/bookscomponent";

const drawerWidth = 240;
const DrawerOptions = [
  ["Manage Books", "Manage Librarians", "Manage Users", "Borrowing Records"],
  ["Manage Books", "Manage Users", "Borrowing Records"],
  ["Books", "Borrowing History"],
];
const UserDashboard = () => {
  const navigate = useNavigate();
  const userData = read_local();
  useEffect(() => {
    if (!userData) {
      console.log("navigate to login page from dashboard ");
      navigate("/loginpage");
    }
  }, []);

  const roles = ["Admin", "Librarian", "Member"];
  const menuRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleListButtonClick = (role, action) => {
    const expr = role * 10 + action;
    switch (expr) {
      case 10:
      case 20:
        console.log("Manage Book");
        navigate("books");
        break;
      case 11:
        console.log("Manage Librarian");
        break;
      case 12:
      case 21:
        console.log("Manage Users");
        break;
      case 13:
      case 22:
        console.log("Borrowing Records");
        break;
      case 30:
        console.log("Book Issue User");
        navigate("books");
        break;
      case 31:
        navigate("myborrowhistory");
        console.log("Borrowing History User");
        break;
      default:
        console.log(`Sorry, we are out of ${expr}.`);
    }
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
      <Box position={"relative"} sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap component="div">
              Dashboard
            </Typography>
            <Box sx={{ display: "flex", margin: "0px 0px 5px 0px" }}>
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
                      <Typography variant="body2">
                        {userData?.user?.name}
                      </Typography>
                    </MenuItem>
                    <MenuItem>
                      <Typography variant="body2">
                        {userData?.user?.email}
                      </Typography>
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
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {DrawerOptions[userData?.user?.role_id - 1]?.map(
                (text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        handleListButtonClick(userData?.user?.role_id, index);
                      }}
                    >
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                )
              )}
            </List>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, margin: "70px 0px 5px 0px" }}
        >
          <Outlet />
          <Toolbar />
        </Box>
      </Box>
    </div>
  );
};
export default UserDashboard;
