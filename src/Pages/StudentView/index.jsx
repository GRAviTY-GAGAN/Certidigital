import React, { useEffect, useRef, useState } from "react";
import { Button, Tooltip, Card, Image } from "antd";
import HamburgerNavbar from "../../Components/HamburgerNavbar";
import Footer from "../../Components/Footer";
import "../../Styles/studentView.css";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "react-share";
import { DownloadOutlined } from "@ant-design/icons";
import {
  exportComponentAsJPEG,
  exportComponentAsPDF,
  exportComponentAsPNG,
} from "react-component-export-image";

import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";

function Studentview() {
  let imageID = document.getElementById("image");
  const [data, setData] = useState([]);
  const { Meta } = Card;
  const imageRef = useRef();
  const authDetails = JSON.parse(localStorage.getItem("authDetails"));
  let token = authDetails?.token;

  useEffect(() => {
    handleStudentCertificate();
  }, []);

  const handleStudentCertificate = () => {
    fetch("https://certidigital-backend.onrender.com/student/certificate", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("data: ", data);
        setData(data);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };

  return (
    <div>
      <HamburgerNavbar />
      {Array.isArray(data) && data.length > 0 ? (
        <h3 style={{ textAlign: "center", height: "6vh" }}>
          Certificates you have achieved
        </h3>
      ) : (
        <h3 style={{ textAlign: "center", height: "6vh" }}>
          We do not have any certificate associated with your email address.
        </h3>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
          justifyContent: "center",
          minHeight: "57.9vh",
          marginBottom: 20,
        }}
      >
        {Array.isArray(data) && data.length > 0
          ? data.map((item) => (
              <Card
                key={item.id}
                hoverable
                style={{
                  width: "auto",
                  height: data.length <= 4 ? 330 : "auto",
                }}
                cover={
                  <div style={{ width: "350px" }} ref={imageRef}>
                    <Image
                      id="image"
                      src={`https://certidigital-backend.onrender.com/student/certificateimages/${item.id}`}
                      alt={`${item.batch}`}
                      style={{ width: "100%" }}
                      preview={{
                        mask: (
                          <div style={{ background: "rgba(0, 0, 0, 0.5)" }} />
                        ),
                      }}
                    />
                  </div>
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "green",
                    padding: "0px 0 10px 0",
                  }}
                >
                  <Meta title={item.batch} />
                  {/* <Button>Share</Button> */}
                  <div className="studentView__DownloadDetailBTNContainer">
                    <Tooltip
                      placement="rightTop"
                      title={"Download Certificate"}
                    >
                      <Button
                        style={{ backgroundColor: "#1F2937" }}
                        type="primary"
                        icon={<DownloadOutlined />}
                        size={"small"}
                        onClick={() => {
                          // imageID.childNodes[0].style.width = "800px";
                          imageRef.current.style.width = "800px";
                          exportComponentAsPNG(imageRef, "Download.png");
                          imageRef.current.style.width = "350px";
                          // imageID.childNodes[0].style.width = "350px";
                        }}
                      ></Button>
                    </Tooltip>
                  </div>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h3 style={{ color: "#F94A29" }}>Share:</h3>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      width: "65%",
                    }}
                  >
                    <FacebookShareButton
                      url={`https://certidigital-backend.onrender.com/student/certificateimages/${item.id}`}
                      quote={item.name}
                    >
                      <FacebookIcon round={true} size={40}></FacebookIcon>
                    </FacebookShareButton>
                    <WhatsappShareButton
                      url={`https://certidigital-backend.onrender.com/student/certificateimages/${item.id}`}
                      title={item.name}
                    >
                      <WhatsappIcon round={true} size={40} />
                    </WhatsappShareButton>
                    <TwitterShareButton
                      url={`https://certidigital-backend.onrender.com/student/certificateimages/${item.id}`}
                      title={item.name}
                    >
                      <TwitterIcon round={true} size={40} />
                    </TwitterShareButton>
                    <LinkedinShareButton
                      url={`https://certidigital-backend.onrender.com/student/certificateimages/${item.id}`}
                      title={item.name}
                    >
                      <LinkedinIcon round={true} size={40} />
                    </LinkedinShareButton>
                  </div>
                </div>
              </Card>
            ))
          : null}
      </div>
      <Footer />
    </div>
  );
}
export default Studentview;

{
  /* <Button onClick={showModal}>Share</Button>
<Modal
  open={visible}
  onCancel={handleCancel}
  footer={null}
  title="Share Certificate"
  backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
>
  <Row gutter={[16, 16]}>
    <Col span={8}>
      <FacebookShareButton
        url={`https://certidigital-backend.onrender.com/student/certificateimages/${item.id}`}
        quote={item.name}
      >
        Facebook
      </FacebookShareButton>
    </Col>
    <Col span={8}>
      <TwitterShareButton
        url={`https://certidigital-backend.onrender.com/student/certificateimages/${item.id}`}
        title={item.name}
      >
        Twitter
      </TwitterShareButton>
    </Col>
    <Col span={8}>
      <LinkedinShareButton
        url={`https://certidigital-backend.onrender.com/student/certificateimages/${item.id}`}
        title={item.name}
      >
        LinkedIn
      </LinkedinShareButton>
    </Col>
  </Row>
</Modal> */
}
