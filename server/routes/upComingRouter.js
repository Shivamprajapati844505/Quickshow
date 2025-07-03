import express from 'express';
import { getUpcomingMovies } from '../controllers/upComingController.js';

const router = express.Router();


router.get('/upcoming', getUpcomingMovies);

export default router;
