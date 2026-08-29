import emailjs from "@emailjs/browser";
import { emailConfig, isEmailConfigured } from "../config/emailConfig";
import { formatCurrency } from "./pricingUtils";

/**
 * Sends a "New Booking" notification email to the villa owner via EmailJS.
 * This never blocks or breaks the booking flow: if EmailJS hasn't been
 * configured yet (see src/config/emailConfig.js) or the request fails for
 * any reason, it simply logs a note to the console and resolves quietly —
 * the guest's confirmed reservation is unaffected either way.
 */
export const notifyOwnerOfBooking = async (booking, villa) => {
  if (!isEmailConfigured()) {
    console.info(
      "[NOVA] Owner email notifications are not set up yet. " +
      "See src/config/emailConfig.js for setup instructions."
    );
    return;
  }

  const isFunctionSpace = booking.bookingType === "function-space";

  const templateParams = {
    reservation_ref: booking.id,
    booking_type: booking.bookingType,
    villa_name: villa?.name || "NOVA",
    check_in: isFunctionSpace
      ? `${booking.functionSpace?.eventType || "Event"} on ${booking.checkIn}`
      : booking.checkIn,
    check_out: isFunctionSpace
      ? `${booking.functionSpace?.startTime || ""} - ${booking.functionSpace?.endTime || ""}`
      : booking.checkOut,
    guests: booking.guests,
    guest_name: booking.guest?.fullName || "",
    guest_email: booking.guest?.email || "",
    guest_phone: booking.guest?.phone || "",
    special_requests: booking.guest?.specialRequests || "None",
    total_amount: formatCurrency(booking.pricing?.total || 0),
    owner_email: emailConfig.ownerEmail,
  };

  try {
    await emailjs.send(
      emailConfig.serviceId.trim(),
      emailConfig.templateId.trim(),
      templateParams,
      { publicKey: emailConfig.publicKey.trim() }
    );
  } catch (err) {
    // Never let a failed notification email block the guest's confirmed booking.
    console.error("[NOVA] Failed to send owner notification email:", err);
  }
};
