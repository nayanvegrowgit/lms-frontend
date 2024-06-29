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
import { read_local_userdata, write_local_userdata } from "../utils/read_store";
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

function ManageUsers() {
  const [listItems, setlistItems] = useState([]);
  const navigate = useNavigate();
  const handleAddMember = (e) => {};
  useEffect(() => {
    const userData = read_local_userdata();
    axios
      .get("http://localhost:3001/listusers", {
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
          `error status: ${error?.request?.status}  :message: ${error?.response?.data?.error} `
        );
        if (error.response?.data?.error == "Signature has expired") {
          write_local_userdata(null);
          navigate("/loginpage");
        }
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
                        handleAddMember(e);
                      }}
                    >
                      Add
                    </Button>
                  }
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listItems?.map((member) => {
                return (
                  <StyledTableRow key={member.id}>
                    <StyledTableCell align="right" scope="row">
                      {member.id}
                    </StyledTableCell>
                    <StyledTableCell>{member.name}</StyledTableCell>
                    <StyledTableCell>{member.email}</StyledTableCell>
                    <StyledTableCell>
                      <Button variant="contained" size="small" color="primary">
                        Update
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button variant="contained" size="small" color="primary">
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

export default ManageUsers;
