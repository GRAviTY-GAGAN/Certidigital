import React, { useEffect, useRef, useState } from "react";
import "../../Styles/Templatedetail.css";
import { Button, Table, message, Tooltip } from "antd";
import HamburgerNavbar from "../../Components/HamburgerNavbar";
import Footer from "../../Components/Footer";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { DoubleLeftOutlined } from "@ant-design/icons";
import { DownloadOutlined } from "@ant-design/icons";
import {
  exportComponentAsJPEG,
  exportComponentAsPDF,
  exportComponentAsPNG,
} from "react-component-export-image";

const TemplateDetail = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [batchData, setBatchData] = useState();
  const [certificateStatus, setCertificateStatus] = useState(false);
  const [showCsvButton, setshowCsvButton] = useState(true);
  const [certificateImageSrc, setCertificateImageSrc] = useState(
    `https://certidigital-backend.onrender.com/template/singletemplate/${id}`
  );
  const record = JSON.parse(localStorage.getItem("record"));
  const authDetails = JSON.parse(localStorage.getItem("authDetails"));
  let token = authDetails?.token;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const imageRef = useRef();
  // const batchData = [
  //   { id: 1, batch: "Web 16", count: 141 },
  //   { id: 2, batch: "Web 19", count: 92 },
  //   { id: 3, batch: "Web 20", count: 108 },
  // ];

  const handleTableChange = (pagination, filters, sorter) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const paginatedData = batchData?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    getAllBatches();
    checkCertificateAvailableFn();
  }, [certificateImageSrc]);

  let checkCertificateAvailableFn = () => {
    fetch(
      `https://certidigital-backend.onrender.com/certificate/certificateimage/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        // console.log("SEE", res);
        return res.json();
      })
      .then((data) => {
        console.log("data:", data);
        if (data.message === "Image not found") {
          setCertificateStatus(false);
        }
      })
      .catch((err) => {
        console.log("err: ", err);
        setCertificateStatus(true);
        setshowCsvButton(false);
      });
    if (certificateStatus) {
      setCertificateImageSrc(
        `https://certidigital-backend.onrender.com/certificate/certificateimage/${id}`
      );
    }
  };

  const columns = [
    {
      title: "Batch",
      dataIndex: "batch",
      align: "center",
      width: "15%",
      // sorter: (a, b) => a.id - b.id,
      render: (text, record) => {
        // console.log("ROUTEDDDD", text, record);
        return (
          <Link
            onClick={() => {
              localStorage.setItem("location", location.pathname);
            }}
            to={`/batchDetailTable/${record._id}`}
          >
            <span style={{ color: "#F94A29", fontWeight: "600" }}>{text}</span>
          </Link>
        );
      },
    },
    {
      title: "Total Certificates count",
      dataIndex: "fieldsLength",
      align: "center",
      width: "25%",
    },
  ];

  const getAllBatches = () => {
    fetch(
      `https://certidigital-backend.onrender.com/certificate/certificatedetails/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        data = data.map((item) => {
          item["fieldsLength"] =
            item.successemails.length + item.failedemails.length;
          return item;
        });
        console.log("data: ", data);
        setBatchData(data.reverse());
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const handleDownloadCSV = () => {
    fetch(
      `https://certidigital-backend.onrender.com/certificate/samplecsv/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        return response.blob();
      })
      .then((data) => {
        message.success("Downloading the Sample CSV file", 1.5);
        setTimeout(() => {
          const url = URL.createObjectURL(data);
          const a = document.createElement("a");
          a.href = url;
          let TemplateName = record?.name;
          a.download = `${TemplateName} Sample.csv`;
          document.body.appendChild(a);
          a.click();
        }, 1000);
      })
      .catch((err) => {
        console.log("err: ", err);
        message.error("Error saving the fields");
      });
  };

  return (
    <>
      <div className="templateDetailMainContainer">
        <HamburgerNavbar />
        <div className="templateDetailContainer">
          <div className="leftSideCertificateImageBox">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              <div>
                <span style={{ color: "#F94A29" }}>Template:</span>{" "}
                {record?.name}
                <div className="templateDetail__DownloadDetailBTNContainer">
                  <Tooltip placement="rightTop" title={"Download Certificate"}>
                    <Button
                      style={{ backgroundColor: "#1F2937" }}
                      type="primary"
                      icon={<DownloadOutlined />}
                      size={"small"}
                      onClick={() => {
                        // exportComponentAsJPEG(imageRef, "CERTIFICATE");
                        exportComponentAsPNG(imageRef, "Download.png");
                        // exportComponentAsPDF(imageRef, "Download.pdf", "letter");
                      }}
                    ></Button>
                  </Tooltip>
                </div>
              </div>
            </div>
            <img
              ref={imageRef}
              width={"100%"}
              src={
                certificateStatus
                  ? `https://certidigital-backend.onrender.com/certificate/certificateimage/${id}`
                  : certificateImageSrc
              }
              alt="CourseComplitionBlankTemplate"
            />
          </div>
          <div className="rightSideDetailsContainer">
            <div className="submitcsvDivContainer">
              <Button
                type="primary"
                block
                style={{
                  fontWeight: 600,
                }}
                disabled={showCsvButton}
                onClick={() => handleDownloadCSV()}
              >
                Download Sample CSV
              </Button>
              <Button
                style={{
                  ...(showCsvButton
                    ? { fontWeight: 600 }
                    : {
                        background: "#1F2937",
                        color: "White",
                        fontWeight: 600,
                      }),
                }}
                type="primary"
                disabled={showCsvButton}
                block
                onClick={() => navigate(`/bulkCertificates/${id}`)}
              >
                Generate Batch Certificate
              </Button>
              <Button
                style={{
                  fontWeight: 600,
                }}
                onClick={() => navigate(`/sampleTemplate`)}
                icon={<DoubleLeftOutlined />}
              >
                Back
              </Button>
            </div>
            <Table
              style={{ minHeight: "61.2vh" }}
              columns={columns}
              dataSource={
                batchData &&
                batchData.map((row, index) => ({
                  ...row,
                  key: index,
                }))
              }
              size="small"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: batchData?.length,
              }}
              onChange={handleTableChange}
            ></Table>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default TemplateDetail;

// import React from "react";
// import "../../Styles/Templatedetail.css";
// import { List, Card, Layout, theme, Button } from "antd";
// import HamburgerNavbar from "../../Components/HamburgerNavbar";
// import Footer from "../../Components/Footer";

// const TemplateDetail = () => {
//   const { Header, Content, Footer, Sider } = Layout;
//   const {
//     token: { colorBgContainer },
//   } = theme.useToken();

//   const CertificateDetails = () => {
//     const certificate = {
//       name: "Certificate Name",
//       issuer: "Certificate Issuer",
//       date: "Certificate Date",
//       details: ["Detail 1", "Detail 2", "Detail 3"],
//     };

//     return (
//       <Card
//         title="Certificate Details"
//         style={{
//           width: 350,
//           height: 590,
//         }}
//       >
//         <p>
//           <b>Certificate Name : </b>
//           {certificate.name}
//         </p>
//         <p>
//           <b>Certificate Name : </b>
//           {certificate.issuer}
//         </p>
//         <p>
//           <b>Certificate Name : </b>
//           {certificate.date}
//         </p>

//         <Button
//           style={{ marginTop: "30px", marginLeft: "20px" }}
//           type="primary"
//         >
//           Generate Certificate
//         </Button>
//       </Card>
//     );
//   };

//   return (
//     <div>
//       <HamburgerNavbar />
//       <Layout>
//         <Layout style={{}}>
//           <Content style={{ margin: "15px 29px 0" }}>
//             <div
//             // style={{
//             //   padding: 12,
//             //   minHeight: 560,
//             //   background: colorBgContainer,
//             // }}
//             >
//               <img
//                 src="https://previews.123rf.com/images/andipanggeleng/andipanggeleng1706/andipanggeleng170600013/80860152-blank-certificate-template.jpg"
//                 width={930}
//                 height={510}
//                 alt=""
//               />
//             </div>
//           </Content>
//           {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
//         </Layout>
//         <Sider
//           width={300}
//           style={{
//             marginTop: 15,
//             // background: colorBgContainer,
//           }}
//         >
//           <CertificateDetails />
//         </Sider>
//       </Layout>
//       <Footer />
//     </div>
//   );
// };

// export default TemplateDetail;
