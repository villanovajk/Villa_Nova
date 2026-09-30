import React, { useState } from "react";
import { Calendar, Users, Search, Layers } from "lucide-react";
import { bookingOptions } from "../config/images";
import { getTodayDateString } from "../utils/dateUtils";

export default function SearchWidget({ onSearch }) {
  const [bookingType, setBookingType] = useState("full-villa");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [error, setError] = useState("");
  const todayStr = getTodayDateString();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!checkIn) {
      setError("Please select a date.");
      return;
    }

    if (bookingType !== "function-space" && !checkOut) {
      setError("Please select a check-out date.");
      return;
    }

    const checkInDate = new Date(checkIn);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      setError("Selectable dates cannot be in the past.");
      return;
    }

    if (bookingType !== "function-space") {
      const checkOutDate = new Date(checkOut);
      if (checkOutDate <= checkInDate) {
        setError("Check-out date must be after check-in date.");
        return;
      }
    }

    // Trigger search callback
    if (onSearch) {
      onSearch({
        bookingType,
        checkIn,
        checkOut: bookingType === "function-space" ? checkIn : checkOut,
        guests: parseInt(guests, 10)
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full glass-card p-6 md:p-8 shadow-glass flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 md:gap-4 relative z-10 text-left"
    >
      {/* Booking Type */}
      <div className="flex-1 flex flex-col space-y-2 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
        <label className="text-xs uppercase tracking-widest text-luxury-gold flex items-center gap-2">
          <Layers size={12} />
          <span>Booking Type</span>
        </label>
        <select
          value={bookingType}
          onChange={(e) => {
            setBookingType(e.target.value);
            setError("");
            // Clear check-out if function space is selected
            if (e.target.value === "function-space") {
              setCheckOut("");
            }
          }}
          className="bg-transparent text-white font-serif font-light text-base md:text-lg focus:outline-none cursor-pointer w-full appearance-none pr-8"
          style={{
            color: "white",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C5A880'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "16px",
          }}
        >
          {Object.entries(bookingOptions || {}).map(([key, value]) => (
            <option key={key} value={key} className="bg-luxury-charcoal text-white" style={{ color: "white", background: "#161616" }}>
              {value?.label || key}
            </option>
          ))}
        </select>
      </div>

      {/* Date Picker (Check-in or Event Date) */}
      <div className="flex-1 flex flex-col space-y-2 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6 md:pl-2">
        <label className="text-xs uppercase tracking-widest text-luxury-gold flex items-center gap-2">
          <Calendar size={12} />
          <span>{bookingType === "function-space" ? "Event Date" : "Check-in"}</span>
        </label>
        <input
          type="date"
          required
          value={checkIn}
          min={todayStr}
          onChange={(e) => {
            setCheckIn(e.target.value);
            setError("");
          }}
          className="bg-transparent text-white font-serif font-light text-base md:text-lg focus:outline-none cursor-pointer w-full"
          style={{ colorScheme: "dark", color: "white" }}
        />
      </div>

      {/* Check-out Date (Hidden for Function Space) */}
      {bookingType !== "function-space" ? (
        <div className="flex-1 flex flex-col space-y-2 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6 md:pl-2">
          <label className="text-xs uppercase tracking-widest text-luxury-gold flex items-center gap-2">
            <Calendar size={12} />
            <span>Check-out</span>
          </label>
          <input
            type="date"
            required
            value={checkOut}
            min={checkIn || todayStr}
            onChange={(e) => {
              setCheckOut(e.target.value);
              setError("");
            }}
            className="bg-transparent text-white font-serif font-light text-base md:text-lg focus:outline-none cursor-pointer w-full"
            style={{ colorScheme: "dark", color: "white" }}
          />
        </div>
      ) : (
        // Dummy placeholder to keep grid layout balanced on desktop
        <div className="hidden md:flex flex-1 flex-col space-y-2 md:pl-2 md:pr-6 border-r border-white/10">
          <span className="text-xs uppercase tracking-widest text-white/20 flex items-center gap-2">
            <Calendar size={12} className="opacity-20" />
            <span>Event Hours</span>
          </span>
          <span className="text-sm font-serif font-light text-white/40 pt-1">
            Times selected on property
          </span>
        </div>
      )}

      {/* Guests Dropdown */}
      <div className="flex-1 flex flex-col space-y-2 pb-4 md:pb-0 md:pr-4 md:pl-2">
        <label className="text-xs uppercase tracking-widest text-luxury-gold flex items-center gap-2">
          <Users size={12} />
          <span>Guests</span>
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="bg-transparent text-white font-serif font-light text-base md:text-lg focus:outline-none cursor-pointer w-full appearance-none pr-8"
          style={{
            color: "white",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C5A880'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "16px",
          }}
        >
          {bookingType === "function-space" ? (
            <>
              <option value="10" className="bg-luxury-charcoal text-white" style={{ color: "white", background: "#161616" }}>Up to 10 Guests</option>
              <option value="25" className="bg-luxury-charcoal text-white" style={{ color: "white", background: "#161616" }}>10 – 25 Guests</option>
              <option value="50" className="bg-luxury-charcoal text-white" style={{ color: "white", background: "#161616" }}>25 – 50 Guests</option>
              <option value="100" className="bg-luxury-charcoal text-white" style={{ color: "white", background: "#161616" }}>50 – 100 Guests</option>
              <option value="300" className="bg-luxury-charcoal text-white" style={{ color: "white", background: "#161616" }}>100 – 300+ Guests</option>
            </>
          ) : (
            <>
              <option value="1" className="bg-luxury-charcoal text-white" style={{ color: "white", background: "#161616" }}>1 Guest</option>
              <option value="2" className="bg-luxury-charcoal text-white" style={{ color: "white", background: "#161616" }}>2 Guests</option>
              <option value="4" className="bg-luxury-charcoal text-white" style={{ color: "white", background: "#161616" }}>4 Guests</option>
              <option value="6" className="bg-luxury-charcoal text-white" style={{ color: "white", background: "#161616" }}>6 Guests</option>
              <option value="10" className="bg-luxury-charcoal text-white" style={{ color: "white", background: "#161616" }}>10+ Guests</option>
              <option value="12" className="bg-luxury-charcoal text-white" style={{ color: "white", background: "#161616" }}>12+ Guests</option>
            </>
          )}
        </select>
      </div>

      {/* Search CTA */}
      <div className="flex flex-col md:flex-row items-stretch justify-center relative md:pl-2">
        <button
          type="submit"
          className="w-full md:w-auto bg-luxury-gold hover:bg-luxury-gold-accent hover:shadow-gold-glow text-luxury-black font-semibold text-xs tracking-widest uppercase px-8 py-4 transition-all duration-300 flex items-center justify-center gap-3 relative group"
        >
          <Search size={14} className="group-hover:scale-110 transition-transform duration-300" />
          <span>Search</span>
        </button>
      </div>

      {/* Error Tooltip */}
      {error && (
        <div className="absolute left-6 bottom-[-28px] text-xs text-red-400 font-light bg-black/95 px-3 py-1 border border-red-500/20 z-30">
          {error}
        </div>
      )}
    </form>
  );
}
