import { Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Styles/confirmForgetReset.css";
import { useParams } from "react-router-dom";
import { useState } from "react";

const ConfirmSuccess = () => {
  const [confirmSuccessLoading, setConfirmSuccessLoading] = useState(false);
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();

  const handleConfirmSuccess = () => {
    setConfirmSuccessLoading(true);
    axios
      .patch(`http://localhost:8080/auth/emailConfirm/${id}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "Email verification successs") {
          message.success(
            "Email Successfully Verified, Now you can login to your account.",
            4
          );
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
        setConfirmSuccessLoading(false);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        message.error(errorMessage);
        setConfirmSuccessLoading(false);
      });
  };
  return (
    <>
      <div className="ConfirmAccountContainer">
        <div>
          <div id="mailOpeningDiv">
            <img
              width={"100%"}
              src="/Images/confirmSuccess.png"
              className="mailOpeningImage"
              alt="mailOpeningImage"
            />
          </div>
          <div className="mailOpeningRightDiv">
            <div className="mailOpeningHeading">
              <h1>Congratulations!</h1>
              <p>Your email has been successfully verified.</p>
              <p>Thank you for joining CertiDigital</p>
              <p>You can now log in and start using our platform</p>
              <Button
                loading={confirmSuccessLoading}
                type="primary"
                onClick={handleConfirmSuccess}
                style={{
                  background: "#1F2937",
                  color: "White",
                  fontWeight: 600,
                  width: "60%",
                }}
              >
                Click here to confirm your email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmSuccess;
