import React from "react";
import { formatCurrency } from "../utils/pricingUtils";
import { bookingConfig } from "../config/images";

export default function BookingSummary({
  bookingType,
  checkIn,
  checkOut,
  nights,
  hours,
  guests,
  selectedRooms = [],
  pricing,
  villaName
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getBookingTypeLabel = () => {
    switch (bookingType) {
      case "full-villa":
        return "Full Villa";
      case "single-room":
        return "Single Room";
      case "two-rooms":
        return "Two Rooms";
      case "three-rooms":
        return "Three Rooms";
      case "function-space":
        return "Function Space";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-white/5 text-sm font-light text-luxury-lightGray animate-fade-in text-left">
      {/* Reservation Mini-Header */}
      <h4 className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-semibold">
        4. Booking Summary
      </h4>

      {/* Reservation Details Card */}
      <div className="bg-white/[0.01] border border-white/5 p-4 space-y-3">
        <div className="flex justify-between items-start">
          <span className="text-xs">Property</span>
          <span className="text-white font-medium text-right">{villaName}</span>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-xs">Type</span>
          <span className="text-white font-medium text-right">{getBookingTypeLabel()}</span>
        </div>

        {selectedRooms.length > 0 && (
          <div className="flex justify-between items-start">
            <span className="text-xs">Selected Room{selectedRooms.length > 1 ? "s" : ""}</span>
            <div className="text-right text-white font-medium">
              {selectedRooms.map((room, idx) => (
                <div key={idx}>{room.name}</div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-start">
          {bookingType === "function-space" ? (
            <>
              <span className="text-xs">Event Date</span>
              <span className="text-white font-medium text-right">{formatDate(checkIn)}</span>
            </>
          ) : (
            <>
              <span className="text-xs">Duration</span>
              <span className="text-white font-medium text-right">
                {formatDate(checkIn)} – {formatDate(checkOut)}
                <div className="text-[10px] text-luxury-gold font-light">{nights} Night{nights > 1 ? "s" : ""}</div>
              </span>
            </>
          )}
        </div>

        <div className="flex justify-between items-start">
          {bookingType === "function-space" ? (
            <>
              <span className="text-xs">Duration</span>
              <span className="text-white font-medium text-right">{hours} Hours</span>
            </>
          ) : (
            <>
              <span className="text-xs">Guests</span>
              <span className="text-white font-medium text-right">{guests} Guest{guests > 1 ? "s" : ""}</span>
            </>
          )}
        </div>
      </div>

      {/* Cost Breakdown */}
      {pricing && (
        <div className="space-y-2.5 pt-2">
          <div className="flex justify-between text-xs">
            <span>
              {bookingType === "full-villa" && "Villa Rental Base"}
              {["single-room", "two-rooms", "three-rooms"].includes(bookingType) && "Rooms Base Charge"}
              {bookingType === "function-space" && "Function Space Rental"}
            </span>
            <span className="text-white font-medium">{formatCurrency(pricing.baseAmount)}</span>
          </div>

          {pricing.extraGuestFee > 0 && (
            <div className="flex justify-between text-xs">
              <span>Extra Guest Charges</span>
              <span className="text-white font-medium">{formatCurrency(pricing.extraGuestFee)}</span>
            </div>
          )}

          {pricing.extraChargeApplicable && (
            <div className="text-[11px] leading-relaxed text-luxury-gold/90 border border-luxury-gold/20 bg-luxury-gold/5 px-3 py-2">
              Extra guest ({pricing.extraGuestCount}) — extra charges are applicable and will be collected at the time of payment.
            </div>
          )}

          <div className="flex justify-between text-xs">
            <span>Luxury Cleaning Fee</span>
            <span className="text-green-400 font-medium font-sans uppercase text-[10px] tracking-wider bg-green-500/10 px-2 py-0.5 border border-green-500/20">Free</span>
          </div>

          {pricing.tax > 0 && (
            <div className="flex justify-between text-xs">
              <span>Luxury Tax & GST ({(bookingConfig.fees.taxPercent * 100).toFixed(0)}%)</span>
              <span className="text-white font-medium">{formatCurrency(pricing.tax)}</span>
            </div>
          )}

          <div className="w-full h-[1px] bg-white/5 my-2"></div>
          
          <div className="flex justify-between text-base font-serif font-medium text-white">
            <span>Estimated Total</span>
            <span className="text-luxury-gold text-glow">{formatCurrency(pricing.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
