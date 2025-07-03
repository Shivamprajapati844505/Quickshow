import axios from 'axios';


export const getUpcomingMovies = async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1',
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          accept: 'application/json'
        }
      }
    );

    res.status(200).json({ success: true, movies: response.data.results });
    
  } catch (error) {
    console.error('Error fetching upcoming movies:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch upcoming movies' });
  }
};
