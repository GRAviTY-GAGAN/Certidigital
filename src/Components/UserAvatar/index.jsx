import { Menu, message, Modal } from "antd";
import React, { useState } from "react";
import {
  DashboardOutlined,
  LogoutOutlined,
  LockOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const UserAvatar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  let authDetails = JSON.parse(localStorage.getItem("authDetails"));
  console.log(authDetails);
  let fullName = authDetails?.userDetails?.userName;
  let role = authDetails?.userDetails?.role;
  let userFirstName = "User";
  if (fullName.includes(" ")) {
    userFirstName = fullName?.split(" ");
    userFirstName = userFirstName[0];
  } else {
    userFirstName = fullName;
  }

  // const handleLogoutFn=()=>{
  //   setShowLogout(false);
  //   setTimeout(() => {
  //     navigate("/");
  //     const logout=localStorage.removeItem("authDetails");
  //     console.log("logout", logout);
  //     message.success("You are succesfully Logged out from your account",3)
  //   }, 500);
  // }
  const { confirm } = Modal;
  const handleLogout = () => {
    confirm({
      title: "Are you sure you want to logout?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Logout",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setTimeout(() => {
          navigate("/");
          const logout = localStorage.removeItem("authDetails");
          console.log("logout", logout);
          message.success(
            "You are succesfully Logged out from your account",
            3
          );
        }, 500);
      },
      onCancel() {},
    });
  };

  return (
    <div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["user"]}
        onClick={(info) => {
          console.log(info.key);
          if (info.key === "template") {
            navigate("/sampleTemplate");
          } else if (info.key === "logout") {
            setShowLogout(true);
            handleLogout();
          } else if (info.key === "changePassword") {
            navigate(`/change-password`);
          }
        }}
        items={[
          {
            label: (
              <span>
                <span style={{ fontWeight: 600, fontSize: 18 }}>
                  {userFirstName}{" "}
                </span>
                ({role})
              </span>
            ),
            key: "user",
          },
          {
            label: "Template",
            key: "template",
            icon: <DashboardOutlined />,
          },
          // { label: "My Profile", key: "myProfile", icon: <UserOutlined /> },
          {
            label: "Change Password",
            key: "changePassword",
            icon: <LockOutlined />,
          },
          {
            label: "Logout",
            key: "logout",
            danger: true,
            icon: <LogoutOutlined />,
          },
        ]}
      ></Menu>
      {/* <Modal
        title="Are you sure, You want to logout?"
        open={showLogout}
        onCancel={() => setShowLogout(false)}
        onOk={handleLogoutFn}
        okText="Yes, Logout"
        okType="danger"
      ></Modal> */}
    </div>
  );
};

export default UserAvatar;
