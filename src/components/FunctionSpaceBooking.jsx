import React from "react";
import { Calendar, Clock, Users, Award, Info } from "lucide-react";
import { bookingConfig } from "../config/images";
import { formatCurrency } from "../utils/pricingUtils";
import { getTodayDateString } from "../utils/dateUtils";

export default function FunctionSpaceBooking({
  date,
  setDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  guests,
  setGuests,
  eventType,
  setEventType,
  setError
}) {
  const todayStr = getTodayDateString();

  const eventTypes = [
    "Wedding",
    "Birthday",
    "Corporate Event",
    "Private Dinner",
    "Celebration",
    "Meeting",
    "Other"
  ];

  const handleGuestsChange = (e) => {
    const val = parseInt(e.target.value, 10) || 0;
    const maxCapacity = bookingConfig.functionSpace.capacity;
    if (val > maxCapacity) {
      setGuests(maxCapacity.toString());
      setError(`Function Space maximum capacity is ${maxCapacity} guests.`);
    } else {
      setGuests(e.target.value);
      setError("");
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-semibold block">
        3. Event Details
      </label>

      <div className="flex items-start gap-2 bg-luxury-gold/5 p-3 text-[11.5px] font-light text-luxury-gold border border-luxury-gold/10">
        <Info size={14} className="flex-shrink-0 mt-0.5" />
        <div>
          Flat rate: {formatCurrency(bookingConfig.functionSpace.flatRate)} per event (up to {bookingConfig.functionSpace.capacity}+ guests).
          {" "}Want the villa too? {bookingConfig.functionSpaceWithVilla.label} is available for {formatCurrency(bookingConfig.functionSpaceWithVilla.price)} — contact us to arrange.
        </div>
      </div>

      <div className="space-y-3">
        {/* Event Date Input */}
        <div className="flex flex-col space-y-1.5 p-3 border border-white/15 bg-white/[0.02]">
          <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold flex items-center gap-1.5">
            <Calendar size={10} />
            <span>Event Date</span>
          </label>
          <input
            type="date"
            required
            min={todayStr}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-white font-serif font-light text-sm focus:outline-none cursor-pointer [color-scheme:dark] w-full"
          />
        </div>

        {/* Start & End Time Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col space-y-1.5 p-3 border border-white/15 bg-white/[0.02]">
            <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold flex items-center gap-1.5">
              <Clock size={10} />
              <span>Start Time</span>
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-transparent text-white font-serif font-light text-sm focus:outline-none cursor-pointer [color-scheme:dark] w-full"
            />
          </div>
          <div className="flex flex-col space-y-1.5 p-3 border border-white/15 bg-white/[0.02]">
            <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold flex items-center gap-1.5">
              <Clock size={10} />
              <span>End Time</span>
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-transparent text-white font-serif font-light text-sm focus:outline-none cursor-pointer [color-scheme:dark] w-full"
            />
          </div>
        </div>

        {/* Event Type Dropdown */}
        <div className="flex flex-col space-y-1.5 p-3 border border-white/15 bg-white/[0.02]">
          <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold flex items-center gap-1.5">
            <Award size={10} />
            <span>Event Type</span>
          </label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="bg-transparent text-white font-serif font-light text-sm focus:outline-none cursor-pointer w-full appearance-none pr-8"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C5A880'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundPosition: "right center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "14px",
            }}
          >
            {eventTypes.map((type, i) => (
              <option key={i} value={type} className="bg-luxury-charcoal text-white">
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Event Guests Input */}
        <div className="flex flex-col space-y-1.5 p-3 border border-white/15 bg-white/[0.02]">
          <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold flex items-center gap-1.5">
            <Users size={10} />
            <span>Event Guests</span>
          </label>
          <input
            type="number"
            required
            min="1"
            max={bookingConfig.functionSpace.capacity}
            value={guests}
            onChange={handleGuestsChange}
            placeholder="e.g. 50"
            className="bg-transparent text-white font-serif font-light text-sm focus:outline-none w-full"
          />
        </div>
      </div>
    </div>
  );
}
