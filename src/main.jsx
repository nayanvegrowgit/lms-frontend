import React from "react";
import ReactDOM from "react-dom/client";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import "./index.css";

import Home from "./routes/home";
import UserDashboard from "./routes/userdashboard";

import LoginPage from "./routes/loginpage";
import Registration from "./routes/registration";
import BookPage from "./Components/bookscomponent";
import BorrowRecordsUser from "./Components/borrowrecordsuser";
import AdminLibrarianPage from "./Components/adminlibrarianpage";
import ManageMembers from "./Components/manageusers";
import BorrowRecords from "./Components/borrowrecords";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/app" element={<Home />}>
        <Route path="/app/dashboard" element={<UserDashboard />}>
          <Route path="managelibrarians" element={<AdminLibrarianPage />} />
          <Route path="managemember" element={<ManageMembers />} />
          <Route path="borrowrecords" element={<BorrowRecords />} />
          <Route path="books" element={<BookPage />}></Route>
          <Route path="myborrowhistory" element={<BorrowRecordsUser />} />
        </Route>
      </Route>
      <Route path="/loginpage" element={<LoginPage />} />
      <Route path="/registration" element={<Registration />} />

      <Route path="/*" element={<Navigate to="/loginpage" replace />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
