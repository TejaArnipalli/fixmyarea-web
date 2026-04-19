import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import ProblemCard from "../components/ProblemCard";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const pincode = searchParams.get("pincode");

  const [problems, setProblems] = useState([]);
  const [professional, setProfessional] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [problemRes, profRes] = await Promise.all([
        API.get(`/problems?pincode=${pincode}`),
        API.get(`/users/professional/${pincode}`),
      ]);

      setProblems(problemRes.data.data);
      setProfessional(profRes.data.data);

    } catch (err) {
      setError("No data found for this pincode");
    }
  };

  useEffect(() => {
    if (pincode) fetchData();
  }, [pincode]);

  if (error) return <p className="text-center mt-10">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">

      {/* 🔹 PROFESSIONAL INFO */}
      {professional && (
        <div className="flex items-center gap-4 mb-6">

          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {professional.profilePicture ? (
              <img
                src={professional.profilePicture}
                alt="prof"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl">👤</span>
            )}
          </div>

          <h2 className="text-xl font-semibold">
            {professional.username}
          </h2>

        </div>
      )}

      {/* 🔹 PROBLEM GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {problems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}

      </div>

    </div>
  );
};

export default SearchResults;