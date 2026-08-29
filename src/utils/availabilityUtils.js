import { getBookings } from "./bookingUtils";

/**
 * Normalizes a date value to midnight local time for safe comparisons.
 */
const toMidnightDate = (dateVal) => {
  const d = new Date(dateVal);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Checks if two date ranges overlap.
 * In hospitality bookings, check-out day of one guest can be the check-in day of the next.
 * Therefore, they only overlap if: checkInA < checkOutB AND checkOutA > checkInB.
 */
export const datesOverlap = (checkInA, checkOutA, checkInB, checkOutB) => {
  const startA = toMidnightDate(checkInA);
  const endA = toMidnightDate(checkOutA);
  const startB = toMidnightDate(checkInB);
  const endB = toMidnightDate(checkOutB);

  return startA < endB && endA > startB;
};

/**
 * Checks if two time ranges overlap on the same day.
 * Times are HH:MM string format.
 */
export const timesOverlap = (startA, endA, startB, endB) => {
  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const minStartA = toMinutes(startA);
  const minEndA = toMinutes(endA);
  const minStartB = toMinutes(startB);
  const minEndB = toMinutes(endB);

  return minStartA < minEndB && minEndA > minStartB;
};

/**
 * Determines availability of Full Villa and individual rooms for a specific date range.
 * @param {string} villaId - Id of the villa
 * @param {string} checkIn - Check-in date string (YYYY-MM-DD)
 * @param {string} checkOut - Check-out date string (YYYY-MM-DD)
 * @param {Object} villa - The villa config containing the list of rooms
 * @returns {Object} { isFullVillaAvailable, availableRooms }
 */
export const checkVillaAccommodationAvailability = (villaId, checkIn, checkOut, villa) => {
  if (!checkIn || !checkOut || !villa || !villa.rooms) {
    return {
      isFullVillaAvailable: true,
      availableRooms: villa?.rooms || []
    };
  }

  const bookings = getBookings();
  const overlappingBookings = bookings.filter((booking) => {
    return (
      booking.villaId === villaId &&
      booking.status === "confirmed" &&
      ["full-villa", "single-room", "two-rooms", "three-rooms"].includes(booking.bookingType) &&
      datesOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut)
    );
  });

  // Check if any overlapping booking is a "full-villa" booking
  const hasFullVillaOverlap = overlappingBookings.some(b => b.bookingType === "full-villa");
  if (hasFullVillaOverlap) {
    return {
      isFullVillaAvailable: false,
      availableRooms: [] // All rooms are blocked if the entire villa is booked
    };
  }

  // Find all individual rooms that are already booked during this time
  const bookedRoomIds = new Set();
  overlappingBookings.forEach((b) => {
    if (b.rooms && b.rooms.length > 0) {
      b.rooms.forEach(id => bookedRoomIds.add(id));
    }
  });

  // The remaining rooms are available
  const availableRooms = villa.rooms.filter(room => !bookedRoomIds.has(room.id));

  // Full Villa can only be booked if NO rooms are booked at all
  const isFullVillaAvailable = bookedRoomIds.size === 0;

  return {
    isFullVillaAvailable,
    availableRooms
  };
};

/**
 * Checks if the function space is available at the requested date and time.
 * @param {string} villaId
 * @param {string} date - Event date string (YYYY-MM-DD)
 * @param {string} startTime - HH:MM
 * @param {string} endTime - HH:MM
 * @returns {boolean}
 */
export const isFunctionSpaceAvailable = (villaId, date, startTime, endTime) => {
  if (!date || !startTime || !endTime) return true;
  
  const bookings = getBookings();
  const overlappingEvent = bookings.find((booking) => {
    return (
      booking.villaId === villaId &&
      booking.bookingType === "function-space" &&
      booking.status === "confirmed" &&
      booking.checkIn === date && // checkIn is stored as date for function space
      timesOverlap(startTime, endTime, booking.functionSpace.startTime, booking.functionSpace.endTime)
    );
  });

  return !overlappingEvent;
};
