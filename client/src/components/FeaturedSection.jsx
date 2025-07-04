import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import BlureCircle from "./BlureCircle";
import MovieCard from "./MovieCard";
import { useAppContext } from './../context/AppContext';

const FeaturedSection = () => {
  const navigate = useNavigate();
  const {shows} = useAppContext()

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlureCircle top="0" right="-80px" />
        <p className="text-gray-300 font-medium text-lg">Now Showing</p>
        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
        > View All
          <ArrowRight className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-6">
        {shows.slice(0,4).map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="px-8 py-3 text-sm sm:text-base md:text-lg bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer "
        >
          Show more
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;
