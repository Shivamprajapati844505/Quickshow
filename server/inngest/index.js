import { Inngest } from "inngest";
import User from './../models/User.js';
import Booking from './../models/Booking.js';
import Show from './../models/Show.js';
import sendEmail from './../configs/nodeMailer.js';


export const inngest = new Inngest({
  id: "movie-ticket-booking", 
  eventKey: process.env.INNGEST_EVENT_KEY, 
});

// Inngest function to save user data to a datebase
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    }
    await User.create(userData)
  }
);


// Inngest function to Delete user data to a datebase
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },

  async ({ event }) => {

    const { id } = event.data
    await User.findByIdAndDelete(id)
  }
);


// Inngest function to Update user data to a datebase
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },

  async ({ event }) => {
    const { id,first_name, last_name, email_addresses, image_url   } = event.data
     const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    }
    await User.findByIdAndUpdate(id, userData)
  }
);

//inngest Function to cancle booking and release seats of show after 10 minuts of booking created if payment is not made

// const releaseSeatsAndDeleteBooking = inngest.createFunction(
//   {id:'release-booking-after-timeout'},
//   {event:"app/checkpayment"},

//   async ({event, step}) => {
//   const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);

//   await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);
  
//   await step.run('check-payment-status', async()=>{
//     const bookingId = event.data.bookingId;
//     const booking = await Booking.findById(bookingId)

//     //If paymnet is not made release seats and delete booking
//     if(!booking.isPaid){
//       const show = await Show.findById(booking.show);
//       booking.bookedSeats.forEach((seat)=>{
//         delete show.occupiedSeats[seat]
//       })
//       show.markModified('occupiedSeats')
//       await show.save()
//       await Booking.findByIdAndDelete(booking._id)
//     }
//   })
// }
// )


//Innget Function to send email when user books a show
const sendBookingConfirmationEmail = inngest.createFunction(
  {id:"send-booking-confirmation-email"},
  {event:"app/show.booked"},
  async({event, step})=>{
    const {bookingId} = event.data;

    const booking = await Booking.findById(bookingId).populate({
      path: 'show',
      populate:{path:"movie", model:"Movie"}
    }).populate('user');
   
     await sendEmail({
      to:booking.user.email,
      subject:`Payment Confimation: "${booking.show.movie.title}" booked!`,
      body:`<div style="font-family:Arial, sans-serif; line-height:1.5;">
    <h2>Hi ${booking.user.name},</h2>
    <p>Your booking for <strong style="color:#F845656;">
      "🎬${booking.show.movie.title}"</strong> is confirmed 🎟️.</p>
      <p>
        <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocalDateString('en-US', {timeZone:'Asia/Kolkate'})} <br/>

        <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocalTimeString('en-US',{timeZone:'Asia/Kolkate'})}
      </p>
  <p>Enjoy your show!🍿 </p>
  <p>Thanks for booking with us! <br/>- QuickShow Team
  </p>

   </div>`
     })
      
  }

)

export const functions = [ syncUserCreation, syncUserDeletion , syncUserUpdation, sendBookingConfirmationEmail];
