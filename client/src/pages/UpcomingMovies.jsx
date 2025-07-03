import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StarIcon } from 'lucide-react';
import { useAppContext } from './../context/AppContext';
import Loading from './../components/Loading';
import { fullDate } from '../lib/dateFormat.js';
import BlureCircle from './../components/BlureCircle';

const UpcomingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { image_base_url } = useAppContext();

  useEffect(() => {
    const getUpcomingMovies = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/movies/upcoming');
        setMovies(res.data.movies);
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
      } finally {
        setLoading(false);
      }
    };

    getUpcomingMovies();
  }, []);

  // Filter only future release date movies
  const today = new Date();
  const filteredMovies = movies.filter((movie) => {
    const releaseDate = new Date(movie.release_date);
    return releaseDate >= today;
  });

  return (
    <div className="min-h-screen px-4 md:px-16 py-40 bg-[#09090B]">
         <BlureCircle top="200px" left="0px" />
         <BlureCircle bottom="150px" right="100px" />

      <h1 className="text-lg font-medium text-white ml-30">Upcoming Movies</h1>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-30 py-10 ">
          <BlureCircle top="200px" left="0px" />

          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-full max-w-xs sm:max-w-sm md:max-w-[300px] mx-auto h-[380px]"
            >
              <img
                src={image_base_url + movie.backdrop_path}
                alt={movie.title}
                className="rounded-lg h-48 sm:h-56 md:h-64 w-full object-cover object-center cursor-pointer"
              />

              <p className="font-semibold mt-2 text-sm sm:text-base truncate text-white">
                {movie.title}
              </p>

              <p className="text-xs sm:text-sm text-gray-400 mt-1 leading-tight">
                {fullDate(movie.release_date)} • {movie.original_language.toUpperCase()}
              </p>

              <p className="text-xs text-gray-300 mt-2 line-clamp-3">
                {movie.overview || 'No description available.'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingMovies;
