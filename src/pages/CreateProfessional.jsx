import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateProfessional = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    username: "",
    gender: "",
    dateOfBirth: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    if (name === "pincode") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 6) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.mobile.length !== 10) {
      toast.error("Mobile must be 10 digits");
      return;
    }

    if (formData.pincode.length !== 6) {
      toast.error("Pincode must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        mobile: "+91" + formData.mobile,
      };

      const res = await API.post("/users/create-professional", payload);

      toast.success(res.data.message);

      navigate("/"); // go back after success
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating professional");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Create New Professional
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          name="mobile"
          type="text"
          placeholder="Mobile (10 digits)"
          className="w-full border p-2"
          value={formData.mobile}
          onChange={handleChange}
        />

        <input
          name="username"
          type="text"
          placeholder="Username"
          className="w-full border p-2"
          value={formData.username}
          onChange={handleChange}
        />

        <select
          name="gender"
          className="w-full border p-2"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>

        <input
          name="dateOfBirth"
          type="date"
          className="w-full border p-2"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />

        <input
          name="pincode"
          type="text"
          placeholder="Pincode"
          className="w-full border p-2"
          value={formData.pincode}
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500 transition"
        >
          {loading ? "Creating..." : "Create"}
        </button>

      </form>

    </div>
  );
};

export default CreateProfessional;