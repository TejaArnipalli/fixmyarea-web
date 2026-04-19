import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblemById } from "../api/problemApi";
import ProblemImageSlider from "../components/ProblemImageSlider";
import CommentSection from "../components/CommentSection";
import { timeAgo } from "../utils/timeAgo";
import API from "../api/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProblemDetail = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [problem, setProblem] = useState(null);
  const [error, setError] = useState("");

  const [voteMessage, setVoteMessage] = useState("");

  const fetchProblem = async () => {
    try {
    const res = await getProblemById(id);
    setProblem(res.data.data);
    }
    catch (err) {
    setError(err.response?.data?.message || "Failed to load problem");
    }
};

  useEffect(() => {
    fetchProblem();
  }, [id]);

  useEffect(() => {
    if (voteMessage) {
      const timer = setTimeout(() => {
        setVoteMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [voteMessage]);

const handleVote = async () => {
  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const res = await API.post(`/problems/vote/${id}`);

    setVoteMessage(res.data.message); 

    fetchProblem();
  } catch (err) {
    setVoteMessage(
      err.response?.data?.message || "Error voting"
    );
  }
};

if (error) return <p>{error}</p>;
if (!problem) return <p>Loading...</p>;

  return (
  <div className="max-w-7xl mx-auto p-4">

    {/* 2 COLUMN LAYOUT */}
    <div className="flex gap-6 h-[80vh]">

      {/* LEFT SIDE (Problem Details) */}
      <div className="w-1/2 overflow-y-auto pr-2">

        {/* Images */}
        <ProblemImageSlider images={problem.imageUrls} />

        {/* TITLE + TIME */}
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-bold">
            {problem.title}
          </h1>
          <span className="text-gray-500 text-sm">
            {timeAgo(problem.createdAt)}
          </span>
        </div>

        {/* STATUS + VOTES */}
        <div className="flex justify-between items-center mt-2 text-gray-600">

          <span
            className={`px-3 py-1 text-white rounded ${
              problem.status === "OPEN"
                ? "bg-red-500"
                : problem.status === "IN_PROGRESS"
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          >
            {problem.status}
          </span>

          <span className="font-medium">
            👍 {problem.voteCount} Votes
          </span>

        </div>

        {/* PINCODE */}
        <div className="mt-3">
          <p className="text-lg font-semibold">
            Pincode: {problem.pincode}
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-4">

          {/* Vote */}
          <button
            onClick={handleVote}
            disabled={!token}
            className={`px-4 py-2 rounded text-white transition-transform duration-200 ${
              token
                ? "bg-green-500 hover:bg-green-600 hover:scale-105"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {token ? "Vote 👍" : "Login to Vote"}
          </button>

          {/* Map */}
          <a
            href={`https://www.google.com/maps?q=${problem.latitude},${problem.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded transition-transform duration-200 hover:bg-blue-600 hover:scale-105"
          >
            View on Map
          </a>

        </div>

        {/* Vote Message */}
        {voteMessage && (
          <p
            className={`mt-2 text-sm ${
              voteMessage.includes("added")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {voteMessage}
          </p>
        )}

        {/* DESCRIPTION */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">
            Description
          </h2>
          <p>{problem.description}</p>
        </div>

      </div>

      {/* RIGHT SIDE (Comments) */}
      <div className="w-1/2 overflow-y-auto border-l pl-4">

        <h2 className="text-lg font-semibold mb-4">
          Comments
        </h2>

        <CommentSection problemId={id} />

      </div>

    </div>

  </div>
);
};

export default ProblemDetail;