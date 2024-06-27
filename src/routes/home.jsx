import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { read_local } from "../utils/read_store";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userData = read_local();
    if (!userData) {
      navigate("/loginpage");
    }
  }, []);
  return <Outlet />;
};
export default Home;
