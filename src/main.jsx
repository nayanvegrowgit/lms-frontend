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
import UpdateBookForm from "./Components/llibrarianaddform";
import BorrowRecords from "./Components/borrowrecords";
import Elevation from "./Components/profile";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/app" element={<Home />}>
        <Route path="/app/dashboard" element={<UserDashboard />}>
          {/* <Route path="managebooks" element={<ManageBook />} />
          <Route path="managelibrarians" element={<ManageLibrarians />} />
          <Route path="manageusers" element={<ManageUsers />} />*/}
          <Route path="borrowrecords" element={<BorrowRecords />} />
          <Route path="books" element={<BookPage />}>
            <Route path="updatebook" element={<UpdateBookForm />} />
          </Route>
          <Route path="myborrowhistory" element={<BorrowRecordsUser />} />
        </Route>
      </Route>
      <Route path="/loginpage" element={<LoginPage />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/elevation" element={<Elevation />} />
      <Route path="/*" element={<Navigate to="/loginpage" replace />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
