import React from "react";
import { useState, useEffect } from "react";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Modal,
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
import { Outlet, useNavigate } from "react-router-dom";

import { my_date } from "../utils/consts";
import { read_local } from "../utils/read_store";
import UpdateBookForm from "../Components/llibrarianaddform";
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

function BookPage() {
  const navigate = useNavigate();
  const [listItems, setlistItems] = useState([]);
  const userData = read_local();

  useEffect(() => {
    console.log("senging get req to http://localhost:8080/book/");
    axios
      .get("http://localhost:8080/book", {
        headers: {
          Authorization: String(userData?.token), // Edit the authorization key here
        },
      })
      .then((response) => {
        console.log("responce : ", response.data.books);
        setlistItems(response.data.books);
      })
      .catch((error) => {
        console.log("error in fetching book data : ", error);
      });
  }, []);

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
                {[
                  "ID",
                  "Title",
                  "Author",
                  "Publisher",
                  "PublicationDate",
                  "Edition",
                  "Genre",
                  "Total",
                  "Available",
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
                      <BookAction book={book} />
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

const BookAction = ({ book }) => {
  const navigate = useNavigate();
  const userData = read_local();

  const handleBorrowBook = (book) => {
    const br = {
      BookID: book.ID,
      UserID: userData?.user?.id,
      DateOfIssue: my_date(),
      DateOfReturn: "",
    };

    console.log("data sent :: to borrow book ", br);
    const headers = {
      Authorization: String(userData?.token),
      "Content-Type": "application/json",
    };
    console.log("senging get req to http://localhost:8080/borrow");
    axios
      .post("http://localhost:8080/borrow", br, { headers })
      .then((response) => {
        if (response?.data?.br) {
          alert("Successful!");
        }
      })
      .catch((error) => {
        alert(
          `error status: ${error?.request?.status}  :message: ${error?.response?.data?.error} `
        );
      });
  };

  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  return (
    <>
      {console.log(`book :`, book)}
      {userData?.user?.role_id == 3 ? (
        book?.Available > 0 ? (
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={(e) => {
              handleBorrowBook(book);
              e.preventDefault();
            }}
          >
            Borrow
          </Button>
        ) : (
          <Button variant="contained" size="small" color="primary" disabled>
            Borrow
          </Button>
        )
      ) : (
        <>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={handleModalOpen}
          >
            Update
          </Button>
          <Modal
            open={open}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Book : {book.Title}
              </Typography>
            </Box>
          </Modal>
        </>
      )}
    </>
  );
};

export default BookPage;
//const filtered = listItems.filter(
//(item) => console.log(item)
// item.title.toLowerCase().includes(searchText.toLowerCase()) ||
// item.publication.toLowerCase().includes(searchText.toLowerCase()) ||
// item.genre.toLowerCase().includes(searchText.toLowerCase())
// );
//<UpdateBookForm />
