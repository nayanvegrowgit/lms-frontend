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
import { read_local_userdata, write_local_userdata } from "../utils/read_store";

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

const StyledFormRow = styled(Paper)(() => ({
  marginBottom: "9px",
}));

function BookPage() {
  const limit = 5;
  const navigate = useNavigate();
  const userData = read_local_userdata();

  const [listItems, setlistItems] = useState([]);
  const [reload, setReload] = useState(false);
  const [searchstring, setSearchString] = useState("");
  const [offset, setOffset] = useState(0);
  const [updatebookopen, setUpdateBookOpen] = useState(false);
  const [addbookopen, setAddBookOpen] = useState(false);
  const [total_num_books, setTotals] = useState([0, 0, 0, 0]);

  const [newbookData, setNewBookData] = useState({
    title: "",
    author: "",
    edition: 0,
    publisher: "",
    publication_date: "",
    genre: "",
    total: 0,
  });

  const [updatebookData, setUpdateBookData] = useState({
    id: 0,
    title: "",
    author: "",
    publisher: "",
    publication_date: "",
    edition: parseInt("0"),
    genre: "",
  });

  const handleBookAddModalOpen = () => setAddBookOpen(true);
  const handleBookAddModalClose = () => setAddBookOpen(false);

  const handleUpdateBookModalOpen = () => setUpdateBookOpen(true);
  const handleUpdateBookModalClose = () => setUpdateBookOpen(false);

  const handleBookAddFormChange = (event) => {
    setNewBookData({ ...newbookData, [event.target.name]: event.target.value });
    event.preventDefault();
  };
  const handleUpdateBookFormChange = (event) => {
    setUpdateBookData({
      ...updatebookData,
      [event.target.name]: event.target.value,
    });
    event.preventDefault();
  };

  useEffect(() => {
    console.log("senging get req to http://localhost:8080/gettotal");
    axios
      .get("http://localhost:8080/gettotal", {
        headers: {
          Authorization: String(userData?.token), // Edit the authorization key here
        },
      })
      .then((response) => {
        setTotals([
          response?.data?.sum?.total,
          response?.data?.sum?.available,
          ...total_num_books.slice(2),
        ]);
      })
      .catch((error) => {
        console.log("error: ", error.message);
        console.log("Request status : ", error.code);
        console.log("Request status : ", error.request.status);
        console.log("get  total Error responce data :: ", error.response?.data);
        if (error.response?.data?.error == "Signature has expired") {
          write_local_userdata(null);
          navigate("/loginpage");
        }
      });

    console.log("senging get req to http://localhost:8080/allbook");
    const data = {
      filter: "%" + searchstring + "%",
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
        setlistItems(response.data.books);
      })
      .catch((error) => {
        console.log("error: ", error.message);
        console.log("Request status : ", error.code);
        if (error.response?.data?.error == "Signature has expired") {
          write_local_userdata(null);
          alert("Session Signature has expired,\nTrylogin again");
          navigate("/loginpage");
        }
      });
  }, [offset, reload]);

  useEffect(() => {
    if (listItems?.length > 0) {
      const local_total = listItems.reduceRight(
        (accumulator, currentValue) => accumulator + currentValue.total,
        0
      );
      const local_available = listItems.reduceRight(
        (accumulator, currentValue) => accumulator + currentValue.available,
        0
      );
      console.log("sum :: ", local_total);
      console.log("av ::", local_available);
      setTotals([...total_num_books.slice(0, 2), local_total, local_available]);
    }
  }, [listItems]);

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
          setReload(!reload);
        }
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
  };

  const handleUpdateBookFormSubmit = () => {
    console.log("Submitting updated book data:", updatebookData);
    const data = {
      id: updatebookData.id,
      title: updatebookData.title,
      author: updatebookData.author,
      publisher: updatebookData.publisher,
      publication_date: updatebookData.publication_date,
      genre: updatebookData.genre,
      edition: parseInt(updatebookData.edition),
    };
    const headers = {
      Authorization: String(userData?.token),
      "Content-Type": "application/json",
    };
    console.log("senging put req to http://localhost:8080/bookupdate");
    axios
      .patch("http://localhost:8080/bookupdate", data, { headers })
      .then((response) => {
        console.log("update book responce : ", response);
        //  setReload(!reload);
      })
      .catch((error) => {
        console.log("error : ", error);
        if (error.response?.data?.error == "Signature has expired") {
          write_local_userdata(null);
          navigate("/loginpage");
        }
      });
  };

  const handleBookAddFormSubmit = () => {
    const data = {
      id: newbookData.id,
      title: newbookData.title,
      author: newbookData.author,
      publisher: newbookData.publisher,
      publication_date: newbookData.publication_date,
      edition: parseInt(newbookData.edition),
      genre: newbookData.genre,
      total: parseInt(newbookData.total),
      available: parseInt(newbookData.total),
    };
    const headers = {
      Authorization: String(userData?.token),
      "Content-Type": "application/json",
    };
    console.log("senging put req to http://localhost:8080/bookcreate");
    axios
      .post("http://localhost:8080/bookcreate", data, { headers })
      .then((response) => {
        if (response?.data) {
          alert("Successful!", response?.data);
        }
        setReload(!reload);
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
  };

  return (
    <div>
      <Box rowGap={2} display={"flex"} justifyContent={"flex-end"} gap="5px">
        <Item key={1} elevation={2}>
          {`Total : ${total_num_books[0]}`}
        </Item>
        <Item key={2} elevation={1}>
          {`Available : ${total_num_books[1]}`}
        </Item>
        <Box display={"flex"} gap={1} elevation={1} height={"50px"}>
          <TextField
            label="Search"
            name="searchtext"
            value={searchstring}
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
            fullWidth
            required
          />
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={(e) => {
              if (searchstring.length > 0) setReload(!reload);
              e.preventDefault();
            }}
          >
            Search
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={(e) => {
              if (searchstring.length > 0) {
                setSearchString("");
                setReload(!reload);
              }
              e.preventDefault();
            }}
          >
            Reset
          </Button>
        </Box>
      </Box>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left" colSpan={10}>
                  <Typography>Books</Typography>
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
                    <StyledTableCell align="center" scope="row">
                      {book.available}
                    </StyledTableCell>

                    <StyledTableCell>
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
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              disabled
                            >
                              Borrow
                            </Button>
                          )
                        ) : (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                setUpdateBookData({
                                  id: book.id,
                                  title: book.title,
                                  author: book.author,
                                  publisher: book.publisher,
                                  publication_date: book.publication_date,
                                  edition: book.edition,
                                  genre: book.genre,
                                });
                                handleUpdateBookModalOpen();
                                e.preventDefault();
                              }}
                            >
                              Update
                            </Button>
                            <Modal
                              open={updatebookopen}
                              onClose={handleUpdateBookModalClose}
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
                                  form: { margin: "10px 0" },
                                  p: 4,
                                }}
                              >
                                <Typography
                                  id="modal-modal-title"
                                  variant="h6"
                                  component="h2"
                                  margin="10px 0"
                                >
                                  Book Details:
                                </Typography>
                                <form
                                  onSubmit={(e) => {
                                    handleUpdateBookFormSubmit();
                                    handleUpdateBookModalClose();
                                  }}
                                >
                                  <StyledFormRow>
                                    <TextField
                                      label="Title"
                                      name="title"
                                      value={updatebookData.title}
                                      onChange={handleUpdateBookFormChange}
                                      fullWidth
                                      required
                                    />
                                  </StyledFormRow>
                                  <StyledFormRow>
                                    <TextField
                                      label="Author"
                                      name="author"
                                      value={updatebookData.author}
                                      onChange={handleUpdateBookFormChange}
                                      fullWidth
                                    />
                                  </StyledFormRow>
                                  <StyledFormRow>
                                    <TextField
                                      label="Edition"
                                      name="edition"
                                      type="number"
                                      value={updatebookData.edition}
                                      onChange={handleUpdateBookFormChange}
                                      fullWidth
                                      required
                                    />
                                  </StyledFormRow>
                                  <StyledFormRow>
                                    <TextField
                                      label="Publisher"
                                      name="publisher"
                                      value={updatebookData.publisher}
                                      onChange={handleUpdateBookFormChange}
                                      fullWidth
                                    />
                                  </StyledFormRow>
                                  <StyledFormRow>
                                    <TextField
                                      label="Publication Date"
                                      name="publication_date"
                                      type="date"
                                      value={updatebookData.publication_date}
                                      onChange={handleUpdateBookFormChange}
                                      fullWidth
                                      InputLabelProps={{ shrink: true }}
                                    />
                                  </StyledFormRow>
                                  <StyledFormRow>
                                    <TextField
                                      label="Genre"
                                      name="genre"
                                      value={updatebookData.genre}
                                      onChange={handleUpdateBookFormChange}
                                      fullWidth
                                    />
                                  </StyledFormRow>

                                  <StyledFormRow>
                                    <Button
                                      variant="contained"
                                      type="submit"
                                      color="primary"
                                    >
                                      Update Book
                                    </Button>
                                  </StyledFormRow>
                                </form>
                              </Box>
                            </Modal>
                          </>
                        )}
                      </>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
              <TableRow>
                {userData?.user?.role_id != 3 && (
                  <StyledTableCell align="center" colSpan={1}>
                    <>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          handleBookAddModalOpen();
                          //  e.preventDefault();
                        }}
                      >
                        Add
                      </Button>
                      <Modal
                        open={addbookopen}
                        onClose={handleBookAddModalClose}
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
                            form: { margin: "10px 0" },
                            p: 4,
                          }}
                        >
                          <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            margin="10px 0"
                          >
                            Book Details:
                          </Typography>
                          <form
                            onSubmit={(e) => {
                              handleBookAddFormSubmit();
                              handleBookAddModalClose();
                              //   e.preventDefault();
                            }}
                          >
                            <StyledFormRow>
                              <TextField
                                label="Title"
                                name="title"
                                value={newbookData.title}
                                onChange={handleBookAddFormChange}
                                fullWidth
                                required
                              />
                            </StyledFormRow>
                            <StyledFormRow>
                              <TextField
                                label="Author"
                                name="author"
                                value={newbookData.author}
                                onChange={handleBookAddFormChange}
                                fullWidth
                              />
                            </StyledFormRow>
                            <StyledFormRow>
                              <TextField
                                label="Edition"
                                name="edition"
                                type="number"
                                value={newbookData.edition}
                                onChange={handleBookAddFormChange}
                                fullWidth
                                required
                              />
                            </StyledFormRow>
                            <StyledFormRow>
                              <TextField
                                label="Publisher"
                                name="publisher"
                                value={newbookData.publisher}
                                onChange={handleBookAddFormChange}
                                fullWidth
                              />
                            </StyledFormRow>
                            <StyledFormRow>
                              <TextField
                                label="Publication Date"
                                name="publication_date"
                                type="date"
                                value={newbookData.publication_date}
                                onChange={handleBookAddFormChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                              />
                            </StyledFormRow>
                            <StyledFormRow>
                              <TextField
                                label="Genre"
                                name="genre"
                                value={newbookData.genre}
                                onChange={handleBookAddFormChange}
                                fullWidth
                              />
                            </StyledFormRow>
                            <StyledFormRow>
                              <TextField
                                label="NumberOfCopies"
                                name="total"
                                value={newbookData.total}
                                onChange={handleBookAddFormChange}
                                fullWidth
                              />
                            </StyledFormRow>
                            <StyledFormRow>
                              <Button
                                variant="contained"
                                type="submit"
                                color="primary"
                              >
                                Add Book
                              </Button>
                            </StyledFormRow>
                          </form>
                        </Box>
                      </Modal>
                    </>
                  </StyledTableCell>
                )}
                <StyledTableCell align="center" colSpan={1}>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setOffset(offset - limit);
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
                      e.preventDefault();
                      setOffset(offset + limit);
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
      <div>
        <Outlet />
      </div>
    </div>
  );
}
export default BookPage;
