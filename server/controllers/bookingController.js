
import Show from "../models/Show.js"
import Booking from './../models/Booking.js';


//Function to check availability of selected seats for movie
const checkSeatsAvailability = async(showId ,selectedSeats) => {
    try {
        
       const shoeData =  await Show.findById(showId)
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
            bookedSeats:selectedSeats
       })

       selectedSeats.map((seat)=>{
           showData.occupiedSeats[seat] = userId;
       })

       showData.markModified('occupiedSeats');

       await showData.save();
       
       //Stripe Gateway Initialize

       res.json({success: true , message:'Booked successfully'})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
        
    }
    
}

export const getOccupiedSeats = async (req,res) =>{
    try {

        const {showId} = req.params;
        const showData = await Show .findById(showId)
        const occupiedSeats = Object.keys(showData.occupiedSeats)
        res.json({success:true, occupiedSeats})
          
    } catch (error) {
         console.log(error.message);
        res.json({success:false, message:error.message})
    }


}