


import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import upComingRouter from './routes/upComingRouter.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';


const app = express();
const PORT = 3000;

await connectDB()


//Stripe Webhooks Route
app.use('/api/stripe', express.raw({type:'application/json'}),stripeWebhooks)


//Middleware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware());


//API Routes
app.get('/',(req,res)=>res.send('Server is Live'))
app.use('/api/inngest', serve({client: inngest, functions}))
app.use('/api/show', showRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)
app.use('/api/movies', upComingRouter);

app.listen(PORT,()=>{
    console.log(`Server is listening at http://localhost:${PORT}`);  
});  