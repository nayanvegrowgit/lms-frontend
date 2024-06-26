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
import { read_local_userdata, write_local_userdata } from "../utils/read_store";
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

function BorrowRecords() {
  const userData = read_local_userdata();
  const navigate = useNavigate();
  const [listItems, setlistItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 5;

  useEffect(() => {
    console.log("senging get req to http://localhost:8080/borrowrecords");
    const data = {
      offset: offset,
      limit: limit,
    };

    axios
      .post("http://localhost:8080/borrowrecords", data, {
        headers: {
          Authorization: String(userData?.token), // Edit the authorization key here
        },
      })
      .then((response) => {
        console.log("responce : ", response?.data);
        setlistItems(response.data?.borrowing_record);
      })
      .catch((error) => {
        alert(
          `error status: ${error?.request?.status}  :message: ${error?.response?.data} `
        );
        if (error.response?.data?.error == "Signature has expired") {
          write_local_userdata(null);
          navigate("/loginpage");
        }
      });
  }, [offset]);

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
                <StyledTableCell align="center" colSpan={8}>
                  <h3>Borrow Records</h3>
                </StyledTableCell>
              </TableRow>
              <TableRow>
                {[
                  "BrID",
                  "User",
                  "Book_Title",
                  "Book_Author",
                  "Date_Of_Issue",
                  "Date_Of_Return",
                ].map((labletext) => {
                  return (
                    <StyledTableCell key={labletext} align="center">
                      {labletext}
                    </StyledTableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {listItems?.map((br) => {
                return (
                  <StyledTableRow key={br.br_id}>
                    <StyledTableCell align="center">{br.br_id}</StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {br.user_name}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {br.title}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {br.author}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {br.date_of_issue}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {br.date_of_return == "" ? "--" : `${br.date_of_return}`}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
              <TableRow>
                <StyledTableCell align="center" colSpan={1}>
                  <Button
                    onClick={(e) => {
                      setOffset(offset - limit);
                      e.preventDefault();
                    }}
                    disabled={offset == 0 ? true : false}
                  >
                    Previous
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="center" colSpan={1}>
                  <Button
                    disabled={
                      listItems
                        ? listItems.length < limit
                          ? true
                          : false
                        : true
                    }
                    onClick={(e) => {
                      setOffset(offset + limit);
                      e.preventDefault();
                    }}
                  >
                    Next
                  </Button>
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default BorrowRecords;
