
import Show from "../models/Show.js"
import Booking from './../models/Booking.js';
import Stripe from 'stripe';
import { inngest } from './../inngest/index.js';
import { scheduleCancelBooking } from './../configs/noPaymentCancelBooking.js';
import { emailBookingConfirmation } from './../configs/emailBookingConfirmation.js';


//Function to check availability of selected seats for movie
const checkSeatsAvailability = async(showId ,selectedSeats) => {
    try {
        
       const showData =  await Show.findById(showId)
       if(!showData) return false ;

       const occupiedSeats = showData.occupiedSeats;
       const isAnySeatTaken = selectedSeats.some(seat=> occupiedSeats[seat]);
       
       return !isAnySeatTaken;

    } catch (error) {
        console.error(error);
        return false;
        
        
    }
}

export const createBooking = async(req,res) =>{
    try {
          const {userId} = req.auth();
          const {showId, selectedSeats} = req.body;
          const {origin} = req.headers;

          //Check if Seat is available
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats)
        
        if(!isAvailable){
            return res.json({success:false , message:"Selected Seats are not available."})
        }

        //Get the show booking
        const showData = await Show.findById(showId).populate('movie');

        //create a new booking
       const booking = await Booking.create({
           user: userId,
           show: showId,
           amount: showData.showPrice * selectedSeats.length,
           bookedSeats: selectedSeats 
          })


       selectedSeats.map((seat)=>{
           showData.occupiedSeats[seat] = userId;
       })

       showData.markModified('occupiedSeats');
       await showData.save();
       
       //Stripe Gateway Initialize
       const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);


       //Creating line items to for Stripe
       const line_items= [{
        price_data:{
            currency:'usd',
            product_data:{
                name:showData.movie.title
            },
            unit_amount : Math.floor(booking.amount) *100
        },
        quantity: 1
       }]  

       const session = await stripeInstance.checkout.sessions.create({
        success_url:`${origin}/loading/my-bookings`,
        cancel_url: `${origin}/my-bookings`,
        line_items: line_items,
        mode:'payment',
        locale: 'auto',
        metadata:{
            bookingId: booking._id.toString()
        },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60, //Expire in 30 mintues
       })
       booking.paymentLink = session.url
       await booking.save()


       scheduleCancelBooking(booking._id);
       emailBookingConfirmation(booking._id);

    res.json({ success: true, url: session.url });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};



export const getOccupiedSeats = async (req,res) =>{
    try {

        const {showId} = req.params;
        const showData = await Show.findById(showId)
        const occupiedSeats = Object.keys(showData.occupiedSeats)
        res.json({success:true, occupiedSeats})
          
    } catch (error) {
         console.log(error.message);
        res.json({success:false, message:error.message})
    }


}