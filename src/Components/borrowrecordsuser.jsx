import React from "react";
import { useState, useEffect } from "react";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Table,
  TableBody,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import axios from "axios";
import { read_local } from "../utils/read_store";
import { useNavigate } from "react-router-dom";
const StyledList = styled(List)`
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap if needed */
  justify-content: space-between; /* Distribute items evenly */
  margin: 0; /* Remove default margin */
  padding: 0; /* Remove default padding */
`;
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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function BorrowRecordsUser() {
  const userData = read_local();
  const navigate = useNavigate();
  const [listItems, setlistItems] = useState([]);

  useEffect(() => {
    console.log("senging get req to http://localhost:8080/book/");
    axios
      .get("http://localhost:8080/borrowedbooks", {
        headers: {
          Authorization: String(userData?.token), // Edit the authorization key here
        },
      })
      .then((response) => {
        console.log("responce : ", response.data.books);
        setlistItems(response.data.books);
      })
      .catch((error) => {
        alert(
          `error status: ${error?.request?.status}  :message: ${error?.response?.data?.error} `
        );
        navigate(-1);
      });
  }, []);

  //const filtered = listItems.filter(
  //(item) => console.log(item)
  // item.title.toLowerCase().includes(searchText.toLowerCase()) ||
  // item.publication.toLowerCase().includes(searchText.toLowerCase()) ||
  // item.genre.toLowerCase().includes(searchText.toLowerCase())
  // );

  return (
    <div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" colSpan={10}>
                  <h3>Books</h3>
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">{"ID"}</StyledTableCell>
                <StyledTableCell align="center">{"BookId"}</StyledTableCell>
                <StyledTableCell align="center">{"Author"}</StyledTableCell>
                <StyledTableCell align="center">{"Publisher"}</StyledTableCell>
                <StyledTableCell align="center">
                  {"PublicationDate"}
                </StyledTableCell>
                <StyledTableCell align="center">{"Edition"}</StyledTableCell>
                <StyledTableCell align="center">{"Genre"}</StyledTableCell>
                <StyledTableCell align="center">{"Total"}</StyledTableCell>
                <StyledTableCell align="center">{"Available"}</StyledTableCell>
                <StyledTableCell align="center">{"Action"}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listItems?.map((book) => {
                return (
                  <StyledTableRow key={book.ID}>
                    <StyledTableCell align="center">{book.ID}</StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {book.Title}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {book.Author}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {book.Publisher}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {book.PublicationDate}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {book.Edition}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {book.Genre}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {book.Total}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {book.Available}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button variant="contained" size="small" color="primary">
                        Return
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

export default BorrowRecordsUser;
