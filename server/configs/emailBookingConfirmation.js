import sendEmail from "./nodeMailer.js";
import Booking from "../models/Booking.js";

export const emailBookingConfirmation = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate({
        path: "show",
        populate: { path: "movie", model: "Movie" },
      })
      .populate("user");

    if (!booking) throw new Error("Booking not found");

    const emailBody = `
      <div style="font-family:Arial, sans-serif; line-height:1.5;">
        <h2>Hi ${booking.user.name},</h2>
        <p>Your booking for 
        <strong style="color:#F84565;">🎬 ${booking.show.movie.title}</strong> is confirmed 🎟️.</p>
        <p>
          <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })} <br/>
          <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}
        </p>
        <p>Enjoy your show! 🍿</p>
        <p>Thanks for booking with us! <br/> - QuickShow Team</p>
      </div>
    `;

    await sendEmail({
      to: booking.user.email,
      subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
      body: emailBody,
    });

    console.log("Booking confirmation email sent.");
  } catch (err) {
    console.error("Failed to send booking email:", err.message);
  }
};
