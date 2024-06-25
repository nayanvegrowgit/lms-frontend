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
import AdminLibrarianPage from "./Components/adminlibrarianpage";
import LibrarianRegisration from "./Components/llibrarianaddform";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/app" element={<Home />}>
        <Route index path="dashboard" element={<UserDashboard />} />
      </Route>
      <Route path="/loginpage" element={<LoginPage />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="bookpage" element={<BookPage />} />
      <Route path="admin/librsarians" element={<AdminLibrarianPage />} />
      <Route
        path="admin/librarian/registration"
        element={<LibrarianRegisration />}
      />
      <Route path="/*" element={<Navigate to="/loginpage" replace />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
