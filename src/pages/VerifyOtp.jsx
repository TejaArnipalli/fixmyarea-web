import { useState, useEffect } from "react";
import { sendOtp, verifyOtp } from "../api/authApi";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromRegister = location.state?.email || "";
  const mobileFromRegister = location.state?.mobile || "";

  const cleanedMobile = mobileFromRegister.replace("+91", "");

  const [email, setEmail] = useState(emailFromRegister);
  const [mobile, setMobile] = useState(cleanedMobile);

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);

  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);

  const [message, setMessage] = useState("");

  // 🔹 SEND EMAIL OTP
  const handleSendEmailOtp = async () => {
    try {
      const res = await sendOtp({
        target: email,
        type: "EMAIL",
      });

      setEmailOtpSent(true);
      setMessage(res.data.message || "Email OTP sent");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending email OTP");
    }
  };

  // 🔹 VERIFY EMAIL OTP
  const handleVerifyEmailOtp = async () => {
    try {
      const res = await verifyOtp({
        target: email,
        otp: emailOtp,
        type: "EMAIL",
      });

      setEmailVerified(true);
      setMessage(res.data.message || "Email verified ✅");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid email OTP");
    }
  };

  // 🔹 SEND MOBILE OTP
  const handleSendMobileOtp = async () => {
    try {
      const res = await sendOtp({
        target: "+91" + mobile,
        type: "MOBILE",
      });

      setMobileOtpSent(true);
      setMessage(res.data.message || "Mobile OTP sent");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending mobile OTP");
    }
  };

  // 🔹 VERIFY MOBILE OTP
  const handleVerifyMobileOtp = async () => {
    try {
      const res = await verifyOtp({
        target: "+91" + mobile,
        otp: mobileOtp,
        type: "MOBILE",
      });

      setMobileVerified(true);
      setMessage(res.data.message || "Mobile verified ✅");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid mobile OTP");
    }
  };

  useEffect(() => {
    if (emailVerified && mobileVerified) {
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  }, [emailVerified, mobileVerified, navigate]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">

      <h2 className="text-xl font-bold mb-4">Verify OTP</h2>

      {message && <p className="mb-3 text-sm text-blue-500">{message}</p>}

      {/* EMAIL SECTION */}
      <div className="mb-4">
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-2"
        />

        <button
          onClick={handleSendEmailOtp}
          disabled={emailVerified}
          className="bg-blue-500 text-white px-3 py-1 disabled:opacity-50"
        >
          Send OTP
        </button>

        {emailOtpSent && !emailVerified && (
          <>
            <input
              type="text"
              placeholder="Enter Email OTP"
              value={emailOtp}
              onChange={(e) => setEmailOtp(e.target.value)}
              className="w-full border p-2 mt-2"
            />

            <button
              onClick={handleVerifyEmailOtp}
              className="bg-green-500 text-white px-3 py-1 mt-2"
            >
              Verify
            </button>
          </>
        )}

        {emailVerified && <p className="text-green-500">Verified ✅</p>}
      </div>

      {/* MOBILE SECTION */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full border p-2 mb-2"
        />

        <button
          onClick={handleSendMobileOtp}
          disabled={mobileVerified}
          className="bg-blue-500 text-white px-3 py-1 disabled:opacity-50"
        >
          Send OTP
        </button>

        {mobileOtpSent && !mobileVerified && (
          <>
            <input
              type="text"
              placeholder="Enter Mobile OTP"
              value={mobileOtp}
              onChange={(e) => setMobileOtp(e.target.value)}
              className="w-full border p-2 mt-2"
            />

            <button
              onClick={handleVerifyMobileOtp}
              className="bg-green-500 text-white px-3 py-1 mt-2"
            >
              Verify
            </button>
          </>
        )}

        {mobileVerified && <p className="text-green-500">Verified ✅</p>}
      </div>

    </div>
  );
};

export default VerifyOtp;