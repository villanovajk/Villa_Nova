import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Star, User, Bed, Bath, Home, Users, Award, ArrowUpRight } from "lucide-react";
import { bookingConfig } from "../config/images";
import { formatCurrency } from "../utils/pricingUtils";

// The property only has one physical villa (NOVA). Guests can reserve it three
// ways: the entire villa, an individual room, or the function space for events.
// Each card below routes into the SAME villa detail page / booking module,
// just pre-selecting the relevant experience type. Booking logic itself lives
// entirely in BookingModule / BookingTypeSelector and is untouched here.
export default function PropertySection({ villa }) {
  const navigate = useNavigate();

  const goToBooking = (bookingType) => {
    // Pre-fill the booking module the same way the Hero search widget does.
    const searchParams = { bookingType, checkIn: "", checkOut: "", guests: bookingType === "function-space" ? 10 : 2 };
    localStorage.setItem("nova_last_search", JSON.stringify(searchParams));
    navigate(`/villa/${villa.id}`);
  };

  if (!villa) return null;

  const sortedRooms = [...(villa.rooms || [])].sort((a, b) => a.pricePerNight - b.pricePerNight);
  const startingRoomPrice = sortedRooms[0]?.pricePerNight;
  const roomImage = "/room-suite.jpg";
  const functionSpaceImage = "/function-space.png";
  const roomCapacityLabel = `${bookingConfig.rooms.baseCapacity} Guests / Room (+${bookingConfig.rooms.extraCapacity} Extra, extra charge applicable)`;

  const cards = [
    {
      key: "full-villa",
      icon: <Home size={16} className="text-luxury-gold" />,
      tag: "Exclusive Use",
      title: "The Main Villa",
      image: villa.featuredImage,
      description: "Reserve the entire residence for full privacy — every room, the pool, gardens, and staff, exclusively yours.",
      priceLabel: `From ${formatCurrency(villa.price)} / night`,
      meta: [
        { icon: <User size={13} className="text-luxury-gold/70" />, label: `${villa.guests} Guests` },
        { icon: <Bed size={13} className="text-luxury-gold/70" />, label: `${villa.beds} Beds` },
        { icon: <Bath size={13} className="text-luxury-gold/70" />, label: `${villa.baths} Baths` },
      ],
      cta: "Reserve Main Villa",
    },
    {
      key: "single-room",
      icon: <Bed size={16} className="text-luxury-gold" />,
      tag: "Villa Included",
      title: "Rooms",
      image: roomImage,
      description: "Book a private room with full access to the shared villa amenities — pool, gardens, and lounge areas.",
      priceLabel: startingRoomPrice ? `${formatCurrency(startingRoomPrice)} / night` : "Contact for pricing",
      meta: [
        { icon: <Bed size={13} className="text-luxury-gold/70" />, label: `${villa.rooms.length} Rooms Available` },
        { icon: <User size={13} className="text-luxury-gold/70" />, label: roomCapacityLabel },
      ],
      cta: "Book a Room",
    },
    {
      key: "function-space",
      icon: <Award size={16} className="text-luxury-gold" />,
      tag: "Events & Celebrations",
      title: "Functional Space",
      image: functionSpaceImage,
      description: "Host weddings, private dinners, and corporate events in our elegant function space, with the villa grounds included.",
      priceLabel: `${formatCurrency(bookingConfig.functionSpace.flatRate)} / event`,
      meta: [
        { icon: <Users size={13} className="text-luxury-gold/70" />, label: `Up to ${bookingConfig.functionSpace.capacity}+ Guests` },
        { icon: <Award size={13} className="text-luxury-gold/70" />, label: `+ Villa: ${formatCurrency(bookingConfig.functionSpaceWithVilla.price)}` },
      ],
      cta: "Book Function Space",
    },
  ];

  return (
    <section id="featured-properties" className="py-24 bg-luxury-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left">
          <div className="space-y-3">
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-luxury-gold font-semibold text-glow">
              The Property
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-white leading-tight">
              Ways to Experience NOVA
            </h2>
          </div>
          <p className="text-sm md:text-base font-light text-luxury-lightGray max-w-md leading-relaxed">
            One villa, reserved your way — take the entire residence, a private room, or our function space for your next event.
          </p>
        </div>

        {/* Villa Location / Rating strip */}
        <div className="flex flex-wrap items-center gap-4 mb-10 text-xs md:text-sm uppercase tracking-widest text-luxury-lightGray">
          <span className="flex items-center gap-1.5 text-luxury-gold">
            <MapPin size={14} />
            <span>{villa.location}</span>
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1.5">
            <Star size={14} className="fill-luxury-gold stroke-luxury-gold" />
            <span>{villa.rating} ({villa.reviewsCount} reviews)</span>
          </span>
        </div>

        {/* 3-Card Property Grid: Main Villa / Rooms / Function Space */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {cards.map((card) => (
            <div key={card.key} className="glass-card glass-card-hover flex flex-col h-full group overflow-hidden animate-fade-in">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-luxury-black/75 backdrop-blur-md px-3 py-1.5 flex items-center gap-1.5 border border-white/5">
                  {card.icon}
                  <span className="text-[10px] uppercase tracking-widest text-white/80">{card.tag}</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-luxury-black/75 backdrop-blur-md px-4 py-2 border border-white/5">
                  <span className="text-sm font-semibold text-luxury-gold font-serif text-glow">{card.priceLabel}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3 text-left">
                  <h3 className="text-2xl font-serif font-light text-white group-hover:text-luxury-gold transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-sm font-light text-luxury-lightGray leading-relaxed line-clamp-3">
                    {card.description}
                  </p>
                </div>

                {/* Meta row */}
                <div className="flex items-center justify-between border-t border-b border-white/5 py-4 text-xs font-light text-luxury-lightGray">
                  {card.meta.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      {m.icon}
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => goToBooking(card.key)}
                  className="w-full py-3 border border-luxury-gold/30 hover:border-luxury-gold text-center text-xs tracking-widest uppercase text-white hover:text-luxury-black font-semibold transition-all duration-500 relative overflow-hidden group/btn flex items-center justify-center gap-2"
                >
                  <span className="absolute inset-0 w-full h-full bg-luxury-gold origin-bottom transform scale-y-0 group-hover/btn:scale-y-100 transition-transform duration-500 ease-out -z-10"></span>
                  <span>{card.cta}</span>
                  <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Villa Details link */}
        <div className="mt-12 text-center">
          <Link
            to={`/villa/${villa.id}`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-luxury-lightGray hover:text-luxury-gold transition-colors duration-300"
          >
            <span>View Full Villa Details, Gallery & Amenities</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
