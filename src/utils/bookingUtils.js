// Booking utilities to manage local storage data persistence and seeding mock bookings

const STORAGE_KEY = "nova_villa_bookings";

const initialMockBookings = [
  {
    id: "NOV-582941",
    bookingType: "full-villa",
    villaId: "villa-nova",
    checkIn: "2026-09-02",
    checkOut: "2026-09-08",
    guests: 8,
    rooms: [], // Empty means entire villa is reserved under full-villa
    functionSpace: null,
    guest: {
      fullName: "Alexander Mercer",
      email: "alexander.mercer@luxury.com",
      phone: "+1 (555) 019-2834",
      specialRequests: "Pre-stocked champagne and fresh local orchids."
    },
    pricing: {
      baseAmount: 480000, // 80000 * 6 nights
      cleaningFee: 5000,
      serviceFee: 48000,
      tax: 95940,
      total: 628940
    },
    status: "confirmed",
    createdAt: new Date("2026-08-10").toISOString()
  },
  {
    id: "NOV-104928",
    bookingType: "single-room",
    villaId: "villa-nova",
    checkIn: "2026-09-10",
    checkOut: "2026-09-15",
    guests: 2,
    rooms: ["nova-room-01"], // Room 1 is booked
    functionSpace: null,
    guest: {
      fullName: "Siddharth Malhotra",
      email: "siddharth.m@gmail.com",
      phone: "+91 98765 43210",
      specialRequests: "Late check-in at 8:00 PM."
    },
    pricing: {
      baseAmount: 125000, // 25000 * 5 nights
      cleaningFee: 5000,
      serviceFee: 12500,
      tax: 25650,
      total: 168150
    },
    status: "confirmed",
    createdAt: new Date("2026-08-15").toISOString()
  },
  {
    id: "NOV-205938",
    bookingType: "function-space",
    villaId: "villa-nova",
    checkIn: "2026-09-15", // Used for the event date
    checkOut: "2026-09-15",
    guests: 45,
    rooms: [],
    functionSpace: {
      eventType: "Corporate Event",
      startTime: "18:00",
      endTime: "22:00",
      companyName: "Zenith Global Corp"
    },
    guest: {
      fullName: "Victoria Sterling",
      email: "sterling@zenith.com",
      phone: "+44 20 7946 0958",
      specialRequests: "Projector setup, catering for 45, cocktail seating arrangement."
    },
    pricing: {
      baseAmount: 20000, // 5000 * 4 hours
      cleaningFee: 5000,
      serviceFee: 2000,
      tax: 4860,
      total: 31860
    },
    status: "confirmed",
    createdAt: new Date("2026-08-12").toISOString()
  }
];

let inMemoryBookings = [...initialMockBookings];

export const getBookings = () => {
  return inMemoryBookings;
};

export const saveBooking = (booking) => {
  inMemoryBookings = [booking, ...inMemoryBookings];
  return true;
};


export const generateBookingRef = () => {
  return `NOV-${Math.floor(100000 + Math.random() * 900000)}`;
};
