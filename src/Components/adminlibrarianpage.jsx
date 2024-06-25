import React from "react";
import { useState, useEffect } from "react";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  Button,
  Table,
  TableBody,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import axios from "axios";
import { read_local, write_local } from "../utils/read_store";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/logout_login";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function AdminLibrarianPage() {
  const userData = read_local();
  const [listItems, setlistItems] = useState([]);
  const navigate = useNavigate();
  const hangleAddLibrarian = (e) => {
    navigate("admin/librarian/registration");
  };
  const handlelogout = () => {
    logout()
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          write_local("localstate", null);
          alert("Logout Scuccessful !!!!!!!!!!!!!!!!");
          navigate("/loginpage");
        }
      })
      .catch((error) => {
        write_local("localstate", null);
        console.log("Logout Error!!!", error);
        navigate("/loginpage");
      });
  };
  useEffect(() => {
    axios
      .get("http://localhost:3001/admin/librarians", {
        headers: {
          Authorization: String(userData?.token), // Edit the authorization key here
        },
      })
      .then((response) => {
        console.log("responce : ", response?.data);
        setlistItems(response?.data?.data);
      })
      .catch((error) => {
        alert(
          `Failed to load data : 
          ${error?.response?.data?.message} 
          loging you out!`
        );
        handlelogout();
      });
  }, []);

  return (
    <div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" colSpan={5}>
                  <h3>Books</h3>
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell>{"ID"}</StyledTableCell>
                <StyledTableCell>{"Name"}</StyledTableCell>
                <StyledTableCell>{"Email"}</StyledTableCell>
                <StyledTableCell>{"Action"}</StyledTableCell>
                <StyledTableCell>
                  {
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        hangleAddLibrarian(e);
                      }}
                    >
                      Add
                    </Button>
                  }
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listItems?.map((librarian) => {
                return (
                  <StyledTableRow key={librarian.id}>
                    <StyledTableCell align="right" scope="row">
                      {librarian.id}
                    </StyledTableCell>
                    <StyledTableCell>{librarian.name}</StyledTableCell>
                    <StyledTableCell>{librarian.email}</StyledTableCell>

                    <StyledTableCell>
                      <Button variant="contained" size="small" color="primary">
                        Promote
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        disabled
                      >
                        Delete
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default AdminLibrarianPage;
