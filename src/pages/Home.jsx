import { useEffect, useState } from "react";
import { getTopProblems } from "../api/problemApi";
import ProblemCard from "../components/ProblemCard";

const Home = () => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTopProblems();
  }, []);

  const fetchTopProblems = async () => {
  try {
    const res = await getTopProblems();

    console.log("API RESPONSE:", res.data); // 👈 debug

    setProblems(res.data?.data || []); // ✅ SAFE FIX

  } catch (err) {
    setError(err.response?.data?.message || "Failed to load problems");
    setProblems([]); // ✅ fallback
  }
};

  return (
    <div className="p-6">

      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-center">
        Trending Problems in India
      </h2>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-center mb-4">
          {error}
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

       {(problems || []).map((problem) => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}

      </div>
    </div>
  );
};

export default Home;