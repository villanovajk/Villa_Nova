import React, { useState, useEffect } from "react";
import { Info, AlertCircle } from "lucide-react";
import BookingTypeSelector from "./BookingTypeSelector";
import RoomSelector from "./RoomSelector";
import FunctionSpaceBooking from "./FunctionSpaceBooking";
import BookingSummary from "./BookingSummary";
import { checkVillaAccommodationAvailability, isFunctionSpaceAvailable } from "../utils/availabilityUtils";
import { calculatePricing } from "../utils/pricingUtils";
import { bookingConfig } from "../config/images";
import { getTodayDateString } from "../utils/dateUtils";

export default function BookingModule({ villa, onReserve, initialSearch }) {
  // Booking flow states
  const [bookingType, setBookingType] = useState("full-villa");
  
  // Accommodation states
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [nights, setNights] = useState(0);

  // Event states
  const [eventDate, setEventDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("18:00");
  const [eventEndTime, setEventEndTime] = useState("21:00");
  const [eventType, setEventType] = useState("Wedding");
  const [eventGuests, setEventGuests] = useState("30");
  const [eventHours, setEventHours] = useState(0);

  // Status states
  const [error, setError] = useState("");
  const [pricing, setPricing] = useState(null);

  // Real-time availability info for dates
  const [availableRooms, setAvailableRooms] = useState([]);

  // Standard baseline check
  const todayStr = getTodayDateString();

  // Pre-fill fields if search details were passed from search widget
  useEffect(() => {
    if (initialSearch) {
      if (initialSearch.bookingType) setBookingType(initialSearch.bookingType);
      if (initialSearch.checkIn) {
        if (initialSearch.bookingType === "function-space") {
          setEventDate(initialSearch.checkIn);
        } else {
          setCheckIn(initialSearch.checkIn);
        }
      }
      if (initialSearch.checkOut && initialSearch.bookingType !== "function-space") {
        setCheckOut(initialSearch.checkOut);
      }
      if (initialSearch.guests) {
        if (initialSearch.bookingType === "function-space") {
          setEventGuests(initialSearch.guests.toString());
        } else {
          setGuests(initialSearch.guests.toString());
        }
      }
    }
  }, [initialSearch]);

  // Handle availability logic and pricing calculations in real-time
  useEffect(() => {
    setError("");
    setPricing(null);

    // 1. ACCOMMODATION WORKFLOW
    if (["full-villa", "single-room", "two-rooms", "three-rooms"].includes(bookingType)) {
      // Clear event details
      setEventHours(0);

      if (checkIn && checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);

        if (end <= start) {
          setNights(0);
          setError("Check-out date must be after check-in date.");
          return;
        }

        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNights(diffDays);

        // Fetch live accommodation availability from local storage state
        const { isFullVillaAvailable, availableRooms: roomsAvail } = checkVillaAccommodationAvailability(
          villa.id,
          checkIn,
          checkOut,
          villa
        );

        setAvailableRooms(roomsAvail);

        // Validate selected booking option availability
        if (bookingType === "full-villa" && !isFullVillaAvailable) {
          setError("The Full Villa is unavailable on these dates.");
          return;
        }

        const roomCountNeeded = bookingType === "single-room" ? 1 : bookingType === "two-rooms" ? 2 : bookingType === "three-rooms" ? 3 : 0;
        if (bookingType !== "full-villa" && roomsAvail.length < roomCountNeeded) {
          setError(`Not enough rooms available (${roomsAvail.length} remaining, ${roomCountNeeded} needed).`);
          return;
        }

        // Keep selectedRooms updated inside available boundaries
        const validSelected = selectedRooms.filter(room => roomsAvail.some(avail => avail.id === room.id));
        if (validSelected.length !== selectedRooms.length) {
          setSelectedRooms(validSelected);
        }

        // Capacity bounds check (includes allowed extra guests, charged as a surcharge)
        const maxCapacity = getCapacityLimit();
        if (parseInt(guests, 10) > maxCapacity) {
          setError(`Maximum capacity is ${maxCapacity} guests.`);
          return;
        }

        // Run pricing calculation if all required rooms are checked
        if (bookingType === "full-villa" || validSelected.length === roomCountNeeded) {
          const priceResults = calculatePricing({
            bookingType,
            villa,
            selectedRooms: bookingType === "full-villa" ? [] : validSelected,
            nights: diffDays,
            guests: parseInt(guests, 10) || 0
          });
          setPricing(priceResults);
        }
      } else {
        setNights(0);
      }
    }

    // 2. EVENTS / FUNCTION SPACE WORKFLOW
    if (bookingType === "function-space") {
      // Clear accommodation states
      setNights(0);
      setSelectedRooms([]);

      if (eventDate && eventStartTime && eventEndTime) {
        const [hS, mS] = eventStartTime.split(":").map(Number);
        const [hE, mE] = eventEndTime.split(":").map(Number);

        const startMinutes = hS * 60 + mS;
        const endMinutes = hE * 60 + mE;
        const diffM = endMinutes - startMinutes;

        if (diffM <= 0) {
          setEventHours(0);
          setError("End time must be after start time.");
          return;
        }

        const hours = diffM / 60;
        setEventHours(hours);

        const minHrs = bookingConfig.functionSpace.minimumHours;
        if (hours < minHrs) {
          setError(`Minimum duration for Function Space booking is ${minHrs} hours.`);
          return;
        }

        // Check availability overlap
        const isSpaceAvailable = isFunctionSpaceAvailable(villa.id, eventDate, eventStartTime, eventEndTime);
        if (!isSpaceAvailable) {
          setError("The Function Space is already reserved during these hours.");
          return;
        }

        // Check guests count
        if (parseInt(eventGuests, 10) > bookingConfig.functionSpace.capacity) {
          setError(`Function space maximum capacity is ${bookingConfig.functionSpace.capacity} guests.`);
          return;
        }

        // Calculate pricing
        const priceResults = calculatePricing({
          bookingType,
          villa,
          hours,
          guests: parseInt(eventGuests, 10) || 0
        });
        setPricing(priceResults);
      } else {
        setEventHours(0);
      }
    }
  }, [
    bookingType,
    checkIn,
    checkOut,
    guests,
    selectedRooms,
    eventDate,
    eventStartTime,
    eventEndTime,
    eventGuests,
    villa
  ]);

  // Adjust selections when booking type changes
  const handleTypeChange = (type) => {
    setBookingType(type);
    setSelectedRooms([]);
    setError("");
    setPricing(null);

    // Adjust guest counts based on capacity (base + allowed extra guests per room)
    const roomCapacity = bookingConfig.rooms.baseCapacity + bookingConfig.rooms.extraCapacity;
    if (type === "single-room" && parseInt(guests, 10) > roomCapacity * 1) {
      setGuests((roomCapacity * 1).toString());
    } else if (type === "two-rooms" && parseInt(guests, 10) > roomCapacity * 2) {
      setGuests((roomCapacity * 2).toString());
    } else if (type === "three-rooms" && parseInt(guests, 10) > roomCapacity * 3) {
      setGuests((roomCapacity * 3).toString());
    }
  };

  const getRoomCountLimit = () => {
    if (bookingType === "single-room") return 1;
    if (bookingType === "two-rooms") return 2;
    if (bookingType === "three-rooms") return 3;
    return 0;
  };

  const getCapacityLimit = () => {
    const roomCapacity = bookingConfig.rooms.baseCapacity + bookingConfig.rooms.extraCapacity;
    if (bookingType === "full-villa") return villa.guests + (villa.extraGuestsAllowed || 0);
    if (bookingType === "single-room") return roomCapacity * 1;
    if (bookingType === "two-rooms") return roomCapacity * 2;
    if (bookingType === "three-rooms") return roomCapacity * 3;
    return 0;
  };

  const getBookingOptionsAvailability = () => {
    if (!checkIn || !checkOut) return null;
    
    const { isFullVillaAvailable, availableRooms: roomsAvail } = checkVillaAccommodationAvailability(
      villa.id,
      checkIn,
      checkOut,
      villa
    );

    return {
      "full-villa": isFullVillaAvailable,
      "single-room": roomsAvail.length >= 1,
      "two-rooms": roomsAvail.length >= 2,
      "three-rooms": roomsAvail.length >= 3,
      "function-space": true // verified on property by time
    };
  };

  const bookingOptionsAvailability = getBookingOptionsAvailability();

  const handleReserve = (e) => {
    e.preventDefault();
    if (error) return;

    if (bookingType !== "function-space" && (!checkIn || !checkOut)) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    if (bookingType === "function-space" && (!eventDate || !eventStartTime || !eventEndTime)) {
      setError("Please fill in event date and time slots.");
      return;
    }

    const roomCountNeeded = getRoomCountLimit();
    if (bookingType !== "full-villa" && bookingType !== "function-space" && selectedRooms.length !== roomCountNeeded) {
      setError(`Please select exactly ${roomCountNeeded} room${roomCountNeeded > 1 ? "s" : ""}.`);
      return;
    }

    // Trigger details payload to callback
    onReserve({
      bookingType,
      villaId: villa.id,
      checkIn: bookingType === "function-space" ? eventDate : checkIn,
      checkOut: bookingType === "function-space" ? eventDate : checkOut,
      guests: bookingType === "function-space" ? parseInt(eventGuests, 10) : parseInt(guests, 10),
      nights,
      rooms: selectedRooms.map(r => r.id),
      selectedRoomsDetail: selectedRooms, // for checkout UI
      functionSpace: bookingType === "function-space" ? {
        eventType,
        startTime: eventStartTime,
        endTime: eventEndTime,
        eventGuests: parseInt(eventGuests, 10),
        hours: eventHours
      } : null,
      pricing
    });
  };

  return (
    <div className="glass-card p-6 md:p-8 sticky top-28 shadow-glass border border-white/5 space-y-6 text-left w-full max-w-md mx-auto">
      {/* Title */}
      <div>
        <h3 className="text-xl md:text-2xl font-serif font-light text-white leading-tight">
          Reserve Your Experience
        </h3>
        <p className="text-[11px] uppercase tracking-widest text-luxury-gold font-light mt-1">
          Tailored to your preferences
        </p>
      </div>

      <div className="w-full h-[1px] bg-white/5"></div>

      {/* Main Reservation Flow */}
      <form onSubmit={handleReserve} className="space-y-5">
        
        {/* Step 1: Select Booking Type */}
        <BookingTypeSelector
          selectedType={bookingType}
          onSelectType={handleTypeChange}
          villa={villa}
          availabilityStatus={bookingOptionsAvailability}
        />

        {/* Step 2: Date Selector Details */}
        {bookingType !== "function-space" ? (
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-semibold block">
              2. Select Dates
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1.5 p-3 border border-white/15 bg-white/[0.02]">
                <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                  Check-In
                </label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent text-white font-serif font-light text-sm focus:outline-none cursor-pointer [color-scheme:dark] w-full"
                />
              </div>
              <div className="flex flex-col space-y-1.5 p-3 border border-white/15 bg-white/[0.02]">
                <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                  Check-Out
                </label>
                <input
                  type="date"
                  required
                  min={checkIn || todayStr}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-white font-serif font-light text-sm focus:outline-none cursor-pointer [color-scheme:dark] w-full"
                />
              </div>
            </div>

            {/* Guests Count Dropdown */}
            <div className="flex flex-col space-y-1.5 p-3 border border-white/15 bg-white/[0.02]">
              <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="bg-transparent text-white font-serif font-light text-sm focus:outline-none cursor-pointer w-full appearance-none pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C5A880'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundPosition: "right center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "14px",
                }}
              >
                {[...Array(getCapacityLimit())].map((_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-luxury-charcoal text-white">
                    {i + 1} Guest{i > 0 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          // Event Flow Inputs
          <FunctionSpaceBooking
            date={eventDate}
            setDate={setEventDate}
            startTime={eventStartTime}
            setStartTime={setEventStartTime}
            endTime={eventEndTime}
            setEndTime={setEventEndTime}
            guests={eventGuests}
            setGuests={setEventGuests}
            eventType={eventType}
            setEventType={setEventType}
            error={error}
            setError={setError}
          />
        )}

        {/* Step 3: Room Selection (Only for individual room reservations when dates are filled) */}
        {["single-room", "two-rooms", "three-rooms"].includes(bookingType) && checkIn && checkOut && !error && (
          <RoomSelector
            rooms={villa.rooms}
            availableRooms={availableRooms}
            selectedRooms={selectedRooms}
            onRoomSelect={setSelectedRooms}
            limit={getRoomCountLimit()}
          />
        )}

        {/* Info banner about Full Villa inclusion */}
        {bookingType === "full-villa" && checkIn && checkOut && !error && (
          <div className="flex items-start gap-2 bg-luxury-gold/5 p-3 text-[11.5px] font-light text-luxury-gold border border-luxury-gold/10">
            <Info size={14} className="flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Full Villa Booking:</span> Includes exclusive occupancy of all {villa.rooms?.length || 3} rooms, courtyard, infinity pool, and wellness wings.
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/20 border border-red-500/20 p-3">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 4: Summary Breakdown */}
        {pricing && !error && (
          <BookingSummary
            bookingType={bookingType}
            checkIn={bookingType === "function-space" ? eventDate : checkIn}
            checkOut={bookingType === "function-space" ? eventDate : checkOut}
            nights={nights}
            hours={eventHours}
            guests={bookingType === "function-space" ? eventGuests : guests}
            selectedRooms={selectedRooms}
            pricing={pricing}
            villaName={villa.name}
          />
        )}

        {/* Reserve Button CTA */}
        <button
          type="submit"
          disabled={!!error || !pricing}
          className={`w-full py-4 text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
            pricing && !error
              ? "bg-luxury-gold hover:bg-luxury-gold-accent hover:shadow-gold-glow text-luxury-black cursor-pointer animate-pulse-slow"
              : "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
          }`}
        >
          {pricing ? "Reserve Luxury Stay" : "Specify Stay Parameters"}
        </button>
      </form>

      <div className="text-center pt-2">
        <span className="text-[10px] uppercase tracking-widest text-white/30 font-light block">
          No credit card required to register
        </span>
      </div>
    </div>
  );
}
