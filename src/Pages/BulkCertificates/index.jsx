import { useEffect, useState } from "react";
import { Modal, Upload, Button, message, Form, Input, Table } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import HamburgerNavbar from "../../Components/HamburgerNavbar";
import Footer from "../../Components/Footer";
import axios from "axios";

const BulkCertificates = () => {
  let { id } = useParams();
  const [batchName, setBatchName] = useState("");
  const [csvFile, setCsvFile] = useState("");
  const [mailData, setMailData] = useState([]);
  const [generateBtnLoading, setGenerateBtnLoading] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const navigate = useNavigate();

  const authDetails = JSON.parse(localStorage.getItem("authDetails"));
  let token = authDetails?.token;

  const handleBatchName = (e) => {
    const { value } = e.target;
    setBatchName(value);
  };

  const handleCsvFile = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const anotherfunction = async (e) => {
    setGenerateBtnLoading(true);
    setDisableBtn(true);
    console.log("csvFile: ", csvFile);

    const formData = new FormData();
    formData.append("csv", csvFile);
    // formData.append("id", id);
    formData.append("batch", batchName);
    console.log("formdata", formData);

    axios
      .post(
        `https://certidigital-backend.onrender.com/batchcertificate/certificate/batch/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data == "GOT") {
          function recursion() {
            setTimeout(() => {
              axios
                .get(
                  `https://certidigital-backend.onrender.com/batchcertificate/batchdetails`
                )
                .then((res) => {
                  console.log(res, "NREW RESS");
                  let success = res.data.successemails;
                  success = success.map((item) => {
                    item["status"] = true;
                    return item;
                  });
                  let failed = res.data.failedemails;
                  failed = failed.map((item) => {
                    item["status"] = false;
                    return item;
                  });
                  let newData = [...success, ...failed];
                  setMailData(newData);
                  //
                  if (
                    res.data.fields.length <=
                    res.data.successemails.length + res.data.failedemails.length
                  ) {
                    setGenerateBtnLoading(false);
                    setDisableBtn(false);
                    message.success("Emails have been sent successfully");
                    setTimeout(() => {
                      navigate(`/batchDetailTable/${res.data._id}`);
                    }, 2000);
                    return;
                  } else {
                    recursion();
                  }
                })
                .catch((err) => {
                  console.log(err);
                  message.error("Something went wrong please try again!");
                  setGenerateBtnLoading(false);
                  setDisableBtn(false);
                });
            }, 1000);
          }
          recursion();
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
        setGenerateBtnLoading(false);
        setDisableBtn(false);
      });
  };

  const handleUploadCSV = async (e) => {
    setGenerateBtnLoading(true);
    console.log("csvFile: ", csvFile);

    const formData = new FormData();
    formData.append("csv", csvFile);
    // formData.append("id", id);
    formData.append("batch", batchName);
    console.log("formdata", formData);

    try {
      const response = await fetch(
        `https://certidigital-backend.onrender.com/batchcertificate/certificate/batch/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      // const data = await response.text().then(() => {
      //   setGenerateBtnLoading(false);
      // });
      const data = await response.json();

      console.log("data: NEWNEWNEW", data);
      message.success("CSV file uploaded successfully!");

      const mailData = await getMailStatus();
      setMailData(mailData);

      const interval = setInterval(async () => {
        try {
          const updatedMailData = await getMailStatus();
          setMailData(updatedMailData);

          if (
            updatedMailData &&
            !updatedMailData.some((item) => item.result === null)
          ) {
            clearInterval(interval);
            message.success(
              "All emails have been successfully sent to each students!",
              8
            );
            console.log("Inside clear");
          } else {
            console.log("continue");
            message.loading("Mail sending in progress..", 5);
          }
        } catch (error) {
          console.log("err: ", error);
          message.error("Error fetching mail status!");
        }
        // finally {
        //   const updatedMailData = await getMailStatus();
        //   if (
        //     updatedMailData &&
        //     !updatedMailData.some((item) => item.result === null)
        //   ) {
        //     clearInterval(interval);
        //   }
        // }
      }, 5000);

      // const interval = setInterval(async () => {
      //   const updatedMailData = await getMailStatus();
      //   setMailData(updatedMailData);

      //   if (!updatedMailData.some((item) => item.result === null)) {
      //     clearInterval(interval);
      //     message.success(
      //       "All emails have been successfully sent to each students!",
      //       8
      //     );
      //     console.log("Inside clear");
      //   } else {
      //     console.log("continue");
      //     message.loading("Mail sending in progress..", 5);
      //   }
      // }, 5000);
    } catch (error) {
      console.error("Error uploading CSV file:", error);
      message.error("Error uploading CSV file!");
    }
  };

  const getMailStatus = async () => {
    try {
      const response = await fetch(
        "https://certidigital-backend.onrender.com/batchcertificate/email-status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("data: ", data);
      return data;
    } catch (err) {
      console.log("err: ", err);
      getMailStatus();
      return [];
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      width: "30%",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "Email",
      width: "40%",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "30%",
      align: "center",
      render: (result) => {
        // return result === null ? (
        //   <LoadingOutlined />
        // ) : // ) : result?.success ? (
        // result?.accepted.length >= 1 || result?.success ? (
        //   <CheckCircleOutlined style={{ color: "green", fontSize: "18px" }} />
        // ) : (
        //   <CloseCircleOutlined style={{ color: "red", fontSize: "18px" }} />
        // );
        return result === true ? (
          <CheckCircleOutlined style={{ color: "green", fontSize: "18px" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red", fontSize: "18px" }} />
        );
      },
    },
  ];
  const data = [];
  for (let i = 0; i < 1000; i++) {
    let status = Math.random() < 0.5 ? true : false;
    data.push({
      key: i,
      name: `Pankaj Kumar Ram ${i + 1}`,
      email: `pankajkr${i + 1}@gmail.com`,
      status: status,
    });
  }

  return (
    <>
      <HamburgerNavbar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
          // minHeight: "68vh",
        }}
      >
        <Form
          layout="inline"
          onFinish={() => {
            // handleUploadCSV
            anotherfunction();
          }}
        >
          <h3 style={{ marginTop: "5px" }}>
            Upload CSV File <ArrowRightOutlined />{" "}
          </h3>
          <Form.Item
            name="batch"
            rules={[
              {
                required: true,
                message: "Please enter batch name",
              },
              {
                whitespace: true,
                message: "Batch name cannot be empty spaces",
              },
              // { min: 4, message: "name should be greater than 4 letters" },
            ]}
          >
            <Input
              className="inputBox"
              placeholder="Batch Name"
              id="image-upload"
              type="text"
              onChange={handleBatchName}
            />
          </Form.Item>
          <Form.Item
            name="image"
            rules={[
              {
                required: true,
                message: "Please select file from your computer",
              },
            ]}
          >
            <Input
              className="inputBox"
              id="image-upload"
              type="file"
              accept=".csv"
              onChange={handleCsvFile}
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={generateBtnLoading}
              type="primary"
              htmlType="submit"
              disabled={disableBtn}
            >
              Generate Certificates
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Table
          // loading={generateBtnLoading}
          columns={columns}
          // dataSource={data}
          dataSource={mailData.map((row, index) => ({ ...row, key: index }))}
          style={{ width: "50%" }}
          pagination={{
            pageSize: 50,
          }}
          scroll={{
            y: 415,
          }}
        />
      </div>
    </>
  );
};

export default BulkCertificates;
