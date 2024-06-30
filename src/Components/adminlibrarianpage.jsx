import React from "react";
import { useState, useEffect } from "react";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  Box,
  Button,
  Table,
  TableBody,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Modal,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import axios from "axios";
import { read_local_userdata, write_local_userdata } from "../utils/read_store";
import { useNavigate } from "react-router-dom";

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
const StyledFormRow = styled(Paper)(() => ({
  marginBottom: "9px",
}));
function AdminLibrarianPage() {
  const navigate = useNavigate();
  const userData = read_local_userdata();

  const [listItems, setlistItems] = useState([]);
  const [reload, setReload] = useState(false);
  const [open, setOpen] = useState(false);

  const [librarian, getData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    console.log("get http://localhost:3001/admin/librarians ", reload);
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
          `get librarians : error status: ${error?.request}  :message: ${error?.response?.data}`
        );
        if (error.response?.data?.error == "Signature has expired") {
          write_local_userdata(null);
          alert("Session Signature has expired,\nTrylogin again");
          navigate("/loginpage");
        }
      });
  }, [reload]);

  const handleActivateDeactivate = (librarian) => {
    const userData = read_local_userdata();
    console.log("Submitting status change req : ", librarian);

    const headers = {
      Authorization: String(userData?.token),
      "Content-Type": "application/json",
    };
    console.log(
      "senging patch req to http://localhost:3001/admin/librarians/updatestatus/:id"
    );
    axios
      .patch(
        `http://localhost:3001/admin/librarians/updatestatus/${librarian.id}`,
        null,
        {
          headers,
        }
      )
      .then((response) => {
        console.log("responce :: ", response);
        if (response?.data) {
          alert("Successful!", response?.data);
          setReload(!reload);
        }
      })
      .catch((error) => {
        console.log("error :: ", error);
        alert(
          `error status: ${error?.request?.status}  :message: ${error?.response?.data?.error} `
        );
        if (error.response?.data?.error == "Signature has expired") {
          write_local_userdata(null);
          alert("Session Signature has expired,\nTrylogin again");
          navigate("/loginpage");
        }
      });
  };
  // admin/librarians/promotetoadmin/
  const handlePromoteToAdmin = (librarian) => {
    const headers = {
      Authorization: String(userData?.token),
      "Content-Type": "application/json",
    };
    console.log(
      "senging patch req to http://localhost:3001admin/librarians/promotetoadmin/:id"
    );
    axios
      .patch(
        `http://localhost:3001/admin/librarians/promotetoadmin/${librarian.id}`,
        null,
        {
          headers,
        }
      )
      .then((response) => {
        console.log("responce :: ", response);
        if (response?.data) {
          alert("Successful!", response?.data);
          setReload(!reload);
        }
      })
      .catch((error) => {
        console.log("error :: ", error);
        alert(
          `error status: ${error?.request?.status}  :message: ${error?.response?.data?.error} `
        );
        if (error.response?.data?.error == "Signature has expired") {
          write_local_userdata(null);
          alert("Session Signature has expired,\nTrylogin again");
          navigate("/loginpage");
        }
      });
  };

  const handleFormChange = (event) => {
    getData({ ...librarian, [event.target.name]: event.target.value });
  };
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const handleFormSubmit = () => {
    console.log("Submitting updated book data:", librarian);
    const data = {
      user: {
        email: librarian.email,
        password: librarian.password,
        name: librarian.name,
        role_id: 2,
      },
    };
    const headers = {
      Authorization: String(userData?.token),
      "Content-Type": "application/json",
    };
    console.log("senging post req to http://localhost:3001/admin/librarians");

    axios
      .post("http://localhost:3001/admin/librarians", data, { headers })
      .then((response) => {
        if (response?.status == 200) {
          alert("Successful!", response?.data?.message);
          setReload(!reload);
        }
      })
      .catch((error) => {
        console.log("add librarian error :: ", error);
        alert(
          `${error?.request?.status}  :message: ${error?.response?.data?.message} `
        );
        console.log("Detailed error : ", error?.response?.data?.error);
        if (error.response?.data?.error == "Signature has expired") {
          write_local_userdata(null);
          navigate("/loginpage");
        } else {
          setReload(!reload);
        }
      });
    getData({ name: "", email: "", password: "", password_confirmation: "" });
  };
  return (
    <div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="Left" colSpan={6}>
                  <Typography fontSize={28}>Librarians</Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="right" scope="row">
                  {"Index"}
                </StyledTableCell>
                <StyledTableCell>{"Name"}</StyledTableCell>
                <StyledTableCell>{"Email"}</StyledTableCell>
                <StyledTableCell>{"Status"}</StyledTableCell>
                <StyledTableCell>{"Action"}</StyledTableCell>
                <StyledTableCell>
                  <>
                    {
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          handleModalOpen();
                          e.preventDefault();
                        }}
                      >
                        Add
                      </Button>
                    }

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
                          Librarian Regisration:
                        </Typography>
                        <form
                          onSubmit={(e) => {
                            handleFormSubmit();
                            handleModalClose();
                            e.preventDefault();
                          }}
                        >
                          <StyledFormRow>
                            <TextField
                              label="Name"
                              name="name"
                              value={librarian?.name}
                              onChange={handleFormChange}
                              fullWidth
                              required
                            />
                          </StyledFormRow>
                          <StyledFormRow>
                            <TextField
                              label="Email"
                              name="email"
                              value={librarian?.email}
                              onChange={handleFormChange}
                              fullWidth
                            />
                          </StyledFormRow>
                          <StyledFormRow>
                            <TextField
                              label="Password"
                              name="password"
                              type="password"
                              value={librarian?.password}
                              onChange={handleFormChange}
                              fullWidth
                              required
                            />
                          </StyledFormRow>
                          <StyledFormRow>
                            <TextField
                              label="Password Confirmation"
                              name="password_confirmation"
                              type="password"
                              value={librarian?.password_confirmation}
                              onChange={handleFormChange}
                              fullWidth
                            />
                          </StyledFormRow>
                          <StyledFormRow>
                            <Button
                              variant="contained"
                              type="submit"
                              color="primary"
                            >
                              Submit
                            </Button>
                          </StyledFormRow>
                        </form>
                      </Box>
                    </Modal>
                  </>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listItems?.map((librarian, index) => {
                return (
                  <StyledTableRow key={librarian?.id}>
                    <StyledTableCell align="right" scope="row">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell>{librarian?.name}</StyledTableCell>
                    <StyledTableCell>{librarian?.email}</StyledTableCell>
                    <StyledTableCell>{librarian?.status}</StyledTableCell>

                    <StyledTableCell>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          handlePromoteToAdmin(librarian);
                          e.preventDefault();
                        }}
                      >
                        Promote
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button
                        variant="contained"
                        size="small"
                        color={
                          librarian.status == "active" ? "error" : "primary"
                        }
                        onClick={(e) => {
                          handleActivateDeactivate(librarian);
                          e.preventDefault();
                        }}
                      >
                        {librarian.status == "active"
                          ? "Deactivate"
                          : "Activate"}
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
