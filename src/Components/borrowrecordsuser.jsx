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

function BorrowRecordsUser() {
  const userData = read_local_userdata();
  const navigate = useNavigate();
  const [listItems, setlistItems] = useState([]);
  const [reload, setReload] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:8080/borrowedbooks", {
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
  }, [reload]);

  //const filtered = listItems.filter(
  //(item) => console.log(item)
  // item.title.toLowerCase().includes(searchText.toLowerCase()) ||
  // item.publication.toLowerCase().includes(searchText.toLowerCase()) ||
  // item.genre.toLowerCase().includes(searchText.toLowerCase())
  // );
  const handleReturnBook = (BorrRec) => {
    console.log("record to updatre : ", BorrRec);
    const br = {
      id: BorrRec.br_id,
    };
    console.log("data sent :: to return book ", br);
    const headers = {
      Authorization: String(userData?.token),
      "Content-Type": "application/json",
    };
    console.log("senging get req to http://localhost:8080/borrow/return");
    axios
      .post("http://localhost:8080/borrow/return", br, { headers })
      .then((response) => {
        console.log("responce :", response);
        if (response?.data) {
          alert("Successful!");
          setReload(!reload);
        }
      })
      .catch((error) => {
        console.log("error : ", error);
        alert(
          `error status: ${error?.request?.status}  :message: ${error?.request?.statusText} `
        );
        if (error.response?.data?.error == "Signature has expired") {
          write_local_userdata(null);
          navigate("/loginpage");
        }
      });
  };
  return (
    <div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left" colSpan={10}>
                  <Typography fontSize={28}>BorrowRecords</Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow>
                {[
                  "BrID",
                  "Book_Id",
                  "Title",
                  "Author",
                  "date_of_issue",
                  "date_of_return",
                  "Action",
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
                      {br.book_id}
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
                    <StyledTableCell>
                      {br.date_of_return == "" ? (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            {
                              console.log("br button : ", br);
                            }
                            handleReturnBook(br);
                            e.preventDefault();
                          }}
                        >
                          Return
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          disabled
                        >
                          Return
                        </Button>
                      )}
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
