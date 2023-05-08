import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const StudentRoutes = (props) => {
  const { Component } = props;
  const navigate = useNavigate();

  useEffect(() => {
    let authDetails = JSON.parse(localStorage.getItem("authDetails"));
    console.log("authDetails", authDetails);
    if (!authDetails?.token) {
      navigate("/");
    }
    if (authDetails?.userDetails?.role === "Admin") {
      message.destroy();
      message.warning("Only students can view this page", 1.5);
      navigate("/sampleTemplate");
    }
  }, []);

  return (
    <div>
      <Component />
    </div>
  );
};

export default StudentRoutes;
