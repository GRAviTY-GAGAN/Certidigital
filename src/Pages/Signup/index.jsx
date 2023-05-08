import { Button, Col, Form, Input, message, Row, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import "../../Styles/signupSignin.css";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useCaptchGen from "../../hooks/useCaptchGen";

const Signup = () => {
  const [signupFormLoading, setSignupFormLoading] = useState(false);

  const navigate = useNavigate();

  const [loading, captcha, setNewLength] = useCaptchGen();

  useEffect(() => {
    setNewLength(6);
  }, []);

  // const [captcha, setCaptcha] = useState("");
  // const [captchaLoading, setCaptchaLoading] = useState(false);

  // function generateRandomString(length) {
  //   setCaptchaLoading(true);
  //   setTimeout(() => {
  //     let result = "";
  //     const characters =
  //       "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789";
  //     for (let i = 0; i < length; i++) {
  //       result += characters.charAt(
  //         Math.floor(Math.random() * characters.length)
  //       );
  //     }
  //     setCaptcha(result);
  //     setCaptchaLoading(false);
  //   }, 1000);
  // }

  function handleSignupForm(values) {
    console.log("values", values);
    setSignupFormLoading(true);
    fetch("http://localhost:8080/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Data", data);
        if (data.message === "successfully signup with email") {
          message.success("successfully signup with email");
          setTimeout(() => {
            navigate("/confirmAccount");
          }, 2000);
        } else if (data.message === "user already registered") {
          message.warning("User is already registered");
        }
        setSignupFormLoading(false);
      })
      .catch((error) => {
        const errorMessage = error.data?.message || error.message;
        console.error("Error", errorMessage);
        message.error(errorMessage);
        setSignupFormLoading(false);
      });
  }

  return (
    <>
      <div className="signupContainer">
        <div>
          <div id="loginImageDiv">
            <img
              width={"100%"}
              src="/Images/SignupImage.jpg"
              className="signupImage"
              alt="SignupImage"
            />
          </div>
          <div className="signupFormContainer">
            <div className="signupHeading">
              <img
                src="/Images/Masailogo.svg"
                className="masaiLogo"
                width={"50%"}
                alt="masai logo"
              />
              <h1>Create Account</h1>
              <p>
                Go ahead and sign up, let everyone know how awesome you are!
              </p>
            </div>
            <div className="innerSignupFormContainer">
              <Form
                labelAlign=""
                layout="vertical"
                autoComplete="off"
                onFinish={handleSignupForm}
                onFinishFailed={(error) => {
                  console.log({ error });
                }}
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your name",
                    },
                    {
                      whitespace: true,
                      message: "Name cannot be empty spaces",
                    },
                    { min: 4 },
                  ]}
                  hasFeedback
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your name"
                  />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your Email",
                    },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                  hasFeedback
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Enter your email"
                  />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the password",
                    },
                    { min: 8 },
                    {
                      validator: (_, value) => {
                        function checkPassword(value) {
                          var pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
                          return pattern.test(value);
                        }
                        return value && checkPassword(value)
                          ? Promise.resolve()
                          : Promise.reject(
                              "Password must contain a capital letter and a special character"
                            );
                      },
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter the password"
                  />
                </Form.Item>
                <Form.Item
                  label="Confirm Password"
                  name="rePassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please comfirm the password",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject("Password doesn't matched");
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Confirm your password"
                  />
                </Form.Item>
                <Form.Item
                  label="Select Role"
                  name="role"
                  rules={[
                    {
                      required: true,
                      message: "Please Select your role",
                    },
                  ]}
                  hasFeedback
                >
                  <Select placeholder="Select your role">
                    <Select.Option value="Admin">Admin</Select.Option>
                    <Select.Option value="Student">Student</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item rules={[{}]}>
                  <div className="captchaDiv">
                    <div className="captchaBox">
                      <p>{captcha}</p>
                    </div>
                    <div>
                      <Spin spinning={loading}>
                        <RedoOutlined
                          loop={loading}
                          onClick={() => setNewLength(6)}
                          style={{
                            fontSize: 30,
                            marginTop: 7,
                            color: "#444d5c",
                          }}
                        />
                      </Spin>
                    </div>
                  </div>
                </Form.Item>

                <Form.Item
                  label="Captcha"
                  extra="We must make sure that your are a human."
                  hasFeedback
                >
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        name="captcha"
                        noStyle
                        dependencies={[captcha]}
                        rules={[
                          {
                            required: true,
                            message: "Please enter the captcha",
                          },
                          {
                            validator: (_, value) => {
                              return value === captcha
                                ? Promise.resolve()
                                : Promise.reject("Wrong Captcha");
                            },
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item>
                  <Button
                    style={{
                      background: "#1F2937",
                      color: "White",
                      fontWeight: 600,
                    }}
                    loading={signupFormLoading}
                    block
                    type="primary"
                    htmlType="submit"
                  >
                    Sign Up
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    id="alreadyAccountBtn"
                    style={{
                      background: "#4E46DC",
                      color: "White",
                      fontWeight: 600,
                    }}
                    block
                    type="primary"
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    I already have an account
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
