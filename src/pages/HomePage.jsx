import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import PropertySection from "../components/PropertySection";
import TrustSection from "../components/TrustSection";
import { siteImages } from "../config/images";

export default function HomePage() {
  const navigate = useNavigate();

  // NOVA is the only property, so there is always exactly one villa record.
  const villa = siteImages.villas[0];

  // Clear any partial detail states from past flows on home mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = ({ bookingType, checkIn, checkOut, guests }) => {
    // Save search parameters so the booking module can pre-fill itself
    // (dates, guest count, and experience type) as soon as the villa page loads.
    const searchParams = { bookingType, checkIn, checkOut, guests };
    localStorage.setItem("nova_last_search", JSON.stringify(searchParams));

    // Take the guest straight to the villa page, where live availability,
    // room selection, and pricing are calculated by the booking module.
    navigate(`/villa/${villa.id}`);
  };

  return (
    <div className="bg-luxury-black min-h-screen text-white">
      {/* Hero + Search Widget */}
      <Hero onSearch={handleSearch} />

      {/* Property Section: Main Villa / Rooms / Function Space */}
      <PropertySection villa={villa} />

      {/* Why Book With Us */}
      <TrustSection />

      {/* Narrative Section (Bonus luxury aesthetic layout) */}
      <section id="about" className="py-24 bg-luxury-charcoal border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6 text-left">
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-luxury-gold font-semibold text-glow">
              Curated Masterpiece
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-white leading-tight">
              Turning a Single Residence Into an Unforgettable Stay
            </h2>
            <p className="text-sm md:text-base font-light text-luxury-lightGray leading-relaxed">
              We believe that luxury travel is not just about the destination, but the atmosphere of the residence. NOVA represents the highest pinnacle of architectural brilliance, modern tech integration, and natural harmony.
            </p>
            <p className="text-sm md:text-base font-light text-luxury-lightGray leading-relaxed">
              Whether you reserve the entire villa, a private room, or our function space for an event, every stay is designed for absolute wellness, deep connections, and memories that last a lifetime.
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/5">
            <img
              src="/villa-garden.png"
              alt="NOVA Villa exterior and landscaped garden"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
