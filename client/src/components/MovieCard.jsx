import React from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "lucide-react";
import timeFormat from './../lib/timeFormate';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-full max-w-xs sm:max-w-sm md:max-w-[400px] mx-auto h-full">

  <img
    onClick={() => {
      navigate(`/movies/${movie._id}`);
      scrollTo(0, 0);
    }}
    src={movie.poster_path}
    alt="Movie image"
    className="rounded-lg h-48 sm:h-56 md:h-64 w-full object-cover object-center cursor-pointer"
  />

  <p className="font-semibold mt-2 text-sm sm:text-base truncate">{movie.title}</p>

  <p className="text-xs sm:text-sm text-gray-400 mt-1 leading-tight">
    {new Date(movie.release_date).getFullYear()} ·{" "}
    {movie.genres.slice(0, 2).map((genre) => genre.name).join(" | ")} ·{" "}
    {timeFormat(movie.runtime)}
  </p>

  <div className="flex items-center justify-between mt-3">
    <button
      onClick={() => {
        navigate(`/movies/${movie._id}`);
        scrollTo(0, 0);
      }}
      className="px-3 py-1 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium"
    >
      Buy Tickets
    </button>

    <p className="flex items-center gap-1 text-xs text-gray-400">
      <StarIcon className="w-4 h-4 text-primary fill-primary" />
      {movie.vote_average.toFixed(1)}
    </p>
  </div>
</div>


  );
};

export default MovieCard;
