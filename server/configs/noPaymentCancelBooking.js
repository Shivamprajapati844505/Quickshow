import Booking from "../models/Booking.js";
import Show from "../models/Show.js";


export const scheduleCancelBooking = (bookingId, delayInMs = 10 * 60 * 1000) => {
  setTimeout(async () => {
    try {
      const booking = await Booking.findById(bookingId);
      if (booking && !booking.isPaid) {
        const show = await Show.findById(booking.show);
        booking.bookedSeats.forEach((seat) => {
          delete show.occupiedSeats[seat];
        });
        show.markModified("occupiedSeats");
        await show.save();
        await Booking.findByIdAndDelete(bookingId);
      }
    } catch (error) {
      console.error(" Error auto-canceling booking:", error.message);
    }
  }, delayInMs);
};
