import React from 'react'
import { dummyShowsData } from './../assets/assets';
import MovieCard from './../components/MovieCard';
import BlureCircle from './../components/BlureCircle';

const Movies = () => {
  return dummyShowsData.length > 0 ? (
    <div  className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlureCircle top='200px' left='0px'/>
      <BlureCircle bottom='150px' right='100px'/>
   <h1 className='text-lg font-medium my-4'>Now Showing</h1>
   <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6'>
    {dummyShowsData.map((movie)=>(
      <MovieCard movie={movie} key ={movie._id}/>
    ))}
   </div>
    </div>
  ):(
    <div className='flex flex-col items-center justify-center h-screen'>
  <h1 className='text-3xl font-bold text-center'>No movies Available</h1>
    </div>
  )
}

export default Movies