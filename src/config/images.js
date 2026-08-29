// Centralized Luxury Villa Image Configuration
// Replace these Unsplash URLs with your own high-resolution villa photos when ready.

export const siteImages = {
  // Hero section backgrounds
  hero: {
    background: "/hero-bg.jpg", // Modern brick villa image
    featuredOverlay: "/hero-bg.jpg" // Featured listing thumbnail (NOVA)
  },
  
  // Luxury Villa listings
  villas: [
    {
      id: "villa-nova",
      name: "NOVA",
      location: "Madalpattu, Tamil Nadu",
      price: 20000,
      rating: 4.95,
      reviewsCount: 148,
      beds: 4,
      baths: 5,
      guests: 12,
      extraGuestsAllowed: 4,
      extraGuestFee: 1000,
      featuredImage: "/hero-bg.jpg",
      description: "An architectural masterpiece of red clay brickwork and exposed concrete, NOVA blends traditional craftsmanship with raw tropical luxury. Featuring high pitched wooden roofs, private balconies with panoramic forest vistas, and a beautiful open courtyard. The interior boasts premium teakwood furniture, modern smart home controls, and custom ambient lighting.",
      amenities: ["Private Pool", "Private Chef", "Tropical Courtyard", "Valet Parking", "Spa & Wellness Wing", "Wine Cellar", "Home Cinema", "Outdoor Kitchen", "Swimming Pool", "Car Parking", "Room Heaters (All Rooms)"],
      rules: [
        "Check-in: 2:00 PM",
        "Check-out: 11:00 AM",
        "Max occupancy: 12 guests (up to 4 extra guests allowed at ₹1,000/person per night)",
        "No smoking inside the villa",
        "No loud parties after 11:00 PM"
      ],
      gallery: [
        "/hero-bg.jpg", // Exterior view
        "/room-suite.jpg", // Bedroom
        "/swimming-pool.jpg", // Swimming pool
        "/garden-pond.jpg", // Garden with duck pond
        "/swing.jpg", // Garden swing
        "/play-area.jpg" // Lawn / play area
      ],
      // All rooms in this villa are identical (same layout, bed, and price).
      // TODO: pricePerNight below is a PLACEHOLDER — confirm the real per-room
      // rate with the owner and update it here before going live.
      rooms: [
        {
          id: "nova-room-01",
          name: "Room 1",
          type: "Standard",
          bedType: "King Bed",
          capacity: 3,
          pricePerNight: 5000,
          image: "/room-suite.jpg"
        },
        {
          id: "nova-room-02",
          name: "Room 2",
          type: "Standard",
          bedType: "King Bed",
          capacity: 3,
          pricePerNight: 5000,
          image: "/room-suite.jpg"
        },
        {
          id: "nova-room-03",
          name: "Room 3",
          type: "Standard",
          bedType: "King Bed",
          capacity: 3,
          pricePerNight: 5000,
          image: "/room-suite.jpg"
        }
      ]
    },
  ]
};

// Global pricing configurations
export const bookingConfig = {
  currency: "₹",
  fees: {
    cleaning: 0,
    servicePercent: 0, // Removed Bespoke Concierge Fee
    taxPercent: 0 // No tax charged
  },
  rooms: {
    baseCapacity: 3, // Guests included per room
    extraCapacity: 1, // Extra guests allowed per room, beyond baseCapacity
    extraGuestFee: 1000 // ₹ per extra guest, per night
  },
  functionSpace: {
    flatRate: 40000, // Flat price per event, regardless of duration
    minimumHours: 3,
    capacity: 100
  },
  functionSpaceWithVilla: {
    price: 60000, // Flat combo price: Function Space + Full Villa access
    label: "Function Space with Villa"
  }
};

export const bookingOptions = {
  "full-villa": {
    id: "full-villa",
    label: "Full Villa",
    description: "Exclusive access to the entire residence"
  },
  "single-room": {
    id: "single-room",
    label: "Single Room",
    description: "Private room with access to shared villa amenities"
  },
  "two-rooms": {
    id: "two-rooms",
    label: "Two Rooms",
    description: "Perfect for couples or small groups"
  },
  "three-rooms": {
    id: "three-rooms",
    label: "Three Rooms",
    description: "Ideal for families and larger groups"
  },
  "function-space": {
    id: "function-space",
    label: "Function Space",
    description: "Host private events and celebrations"
  }
};
