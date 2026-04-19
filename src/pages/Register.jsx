import { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    username: "",
    password: "",
    gender: "",
    dateOfBirth: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.email.trim()) return "Email is required";

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return "Invalid email format";
    }

    if (!formData.username.trim()) return "Username is required";

    if (formData.mobile.length !== 10) {
      return "Mobile number must be exactly 10 digits";
    }

    if (!formData.password) return "Password is required";

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (!formData.gender) return "Please select gender";

    if (!formData.dateOfBirth) return "Date of birth is required";

    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        email: formData.email.trim(),
        username: formData.username.trim(),
        mobile: `+91${formData.mobile}`,
      };

      const res = await registerUser(payload);

      setSuccess(res.data.message);

      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            email: payload.email,
            mobile: payload.mobile,
          },
        });
      }, 1000);

      // reset form
      setFormData({
        email: "",
        mobile: "",
        username: "",
        password: "",
        gender: "",
        dateOfBirth: "",
      });

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-xl mb-4 font-semibold">Register</h2>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        {success && <p className="text-green-500 mb-3 text-sm">{success}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          className="w-full p-2 border mb-2"
          onChange={handleChange}
        />

        <input
          name="mobile"
          type="text"
          placeholder="Mobile (10 digits)"
          value={formData.mobile}
          className="w-full p-2 border mb-2"
          onChange={handleChange}
        />

        <input
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          className="w-full p-2 border mb-2"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          className="w-full p-2 border mb-2"
          onChange={handleChange}
        />

        <select
          name="gender"
          value={formData.gender}
          className="w-full p-2 border mb-2"
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>

        <input
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          className="w-full p-2 border mb-4"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="w-full bg-green-500 text-white p-2 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;