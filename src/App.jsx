import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import ProblemDetail from "./pages/ProblemDetail";
import SearchResults from "./pages/SearchResults";
import CreateProfessional from "./pages/CreateProfessional";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./redux/slices/authSlice";
import { jwtDecode } from "jwt-decode";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        const username = decoded.username || decoded.sub;
        const role = decoded.role;

        dispatch(
          loginSuccess({
            token,
            username,
            role,
          })
        );
      } catch (err) {
        localStorage.removeItem("token");
      }
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/problem/:id" element={<ProblemDetail />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/create-professional" element={<CreateProfessional />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;