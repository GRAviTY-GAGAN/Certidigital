import "./App.css";
import { Route, Routes } from "react-router-dom";
import Signup from "./Pages/Signup";
import ConfirmAccount from "./Pages/ConfirmAccount/index";
import ConfirmSuccess from "./Pages/ConfirmSuccess/index";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword/index";
import ForgotPasswordMailSent from "./Pages/ForgotPasswordMailSent/index";
import ResetPasswordSuccess from "./Pages/ResetPasswordSuccess/index";
import ResetPassword from "./Pages/ResetPassword/index";
import SampleTemplate from "./Pages/SampleTemplate";
import SampleCertificate from "./Pages/SampleCertificate";
import Error404 from "./Pages/Error404";
import Studentview from "./Pages/StudentView";
import TemplateDetail from "./Pages/TemplateDetail";
import BulkCertificates from "./Pages/BulkCertificates";
import AdminRoutes from "./ProtectedRoutes/AdminRoutes";
import StudentRoutes from "./ProtectedRoutes/StudentRoutes";
import ChangePassword from "./Pages/ChangePassword";
import BatchDetailTable from "./Pages/BatchDetailTable";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/confirmAccount" element={<ConfirmAccount />} />
        <Route path="/confirmSuccess/:id" element={<ConfirmSuccess />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route
          path="/forgotPasswordMailSent"
          element={<ForgotPasswordMailSent />}
        />
        <Route path="/resetPassword/:id" element={<ResetPassword />} />
        <Route
          path="/resetPasswordSuccess"
          element={<ResetPasswordSuccess />}
        />
        <Route path="*" element={<Error404 />} />
        <Route path="/templatedetail/:id" element={<TemplateDetail />} />

        <Route path="/change-password" element={<ChangePassword />} />

        {/* Admin Routes */}
        <Route
          path="/sampletemplate"
          element={<AdminRoutes Component={SampleTemplate} />}
        />
        <Route
          path="/sampletemplate/:id"
          element={<AdminRoutes Component={SampleCertificate} />}
        />
        <Route
          path="/bulkCertificates/:id"
          element={<AdminRoutes Component={BulkCertificates} />}
        />
        <Route
          path="/batchDetailTable/:id"
          element={<AdminRoutes Component={BatchDetailTable} />}
        />

        {/* Student Routes */}
        <Route
          path="/userview"
          element={<StudentRoutes Component={Studentview} />}
        />
      </Routes>
    </div>
  );
}

export default App;
