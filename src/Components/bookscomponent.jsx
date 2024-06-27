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
import { read_local, write_local } from "../utils/read_store";

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
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  align: "right",
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: 60,
  width: 200,
  lineHeight: "60px",
  marginBottom: "5px",
}));

function BookPage() {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [listItems, setlistItems] = useState([]);
  const userData = read_local();

  useEffect(() => {
    console.log("senging get req to http://localhost:8080/gettotal");
    axios
      .get("http://localhost:8080/gettotal", {
        headers: {
          Authorization: String(userData?.token), // Edit the authorization key here
        },
      })
      .then((response) => {
        console.log("responce : ", response?.data);
      })
      .catch((error) => {
        console.log(
          "error in fetching book data : ",
          error.response?.data?.error
        );
        if (error.response?.data?.error == "Signature has expired") {
          write_local(null);
          navigate("/loginpage");
        }
      });

    console.log("senging get req to http://localhost:8080/allbook");
    const data = {
      offset: offset,
      limit: limit,
    };

    axios
      .post("http://localhost:8080/allbook", data, {
        headers: {
          Authorization: String(userData?.token), // Edit the authorization key here
        },
      })
      .then((response) => {
        console.log("responce : ", response.data.books);
        setlistItems(response.data.books);
      })
      .catch((error) => {
        console.log(
          "error in fetching book data : ",
          error.response?.data?.error
        );
        if (error.response?.data?.error == "Signature has expired") {
          write_local(null);
          navigate("/loginpage");
        }
      });
  }, []);

  useEffect(() => {
    if (listItems?.length > 0) {
      const sum = listItems.reduceRight(
        (accumulator, currentValue, index, array) =>
          accumulator + currentValue.total,
        0
      );
      console.log("sum :: ", sum);
    }
  }, [listItems]);

  return (
    <div>
      <Box rowGap={2} display={"flex"} justifyContent={"flex-end"} gap="5px">
        <Item key={1} elevation={2}>
          {`elevation=2`}
        </Item>
        <Item key={2} elevation={1}>
          {`elevation=2`}
        </Item>
        <Item key={3} elevation={2}>
          {`elevation=2`}
        </Item>
        <Item key={4} elevation={1}>
          {`elevation=2`}
        </Item>
      </Box>
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
                  {
                    if (userData?.user?.role_id == 3 && labletext == "Total") {
                    } else {
                      return (
                        <StyledTableCell key={labletext} align="center">
                          {labletext}
                        </StyledTableCell>
                      );
                    }
                  }
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {listItems?.map((book) => {
                return (
                  <StyledTableRow key={book.id}>
                    <StyledTableCell align="center">{book.id}</StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {book.title}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {book.author}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {book.publisher}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {book.publication_date}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {book.edition}
                    </StyledTableCell>
                    <StyledTableCell align="center" scope="row">
                      {book.genre}
                    </StyledTableCell>

                    {userData?.user?.role_id != 3 && (
                      <StyledTableCell align="center" scope="row">
                        {book.total}
                      </StyledTableCell>
                    )}
                    {/*setBookCount([
                      bookcount[0] + book.total,
                      bookcount[1] + book.available,
                    ])*/}
                    <StyledTableCell align="center" scope="row">
                      {book.available}
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
      book_id: book.id,
      user_id: userData?.user?.id,
      date_of_issue: my_date(),
      date_of_return: "",
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
          navigate(0);
        }
      })
      .catch((error) => {
        alert(
          `error status: ${error?.request?.status}  :message: ${error?.response?.data?.error} `
        );
        if (error.response?.data?.error == "Signature has expired") {
          write_local(null);
          navigate("/loginpage");
        }
        navigate(0);
      });
  };

  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const [bookData, setBookData] = useState(book);

  const handleFormChange = (event) => {
    console.log("event.target.name  ", event?.target?.name);
    console.log("event.target.value  ", event?.target?.value);
    setBookData({ ...bookData, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = () => {
    console.log("Submitting updated book data:", bookData);
  };
  //{console.log(`book :`, book)}
  return (
    <>
      {userData?.user?.role_id == 3 ? (
        book?.available > 0 ? (
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
                Book : {bookData.title}
              </Typography>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  label="Title"
                  name="title"
                  value={bookData.title}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Author"
                  name="author"
                  value={bookData.author}
                  onChange={handleFormChange}
                  fullWidth
                />
                <TextField
                  label="Edition"
                  name="edition"
                  type="number"
                  value={bookData.edition}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Publisher"
                  name="publisher"
                  value={bookData.publisher}
                  onChange={handleFormChange}
                  fullWidth
                />
                <TextField
                  label="Publication Date"
                  name="publicationDate"
                  type="date"
                  value={bookData.publicationDate}
                  onChange={handleFormChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Genre"
                  name="genre"
                  value={bookData.genre}
                  onChange={handleFormChange}
                  fullWidth
                />
                <Button variant="contained" type="submit" color="primary">
                  Update Book
                </Button>
              </form>
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
