import { useNavigate } from "react-router-dom";

const ProblemCard = ({ problem }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/problem/${problem.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-300"
    >
      {/* IMAGE */}
      <img
        src={problem.imageUrls?.[0]}
        alt="problem"
        className="w-full h-48 object-cover"
      />

      {/* CONTENT */}
      <div className="p-4">

        {/* TITLE */}
        <h2 className="text-lg font-semibold mb-2 line-clamp-2">
          {problem.title}
        </h2>

        {/* STATUS + VOTES */}
        <div className="flex justify-between items-center text-sm text-gray-600">

          <span
            className={`px-2 py-1 rounded text-white ${
              problem.status === "OPEN"
                ? "bg-red-500"
                : problem.status === "IN_PROGRESS"
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          >
            {problem.status}
          </span>

          <span>👍 {problem.voteCount}</span>

        </div>

      </div>
    </div>
  );
};

export default ProblemCard;