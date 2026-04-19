import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const navigate = useNavigate();
  const { token, username, role } = useSelector((state) => state.auth);

  const [pincode, setPincode] = useState("");

  // 🔍 Search Handler
  const handleSearch = (e) => {
    e.preventDefault();

    if (pincode.length !== 6) {
      toast.error("Enter valid 6-digit pincode");
      return;
    }

    navigate(`/search?pincode=${pincode}`);
    setPincode("");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-slate-900 shadow">

      {/* 🔹 LEFT: LOGO */}
      <Link
        to="/"
        className="text-xl font-bold text-white cursor-pointer"
      >
        FixMyArea
      </Link>

      {/* 🔹 CENTER: SEARCH BAR */}
      <form
        onSubmit={handleSearch}
        className="flex items-center w-full max-w-md mx-6"
      >

        <input
          type="text"
          placeholder="Search by Pincode"
          value={pincode}
          onChange={(e) => {
            if (!/^\d*$/.test(e.target.value)) return;
            if (e.target.value.length > 6) return;
            setPincode(e.target.value);
          }}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-yellow-400 text-black rounded-r-full hover:bg-yellow-500 transition"
        >
          Search
        </button>

      </form>

      {/* 🔹 RIGHT: AUTH */}
      <div className="flex items-center gap-4">

        {!token ? (
          <>
            <Link to="/login" className="text-white">
              Login
            </Link>

            <Link to="/register" className="text-white">
              Register
            </Link>

            {/* 🔹 NEW: Verify Account */}
            <Link
              to="/verify-otp"
              className="text-white"
            >
              Verify Account
            </Link>
          </>
        )  : (
          <>
          {role === "ADMIN" && (
            <button
              onClick={() => navigate("/create-professional")}
              className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-500 transition"
            >
              Create
            </button>
          )}

          {/* Profile */}
          <Link to="/profile" className="flex items-center gap-2 text-white">
            <span className="text-xl">👤</span>
            <span>{username}</span>
          </Link>
        </>
        )}

      </div>

    </header>
  );
};

export default Header;