import express from 'express';
import { getUpcomingMovies } from '../controllers/upComingController.js';

const upComingRouter = express.Router();


upComingRouter.get('/upcoming', getUpcomingMovies);

export default upComingRouter;
