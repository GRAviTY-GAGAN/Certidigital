import { Button, Progress, Select, Space, Table, Tag } from "antd";
import { Image } from "antd";
import { DoubleLeftOutlined } from "@ant-design/icons";
import HamburgerNavbar from "../../Components/HamburgerNavbar";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import "../../Styles/batchDetailTable.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const BatchDetailTable = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [batchId, setBatchId] = useState("");
  const params = useParams();
  const location = localStorage.getItem("location");
  const [tableSize, setTableSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [success, setSuccess] = useState(0);
  const [failed, setFailed] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBatchDetails();
  }, []);
  console.log(location, "THIS IS LOCATION");

  function fetchBatchDetails() {
    axios
      .post(
        `https://certidigital-backend.onrender.com/batchcertificate/batch/${params.id}`
      )
      .then((res) => {
        // console.log(res.data, "BEFORE");
        setFailed(res.data.failedemails.length);
        setTotal(res.data.successemails.length + res.data.failedemails.length);
        setSuccess(res.data.successemails.length);
        let imagesPathArr = res.data.Imagepath;
        setBatchId(res.data._id);
        let newData = [];
        let mails = res.data?.successemails?.map((mail) => {
          mail["status"] = true;
          return mail;
        });
        newData = [...mails];
        if (res.data?.failedemails.length > 0) {
          mails = res.data?.failedemails.map((mail) => {
            mail["status"] = false;
            return mail;
          });
          newData = [...newData, ...mails];
        }

        // console.log(newData, "RES THIS LINE");
        for (let i = 0; i < newData.length; i++) {
          for (let j = 0; j < imagesPathArr.length; j++) {
            if (newData[i].Email == imagesPathArr[j]?.Email) {
              newData[i].Email_subject = imagesPathArr[j].Path;
              break;
            }
          }
        }
        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleDownloadCSV() {
    document.getElementById("failedLink").click();
  }

  const handleTableChange = (value) => {
    setTableSize(value);
  };

  const options = [
    { value: 5 },
    { value: 10 },
    { value: 20 },
    { value: 50 },
    { value: 100 },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "name",
      align: "center",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "Email",
      align: "center",
      key: "email",
    },
    {
      title: "Certificate",
      dataIndex: "Email_subject",
      key: "image",
      render: (value, index) => {
        // axios.get(`https://certidigital-backend.onrender.com/batchcertificate/image?path=${value}`);
        return (
          <Image
            key={`${value + index}`}
            className="batchDetailTable__certificate"
            src={`https://certidigital-backend.onrender.com/batchcertificate/image?path=${value}`}
            width={100}
            preview={{
              mask: <div style={{ background: "rgba(0, 0, 0, 0.5)" }} />,
            }}
            alt="Certificate"
          />
        );
      },
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      align: "center",
      render: (value) => {
        if (value) {
          return (
            <CheckCircleOutlined style={{ color: "green", fontSize: "18px" }} />
          );
        } else {
          return (
            <CloseCircleOutlined style={{ color: "red", fontSize: "18px" }} />
          );
        }
      },
    },
  ];

  return (
    <div>
      <div>
        <HamburgerNavbar />
      </div>
      <div className="BatchDetailTable__mainCont">
        <div className="BatchDetailTable__ProgressCont">
          <div className="BatchDetailTable__Progress">
            <p>Email Sent : {success}</p>
            <Progress
              size={70}
              // style={{ fontSize: "1px" }}
              status="success"
              type="circle"
              percent={Math.ceil((success / total) * 100)}
              format={(percent) => `${percent}%`}
            />
          </div>
          <div className="BatchDetailTable__Progress">
            <p>Email Failed : {failed}</p>
            <Progress
              size={70}
              type="circle"
              percent={Math.ceil((failed / total) * 100)}
              status="exception"
              format={(percent) => `${percent}%`}
            />
          </div>
        </div>
        <div className="BatchDetailTable__BtnAndTable">
          <div className="BatchDetailTable__csvBtnMainCont">
            <div className="BatchDetailTable__csvBtnCont">
              <a
                href={`https://certidigital-backend.onrender.com/batchcertificate/allemails/${batchId}`}
              >
                <Button type="primary">Download all CSV</Button>
              </a>

              <a
                href={`https://certidigital-backend.onrender.com/batchcertificate/successemails/${batchId}`}
              >
                <Button style={{ background: "#1F2937" }} type="primary">
                  Download success CSV
                </Button>
              </a>

              <Button
                onClick={() => handleDownloadCSV()}
                disabled={failed == 0}
                style={{
                  background: "#F94A29",
                  display: failed.length == 0 ? "none" : "block",
                }}
                type="primary"
              >
                <a
                  id="failedLink"
                  style={{
                    display: "none",
                  }}
                  href={`https://certidigital-backend.onrender.com/batchcertificate/failedemails/${batchId}`}
                ></a>
                Download failed CSV
              </Button>

              <Button
                style={{
                  fontWeight: 600,
                }}
                onClick={() => navigate(`${location}`)}
                icon={<DoubleLeftOutlined />}
              >
                Back
              </Button>
            </div>
            <div>
              <span>Table Rows : </span>
              <Select
                // size={"small"}
                defaultValue="10"
                onChange={handleTableChange}
                style={{
                  width: 70,
                }}
                options={options}
              />
            </div>
          </div>
          <div className="batchDetailTable__table">
            <Table
              loading={loading}
              columns={columns}
              dataSource={tableData}
              size="small"
              defaultCurrent={1}
              pagination={{ pageSize: tableSize }}
              total={total}
              scroll={{
                y: 500,
              }}
            ></Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailTable;
