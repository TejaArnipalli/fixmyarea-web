import { useState } from "react";

const ProblemImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full">
      <img
        src={images[index]}
        alt="problem"
        className="w-full h-80 object-cover rounded-lg"
      />

      {/* Buttons */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 bg-black text-white px-2 py-1"
      >
        ◀
      </button>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 bg-black text-white px-2 py-1"
      >
        ▶
      </button>
    </div>
  );
};

export default ProblemImageSlider;