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
function ManageMembers() {
  const navigate = useNavigate();
  const userData = read_local_userdata();

  const [listItems, setlistItems] = useState([]);
  const [reload, setReload] = useState(false);
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const limit = 5;
  const [member, getData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    const data = {
      offset: offset,
      limit: limit,
    };

    axios
      .post("http://localhost:3001/admin/members/list", data, {
        headers: {
          Authorization: String(userData?.token), // Edit the authorization key here
        },
      })
      .then((response) => {
        console.log("responce : ", response?.data);
        setlistItems(response?.data?.data);
      })
      .catch((error) => {
        console.log("error :: ", error);
        alert(`get  : error code: ${error.code}  :message: ${error?.message}`);
        if (error.response?.data?.error == "Signature has expired") {
          write_local_userdata(null);
          alert("Session Signature has expired,\nTrylogin again");
          navigate("/loginpage");
        }
      });
  }, [reload, offset]);

  const handleActivateDeactivate = (member) => {
    const userData = read_local_userdata();
    console.log("Submitting status change req : ", member);

    const headers = {
      Authorization: String(userData?.token),
      "Content-Type": "application/json",
    };
    console.log(
      "senging patch req to http://localhost:3001/admin/members/updatestatus/:id"
    );
    axios
      .patch(
        `http://localhost:3001/admin/members/updatestatus/${member.id}`,
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
    getData({ ...member, [event.target.name]: event.target.value });
  };
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const handleFormSubmit = () => {
    console.log("Submitting member data:", member);
    const data = {
      user: {
        email: member.email,
        password: member.password,
        name: member.name,
        role_id: 3,
      },
    };
    const headers = {
      Authorization: String(userData?.token),
      "Content-Type": "application/json",
    };
    console.log("senging post req to http://localhost:3001/admin/members");

    axios
      .post("http://localhost:3001/admin/members", data, { headers })
      .then((response) => {
        if (response?.status == 200) {
          alert("Successful!", response?.data?.message);
          setReload(!reload);
        }
      })
      .catch((error) => {
        console.log("add member error :: ", error);
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
                <StyledTableCell align="left" colSpan={4}>
                  <Typography fontSize={28}>Members</Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
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
                        Add New Member
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
                          Member Regisration:
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
                              value={member?.name}
                              onChange={handleFormChange}
                              fullWidth
                              required
                            />
                          </StyledFormRow>
                          <StyledFormRow>
                            <TextField
                              label="Email"
                              name="email"
                              value={member?.email}
                              onChange={handleFormChange}
                              fullWidth
                            />
                          </StyledFormRow>
                          <StyledFormRow>
                            <TextField
                              label="Password"
                              name="password"
                              type="password"
                              value={member?.password}
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
                              value={member?.password_confirmation}
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
              <TableRow>
                <StyledTableCell align="center">{"Index"}</StyledTableCell>
                <StyledTableCell align="right">{"Name"}</StyledTableCell>
                <StyledTableCell align="right">{"Email"}</StyledTableCell>
                <StyledTableCell align="right">{"Status"}</StyledTableCell>
                <StyledTableCell align="right">{"Action"}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listItems?.map((member, index) => {
                return (
                  <StyledTableRow key={member?.id}>
                    <StyledTableCell align="center">
                      {offset + index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {member?.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {member?.email}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {member?.status}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        color={member.status == "active" ? "error" : "primary"}
                        onClick={(e) => {
                          handleActivateDeactivate(member);
                          e.preventDefault();
                        }}
                      >
                        {member.status == "active" ? "Deactivate" : "Activate"}
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
              <TableRow>
                <StyledTableCell colSpan={4}></StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    onClick={(e) => {
                      setOffset(offset - limit);
                      e.preventDefault();
                    }}
                    disabled={offset == 0 ? true : false}
                  >
                    Previous
                  </Button>

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

export default ManageMembers;
