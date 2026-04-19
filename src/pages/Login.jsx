import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    deviceType: "WEB",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const dispatch = useDispatch();

const handleLogin = async (e) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const res = await API.post("/users/login", formData);

    const token = res.data.message;

    localStorage.setItem("token", token);

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

    navigate("/");

  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-xl mb-4 font-semibold">Login</h2>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-2"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;