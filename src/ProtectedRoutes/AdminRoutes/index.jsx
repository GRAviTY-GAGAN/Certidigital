import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const AdminRoutes = (props) => {
  const { Component } = props;
  const navigate = useNavigate();

  useEffect(() => {
    let authDetails = JSON.parse(localStorage.getItem("authDetails"));
    console.log("authDetails", authDetails);
    if (!authDetails?.token) {
      navigate("/");
    }
    if (authDetails?.userDetails?.role === "Student") {
      message.destroy();
      message.warning("You are not authorized to visit this page",1.5);
      setTimeout(() => {
        navigate("/userview");
      }, 100);
    }
  }, []);

  return (
    <div>
      <Component />
    </div>
  );
};

export default AdminRoutes;
