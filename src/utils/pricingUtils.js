import { bookingConfig } from "../config/images";

/**
 * Calculates a detailed pricing breakdown for any booking type.
 * @param {Object} params
 * @param {string} params.bookingType - 'full-villa', 'single-room', 'two-rooms', 'three-rooms', 'function-space'
 * @param {Object} params.villa - The current villa object
 * @param {Array} params.selectedRooms - List of room objects selected
 * @param {number} params.nights - Number of nights for stay (accommodation only)
 * @param {number} params.hours - Duration in hours (function space only)
 * @param {number} params.guests - Number of guests (used to calculate extra-guest surcharge on accommodation bookings)
 */
export const calculatePricing = ({ bookingType, villa, selectedRooms = [], nights = 0, hours = 0, guests = 0 }) => {
  let baseAmount = 0;
  let includedCapacity = 0;

  if (bookingType === "full-villa") {
    baseAmount = (villa.price || 20000) * nights;
    includedCapacity = villa.guests || 0;
  } else if (["single-room", "two-rooms", "three-rooms"].includes(bookingType)) {
    const roomRatePerNight = selectedRooms.reduce((sum, room) => sum + (room.pricePerNight || 0), 0);
    baseAmount = roomRatePerNight * nights;
    includedCapacity = selectedRooms.reduce((sum, room) => sum + (room.capacity || 0), 0);
  } else if (bookingType === "function-space") {
    baseAmount = bookingConfig.functionSpace.flatRate;
  }

  // Extra-guest surcharge: only applies to accommodation bookings (full villa / rooms)
  let extraGuestFee = 0;
  let extraGuestCount = 0;
  if (["full-villa", "single-room", "two-rooms", "three-rooms"].includes(bookingType) && guests > includedCapacity) {
    extraGuestCount = guests - includedCapacity;
    const perExtraGuestFee = bookingType === "full-villa"
      ? (villa.extraGuestFee || 0)
      : bookingConfig.rooms.extraGuestFee;
    extraGuestFee = extraGuestCount * perExtraGuestFee * nights;
  }

  // Fees and taxes from central config
  const cleaningFee = baseAmount > 0 ? bookingConfig.fees.cleaning : 0;
  const serviceFee = Math.round((baseAmount + extraGuestFee) * bookingConfig.fees.servicePercent);
  const tax = Math.round((baseAmount + extraGuestFee + cleaningFee + serviceFee) * bookingConfig.fees.taxPercent);
  const total = baseAmount + extraGuestFee + cleaningFee + serviceFee + tax;

  return {
    baseAmount,
    extraGuestFee,
    extraGuestCount,
    extraChargeApplicable: extraGuestCount > 0,
    cleaningFee,
    serviceFee,
    tax,
    total
  };
};

export const formatCurrency = (amount) => {
  return `${bookingConfig.currency}${amount.toLocaleString("en-IN")}`;
};
