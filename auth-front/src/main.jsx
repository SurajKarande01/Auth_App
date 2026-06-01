import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Signup from "./pages/Signup.jsx";
import RootLayout from "./pages/RootLayout.jsx";
import Userlayout from "./pages/users/Userlayout.jsx";
import Userhome from "./pages/users/Userhome.jsx";
import Userprofile from "./pages/users/Userprofile.jsx";
import OAuthSuccess from "./pages/OAuthSuccess.jsx";
import OAuthFailure from "./pages/OAuthFailure.jsx";
import NotFound from "./pages/NotFound.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Userlayout />}>
          <Route index element={<Userhome />} />
          <Route path="profile" element={<Userprofile />} />
          {/* .... */}
        </Route>
        <Route path="oauth/success" element={<OAuthSuccess />} />
        <Route path="oauth/failure" element={<OAuthFailure />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
