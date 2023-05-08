import { Button, Space, Table, Tag } from "antd";
import { Image } from "antd";
import HamburgerNavbar from "../../Components/HamburgerNavbar";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import "../../Styles/batchDetailTable.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const data = [
  {
    name: "Rayan",
    email: "rayan@gmail.com",
    image:
      "https://images.pexels.com/photos/296282/pexels-photo-296282.jpeg?auto=compress&cs=tinysrgb&w=1600",
    status: true,
  },
  {
    name: "Rayan",
    email: "rayan@gmail.com",
    image:
      "https://images.pexels.com/photos/296282/pexels-photo-296282.jpeg?auto=compress&cs=tinysrgb&w=1600",
    status: false,
  },
  {
    name: "Rayan",
    email: "rayan@gmail.com",
    image:
      "https://images.pexels.com/photos/296282/pexels-photo-296282.jpeg?auto=compress&cs=tinysrgb&w=1600",
    status: true,
  },
  {
    name: "Rayan",
    email: "rayan@gmail.com",
    image:
      "https://images.pexels.com/photos/296282/pexels-photo-296282.jpeg?auto=compress&cs=tinysrgb&w=1600",
    status: false,
  },
];

const BatchDetailTable = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [batchId, setBatchId] = useState("");
  const params = useParams();

  useEffect(() => {
    fetchBatchDetails();
  }, []);

  function fetchBatchDetails() {
    console.log(`http://localhost:8080/batchcertificate/batch/${params.id}`);
    axios
      .post(`http://localhost:8080/batchcertificate/batch/${params.id}`)
      .then((res) => {
        console.log(res.data, "BEFORE");
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
        console.log(newData, "RES");
        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleDownloadCSV(url) {
    console.log();
  }

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
      dataIndex: "image",
      key: "image",
      render: (value) => {
        return (
          <Image
            key={`${value}`}
            className="batchDetailTable__certificate"
            src={value}
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
      <div className="BatchDetailTable__csvBtnCont">
        <a href={`http://localhost:8080/batchcertificate/allemails/${batchId}`}>
          <Button onClick={() => handleDownloadCSV()} type="primary">
            Download all CSV
          </Button>
        </a>

        <a
          href={`http://localhost:8080/batchcertificate/successemails/${batchId}`}
        >
          <Button
            onClick={() => handleDownloadCSV()}
            style={{ background: "#1F2937" }}
            type="primary"
          >
            Download success CSV
          </Button>
        </a>
        <a
          href={`http://localhost:8080/batchcertificate/failedemails/${batchId}`}
        >
          <Button
            onClick={() => handleDownloadCSV()}
            style={{ background: "#F94A29" }}
            type="primary"
          >
            Download failed CSV
          </Button>
        </a>
      </div>
      <div className="batchDetailTable__table">
        <Table
          loading={loading}
          pagination={false}
          columns={columns}
          dataSource={tableData}
          size="small"
        ></Table>
      </div>
    </div>
  );
};

export default BatchDetailTable;
