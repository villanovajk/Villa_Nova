import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Bed, Bath, Users, MapPin, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { siteImages } from "../config/images";
import BookingModule from "../components/BookingModule";
import CheckoutModal from "../components/CheckoutModal";
import ErrorBoundary from "../components/ErrorBoundary";

// Helper to resolve custom Lucide icons dynamically for the luxury amenities
import {
  Droplets, Utensils, Waves, Wind, Heart, GlassWater, Trees, Snowflake, UserCheck, Car, Speaker, Shield, Dumbbell, CalendarRange
} from "lucide-react";

function getAmenityIcon(name) {
  const lowercase = name.toLowerCase();
  if (lowercase.includes("pool") || lowercase.includes("swimming") || lowercase.includes("jacuzzi") || lowercase.includes("tub")) {
    return <Droplets size={16} className="text-luxury-gold" />;
  }
  if (lowercase.includes("chef") || lowercase.includes("kitchen") || lowercase.includes("table")) {
    return <Utensils size={16} className="text-luxury-gold" />;
  }
  if (lowercase.includes("beach") || lowercase.includes("view") || lowercase.includes("overlook") || lowercase.includes("sea")) {
    return <Waves size={16} className="text-luxury-gold" />;
  }
  if (lowercase.includes("helipad") || lowercase.includes("air")) {
    return <Wind size={16} className="text-luxury-gold" />;
  }
  if (lowercase.includes("spa") || lowercase.includes("sauna") || lowercase.includes("massage") || lowercase.includes("steam") || lowercase.includes("wellness")) {
    return <Heart size={16} className="text-luxury-gold" />;
  }
  if (lowercase.includes("wine") || lowercase.includes("bar") || lowercase.includes("room & bar")) {
    return <GlassWater size={16} className="text-luxury-gold" />;
  }
  if (lowercase.includes("cinema") || lowercase.includes("sound") || lowercase.includes("system") || lowercase.includes("automation")) {
    return <Speaker size={16} className="text-luxury-gold" />;
  }
  if (lowercase.includes("garden") || lowercase.includes("putting") || lowercase.includes("green") || lowercase.includes("flora") || lowercase.includes("eco")) {
    return <Trees size={16} className="text-luxury-gold" />;
  }
  if (lowercase.includes("ski") || lowercase.includes("snow")) {
    return <Snowflake size={16} className="text-luxury-gold" />;
  }
  if (lowercase.includes("concierge") || lowercase.includes("staff") || lowercase.includes("maid") || lowercase.includes("service")) {
    return <UserCheck size={16} className="text-luxury-gold" />;
  }
  if (lowercase.includes("valet") || lowercase.includes("shuttle") || lowercase.includes("bicycle") || lowercase.includes("car")) {
    return <Car size={16} className="text-luxury-gold" />;
  }
  if (lowercase.includes("security") || lowercase.includes("gate") || lowercase.includes("certified")) {
    return <Shield size={16} className="text-luxury-gold" />;
  }
  if (lowercase.includes("gym") || lowercase.includes("yoga") || lowercase.includes("pavilion") || lowercase.includes("tennis")) {
    return <Dumbbell size={16} className="text-luxury-gold" />;
  }
  return <Check size={16} className="text-luxury-gold" />;
}

export default function VillaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [villa, setVilla] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [initialSearch, setInitialSearch] = useState(null);

  // Fetch the selected villa based on route parameter
  useEffect(() => {
    const selected = siteImages.villas.find((v) => v.id === id);
    if (selected) {
      setVilla(selected);
      setActiveImageIndex(0);
      window.scrollTo(0, 0);

      // Load search query from home page search widget
      const lastSearch = localStorage.getItem("nova_last_search");
      if (lastSearch) {
        setInitialSearch(JSON.parse(lastSearch));
      }
    } else {
      // Redirect home if villa is not found
      navigate("/");
    }
  }, [id, navigate]);

  if (!villa) {
    return (
      <div className="bg-luxury-black min-h-screen flex items-center justify-center text-white">
        <p className="font-light tracking-widest text-lg">Retracing Villa Credentials...</p>
      </div>
    );
  }

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % villa.gallery.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + villa.gallery.length) % villa.gallery.length);
  };

  const handleReserveInit = (details) => {
    setBookingDetails(details);
    setCheckoutOpen(true);
  };

  return (
    <div className="bg-luxury-black min-h-screen text-white pt-24 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Breadcrumbs / Back button */}
        <div className="mb-8 flex items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-luxury-lightGray hover:text-luxury-gold transition-colors duration-300 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Estates</span>
          </Link>
        </div>

        {/* Villa Header Metadata */}
        <div className="text-left space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm uppercase tracking-widest text-luxury-gold font-light">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{villa.location}</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1">
              <Star size={14} className="fill-luxury-gold stroke-luxury-gold" />
              <span>{villa.rating} ({villa.reviewsCount} reviews)</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-light text-white leading-tight">
            {villa.name}
          </h1>
        </div>

        {/* Image Gallery Showcase */}
        <div className="mb-16">
          {/* Main Active Image (Full Width) */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden border border-white/5 bg-luxury-charcoal mb-4">
            <img
              src={villa.gallery[activeImageIndex]}
              alt={`${villa.name} showcase ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-700"
            />
            {/* Gallery Control Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-luxury-gold/80 hover:text-luxury-black border border-white/10 flex items-center justify-center transition-all duration-300"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-luxury-gold/80 hover:text-luxury-black border border-white/10 flex items-center justify-center transition-all duration-300"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
            {/* Image counter indicator */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3.5 py-1.5 text-xs font-light border border-white/10">
              {activeImageIndex + 1} / {villa.gallery.length}
            </div>
          </div>

          {/* Auto-Scrolling Thumbnail Filmstrip (fills the space with a continuous, pausable scroll) */}
          <div className="relative overflow-hidden group/filmstrip [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div className="flex gap-3 w-max animate-marquee group-hover/filmstrip:[animation-play-state:paused]">
              {[...villa.gallery, ...villa.gallery].map((image, idx) => {
                const realIdx = idx % villa.gallery.length;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(realIdx)}
                    className={`relative flex-none w-32 sm:w-44 aspect-[16/10] overflow-hidden border transition-all duration-300 ${
                      activeImageIndex === realIdx ? "border-luxury-gold" : "border-white/5 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${villa.name} thumbnail ${realIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Two-Column Content Layout (Details vs. Booking) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Description, Specs, Amenities, Rules */}
          <div className="lg:col-span-8 space-y-12 text-left">
            {/* Key Specs */}
            <div className="grid grid-cols-3 gap-6 bg-white/[0.02] border border-white/5 p-6 md:p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-2 border-r border-white/10">
                <Users size={20} className="text-luxury-gold" />
                <span className="text-xs uppercase tracking-widest text-white/50">Accommodates</span>
                <span className="text-lg font-serif text-white">{villa.guests} Guests</span>
                {villa.extraGuestsAllowed > 0 && (
                  <span className="text-[10px] font-light text-luxury-gold">+{villa.extraGuestsAllowed} Extra Allowed (extra charge applicable)</span>
                )}
              </div>
              <div className="flex flex-col items-center justify-center text-center space-y-2 border-r border-white/10">
                <Bed size={20} className="text-luxury-gold" />
                <span className="text-xs uppercase tracking-widest text-white/50">Bedrooms</span>
                <span className="text-lg font-serif text-white">{villa.beds} Rooms</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <Bath size={20} className="text-luxury-gold" />
                <span className="text-xs uppercase tracking-widest text-white/50">Bathrooms</span>
                <span className="text-lg font-serif text-white">{villa.baths} Baths</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl uppercase tracking-widest text-luxury-gold font-medium">The Residence</h3>
              <p className="text-base font-light text-luxury-lightGray leading-relaxed font-sans">
                {villa.description}
              </p>
            </div>

            <div className="w-full h-[1px] bg-white/5"></div>

            {/* Amenities Grid */}
            <div className="space-y-6">
              <h3 className="text-xl uppercase tracking-widest text-luxury-gold font-medium">Bespoke Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {villa.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-3.5 bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full border border-luxury-gold/20 flex items-center justify-center bg-luxury-gold/5">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="text-sm font-light text-white">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full h-[1px] bg-white/5"></div>

            {/* House Rules */}
            <div className="space-y-6">
              <h3 className="text-xl uppercase tracking-widest text-luxury-gold font-medium">House Protocols</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {villa.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-luxury-lightGray font-light">
                    <CalendarRange size={16} className="text-luxury-gold flex-shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Module */}
          <div className="lg:col-span-4 relative w-full">
            <ErrorBoundary>
              <BookingModule 
                villa={villa} 
                onReserve={handleReserveInit} 
                initialSearch={initialSearch} 
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* 2-Step Checkout Wizard Modal Overlay */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        villa={villa}
        bookingDetails={bookingDetails}
      />
    </div>
  );
}
