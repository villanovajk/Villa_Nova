import React, { useState } from "react";
import { X, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { saveBooking, generateBookingRef } from "../utils/bookingUtils";
import { formatCurrency } from "../utils/pricingUtils";
import { notifyOwnerOfBooking } from "../utils/notifyUtils";
import { useNavigate } from "react-router-dom";

export default function CheckoutModal({ isOpen, onClose, villa, bookingDetails }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Confirmed booking state
  const [reservationRef] = useState(() => generateBookingRef());
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const [formData, setFormData] = useState({
    // Contact Info
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
    // Event specific info
    companyName: "",
    eventRequirements: "",
    seatingRequirements: "",
    cateringRequirements: "",
  });

  if (!isOpen || !bookingDetails) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build new booking object
      const newBooking = {
        id: reservationRef,
        bookingType: bookingDetails.bookingType,
        villaId: bookingDetails.villaId,
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        guests: bookingDetails.guests,
        rooms: bookingDetails.rooms,
        functionSpace: bookingDetails.functionSpace ? {
          eventType: bookingDetails.functionSpace.eventType,
          startTime: bookingDetails.functionSpace.startTime,
          endTime: bookingDetails.functionSpace.endTime,
          guests: bookingDetails.guests,
          companyName: formData.companyName,
          eventRequirements: formData.eventRequirements,
          seatingRequirements: formData.seatingRequirements,
          cateringRequirements: formData.cateringRequirements
        } : null,
        guest: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests
        },
        pricing: {
          baseAmount: bookingDetails.pricing.baseAmount,
          extraGuestFee: bookingDetails.pricing.extraGuestFee,
          cleaningFee: bookingDetails.pricing.cleaningFee,
          serviceFee: bookingDetails.pricing.serviceFee,
          tax: bookingDetails.pricing.tax,
          total: bookingDetails.pricing.total
        },
        status: "confirmed",
        createdAt: new Date().toISOString()
      };

      // Write to in-memory storage
      saveBooking(newBooking);
      setConfirmedBooking(newBooking);
      setStep(2);

      // Fire-and-forget: notify the owner by email. This never blocks or
      // fails the guest's confirmation even if the email doesn't go through.
      await notifyOwnerOfBooking(newBooking, villa);
    } catch (err) {
      console.error("Registration failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getHeaderTitle = () => {
    if (step === 2) return "Registration Confirmed";
    if (bookingDetails.bookingType === "full-villa") {
      return "Secure Your Stay";
    }
    if (bookingDetails.bookingType === "function-space") {
      return "Reserve Your Function Space";
    }
    return "Reserve Your Private Rooms";
  };

  const getBookingTypeLabel = () => {
    switch (bookingDetails.bookingType) {
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

  const handleReturnHome = () => {
    onClose();
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Black Translucent Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
        onClick={step === 2 ? handleReturnHome : undefined}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-luxury-dark border border-white/10 w-full max-w-2xl mx-auto shadow-glass overflow-hidden z-10 animate-fade-in-up text-left flex flex-col my-8">
        {/* Close Button */}
        {step !== 2 && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors duration-200"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}

        {/* Modal Header */}
        <div className="p-6 md:p-8 border-b border-white/5 bg-luxury-charcoal flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
              Reservation Checkout
            </span>
            <h3 className="text-xl md:text-2xl font-serif font-light text-white mt-1">
              {getHeaderTitle()}
            </h3>
          </div>
          {step !== 2 && (
            <div className="text-xs tracking-widest text-luxury-lightGray bg-white/5 px-3 py-1.5 border border-white/5 uppercase">
              Registration Form
            </div>
          )}
        </div>

        {/* Checkout Steps Body */}
        <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto no-scrollbar">
          
          {/* STEP 1: Guest / Contact / Event Details */}
          {step === 1 && (
            <form onSubmit={handleRegistrationSubmit} className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-medium">
                  1. Contact & Guest Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] uppercase tracking-widest text-white/50">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Alexander Mercer"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="bg-white/[0.02] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] uppercase tracking-widest text-white/50">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. alexander@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-white/[0.02] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] uppercase tracking-widest text-white/50">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +1 (555) 019-2834"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-white/[0.02] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                    />
                  </div>
                  {bookingDetails.bookingType === "function-space" && (
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[11px] uppercase tracking-widest text-white/50">Company Name (Optional)</label>
                      <input
                        type="text"
                        name="companyName"
                        placeholder="e.g. Sterling Enterprises"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="bg-white/[0.02] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                      />
                    </div>
                  )}
                </div>

                {/* Additional Function Space Specific Fields */}
                {bookingDetails.bookingType === "function-space" ? (
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-medium">
                      Event Protocols & Layouts
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[11px] uppercase tracking-widest text-white/50">Seating Configuration</label>
                        <textarea
                          name="seatingRequirements"
                          rows="2"
                          placeholder="e.g. Round tables, lounge setup, theater layout..."
                          value={formData.seatingRequirements}
                          onChange={handleInputChange}
                          className="bg-white/[0.02] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200 resize-none"
                        ></textarea>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[11px] uppercase tracking-widest text-white/50">Catering Requirements</label>
                        <textarea
                          name="cateringRequirements"
                          rows="2"
                          placeholder="e.g. Vegetarian buffet, fine dining course, bar service..."
                          value={formData.cateringRequirements}
                          onChange={handleInputChange}
                          className="bg-white/[0.02] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200 resize-none"
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[11px] uppercase tracking-widest text-white/50">Event Technical / Stage Requirements</label>
                      <textarea
                        name="eventRequirements"
                        rows="2"
                        placeholder="e.g. Sound system setup, microphone, projector, staging..."
                        value={formData.eventRequirements}
                        onChange={handleInputChange}
                        className="bg-white/[0.02] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200 resize-none"
                      ></textarea>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col space-y-1.5">
                  <label className="text-[11px] uppercase tracking-widest text-white/50">Special Requests / Concierge Requirements</label>
                  <textarea
                    name="specialRequests"
                    rows="3"
                    placeholder={
                      bookingDetails.bookingType === "function-space" 
                        ? "e.g. Valet details, early vendor access..."
                        : "e.g. Airport transfer coordinates, dietary preferences, pre-arrival villa stocking..."
                    }
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    className="bg-white/[0.02] border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200 resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Summary widget inside checkout */}
              <div className="bg-white/[0.02] border border-white/5 p-4 space-y-3">
                <div className="flex justify-between text-xs tracking-wider text-luxury-lightGray">
                  <span>Type:</span>
                  <span className="text-white font-medium">{getBookingTypeLabel()}</span>
                </div>
                {bookingDetails.selectedRoomsDetail && bookingDetails.selectedRoomsDetail.length > 0 && (
                  <div className="flex justify-between text-xs tracking-wider text-luxury-lightGray">
                    <span>Rooms:</span>
                    <span className="text-white font-medium text-right">
                      {bookingDetails.selectedRoomsDetail.map((r, i) => (
                        <div key={i}>{r.name}</div>
                      ))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xs tracking-wider text-luxury-lightGray">
                  <span>Duration / Date:</span>
                  <span className="text-white font-medium text-right">
                    {bookingDetails.bookingType === "function-space" ? (
                      <>
                        {formatDate(bookingDetails.checkIn)} ({bookingDetails.functionSpace.hours} Hours)
                        <div className="text-[10px] text-luxury-gold font-light">
                          {bookingDetails.functionSpace.startTime} – {bookingDetails.functionSpace.endTime}
                        </div>
                      </>
                    ) : (
                      <>
                        {formatDate(bookingDetails.checkIn)} – {formatDate(bookingDetails.checkOut)} ({bookingDetails.nights} Nights)
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xs tracking-wider text-luxury-lightGray">
                  <span>Capacity:</span>
                  <span className="text-white font-medium">
                    {bookingDetails.guests} Guest{bookingDetails.guests > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between text-xs tracking-wider text-luxury-lightGray border-t border-white/5 pt-2">
                  <span>Estimated Total:</span>
                  <span className="text-luxury-gold font-serif font-medium text-sm">
                    {formatCurrency(bookingDetails.pricing.total)}
                  </span>
                </div>
              </div>

              {/* CTA Action */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-luxury-gold hover:bg-luxury-gold-accent hover:shadow-gold-glow text-luxury-black font-semibold text-xs tracking-widest uppercase py-4 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Register</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Booking Success Confirmation Screen */}
          {step === 2 && confirmedBooking && (
            <div className="text-center py-6 space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mx-auto shadow-gold-glow">
                <CheckCircle2 size={36} className="text-luxury-gold" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-semibold flex items-center justify-center gap-1.5">
                  <Sparkles size={12} />
                  <span>Registration Confirmed</span>
                </span>
                <h4 className="text-2xl md:text-3xl font-serif font-light text-white">
                  Welcome to {villa.name}
                </h4>
              </div>

              <p className="text-sm font-light text-luxury-lightGray max-w-md mx-auto leading-relaxed font-sans">
                Thank you for registering your booking interest at NOVA Villa, {formData.fullName}. 
                Your registration has been received, and our villa management team has been notified via email. 
                We will contact you shortly at <span className="text-white font-medium">{formData.phone}</span> to confirm your dates and complete the booking.
              </p>

              {/* Receipt Ticket Details */}
              <div className="bg-luxury-charcoal border border-white/5 max-w-md mx-auto p-6 space-y-4 text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-xs font-light text-luxury-lightGray uppercase tracking-wider">Reference Code:</span>
                  <span className="text-sm font-semibold text-luxury-gold tracking-widest">{reservationRef}</span>
                </div>
                
                <div className="space-y-2.5 text-xs text-luxury-lightGray font-light">
                  <div className="flex justify-between">
                    <span>Villa:</span>
                    <span className="text-white font-medium">{villa.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="text-white font-medium">{villa.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Booking Type:</span>
                    <span className="text-white font-medium">{getBookingTypeLabel()}</span>
                  </div>

                  {bookingDetails.selectedRoomsDetail && bookingDetails.selectedRoomsDetail.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span>Rooms:</span>
                      <span className="text-white font-medium text-right">
                        {bookingDetails.selectedRoomsDetail.map((r, i) => (
                          <div key={i}>{r.name}</div>
                        ))}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Date / Duration:</span>
                    <span className="text-white font-medium text-right">
                      {bookingDetails.bookingType === "function-space" ? (
                        <>
                          {formatDate(bookingDetails.checkIn)}
                          <div className="text-[10px] text-white/50">
                            {bookingDetails.functionSpace.startTime} – {bookingDetails.functionSpace.endTime} ({bookingDetails.functionSpace.hours} Hours)
                          </div>
                        </>
                      ) : (
                        <>
                          {formatDate(bookingDetails.checkIn)} – {formatDate(bookingDetails.checkOut)} ({bookingDetails.nights} Nights)
                        </>
                      )}
                    </span>
                  </div>

                  {bookingDetails.bookingType === "function-space" ? (
                    <>
                      <div className="flex justify-between">
                        <span>Event Type:</span>
                        <span className="text-white font-medium">{bookingDetails.functionSpace.eventType}</span>
                      </div>
                      {formData.companyName && (
                        <div className="flex justify-between">
                          <span>Company:</span>
                          <span className="text-white font-medium">{formData.companyName}</span>
                        </div>
                      )}
                    </>
                  ) : null}

                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span className="text-white font-medium">{bookingDetails.guests} Guest{bookingDetails.guests > 1 ? "s" : ""}</span>
                  </div>
                  
                  <div className="flex justify-between border-t border-white/5 pt-2.5 text-sm font-serif">
                    <span className="text-luxury-lightGray font-light">Status:</span>
                    <span className="text-luxury-gold font-medium">Registered (Pending Call Confirmation)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4 justify-center max-w-sm mx-auto">
                <button
                  onClick={handleReturnHome}
                  className="flex-1 py-3.5 border border-white/10 hover:border-luxury-gold hover:text-luxury-black text-white font-semibold text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer"
                >
                  Return to Home
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3.5 bg-luxury-gold hover:bg-luxury-gold-accent hover:shadow-gold-glow text-luxury-black font-semibold text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer"
                >
                  Print Summary
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
