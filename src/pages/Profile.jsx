import { useEffect, useState } from "react";
import API from "../api/axios";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRef } from "react";


const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Fetch Profile
  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // 🔹 Delete Account (placeholder)
const handleDelete = async () => {
    try {
      const res = await API.delete("/users/delete");

      // success toast
      toast.success(res.data.message || "Account deleted successfully");

      // cleanup auth
      localStorage.removeItem("token");
      dispatch(logout());

      // close modal
      setShowDeleteConfirm(false);

      // redirect
      navigate("/register");

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
};

const handleImageUpload = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  // Optional validation (recommended)
  if (!file.type.startsWith("image/")) {
    toast.error("Please select a valid image file");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    setUploading(true);

    const res = await API.post("/users/upload-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success(res.data.message);
    fetchProfile();

  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to upload image"
    );
  } finally {
    setUploading(false);
  }
};

const [editForm, setEditForm] = useState({
  username: "",
  gender: "",
  dateOfBirth: "",
});

const handleEditChange = (e) => {
  const { name, value } = e.target;
  setEditForm({ ...editForm, [name]: value });
};


const handleUpdateProfile = async () => {
  try {
    const res = await API.put("/users/update", editForm);

    toast.success(res.data.message || "Profile updated");

    setShowEditModal(false);

    fetchProfile();
  } catch (err) {
    toast.error(err.response?.data?.message || "Update failed");
  }
};

const [passwordForm, setPasswordForm] = useState({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const handlePasswordChange = (e) => {
  const { name, value } = e.target;
  setPasswordForm({ ...passwordForm, [name]: value });
};

const handleChangePassword = async () => {
  const { oldPassword, newPassword, confirmPassword } = passwordForm;

  // Validation
  if (!oldPassword || !newPassword || !confirmPassword) {
    toast.error("All fields are required");
    return;
  }

  if (newPassword.length < 6) {
    toast.error("New password must be at least 6 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    const res = await API.post("/users/change-password", {
      oldPassword,
      newPassword,
    });

    toast.success(res.data.message || "Password changed");

    // reset form
    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPasswordModal(false);

  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to change password");
  }
};
  

  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* 🔹 PROFILE HEADER */}
      <div className="flex items-center gap-6">

        {/* Profile Image */}
        <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />

          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">

            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl text-gray-500">👤</span>
            )}

          </div>

          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white rounded-full">
              Uploading...
            </div>
          )}

          {/* Hover Edit Icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition">
            <span className="text-white text-lg">✏️</span>
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-2xl font-bold">
          Welcome {user.username}!
        </h1>

      </div>

      {/* 🔹 ACCOUNT DETAILS */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Account Details
        </h2>

        <div className="space-y-2 text-gray-700">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile:</strong> {user.mobile}</p>
          <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
        </div>
      </div>

      {/* 🔹 ACTION BUTTONS */}
      <div className="mt-8 flex flex-wrap gap-4">

        <button
            onClick={() => {
              setEditForm({
                username: user.username || "",
                gender: user.gender || "",
                dateOfBirth: user.dateOfBirth || "",
              });
              setShowEditModal(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
          Edit Profile
        </button>

        <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            Change Password
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Delete Account
        </button>

      </div>

      {/* 🔵 EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-md w-80">

            <h2 className="text-lg font-semibold mb-4">
              Edit Profile
            </h2>

            {/* Username */}
            <input
              type="text"
              name="username"
              value={editForm.username}
              onChange={handleEditChange}
              placeholder="Username"
              className="w-full border p-2 mb-3"
            />

            {/* Gender */}
            <select
              name="gender"
              value={editForm.gender}
              onChange={handleEditChange}
              className="w-full border p-2 mb-3"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>

            {/* DOB */}
            <input
              type="date"
              name="dateOfBirth"
              value={editForm.dateOfBirth}
              onChange={handleEditChange}
              className="w-full border p-2 mb-4"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateProfile}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>

            </div>

          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-md w-80">

            <h2 className="text-lg font-semibold mb-4">
              Change Password
            </h2>

            {/* Old Password */}
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              className="w-full border p-2 mb-3"
            />

            {/* New Password */}
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full border p-2 mb-3"
            />

            {/* Confirm Password */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full border p-2 mb-4"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowPasswordModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleChangePassword}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Update
              </button>

            </div>

          </div>
        </div>
      )}

      {/* 🔹 LOGOUT */}
      <div className="mt-10">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="text-red-600 border border-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition"
        >
          Logout
        </button>
      </div>

      {/* 🔴 LOGOUT CONFIRM MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <p className="mb-4 font-medium">Are you sure you want to logout?</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Yes
              </button>

              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔴 DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <p className="mb-4 font-medium text-red-600">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;