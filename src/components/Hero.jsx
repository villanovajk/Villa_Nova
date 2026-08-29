import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { siteImages } from "../config/images";
import SearchWidget from "./SearchWidget";

export default function Hero({ onSearch }) {
  const featuredVilla = siteImages.villas[0] || {
    id: "villa-nova",
    name: "NOVA",
    location: "Bali, Indonesia"
  };

  return (
    <div className="relative min-h-[95vh] md:min-h-screen flex flex-col justify-between bg-luxury-black">
      {/* Background Image with Cinematic Ken Burns Motion + Clean Vignette Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={siteImages.hero.background}
          alt="Luxury Villa Background"
          className="w-full h-full object-cover object-center animate-ken-burns"
          style={{ filter: "saturate(1.25) contrast(1.12) brightness(1.08)" }}
        />
        {/* Bottom gradient: keeps text legible without flattening the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/35 to-transparent z-1"></div>
        {/* Left gradient: extra contrast behind the headline only */}
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/75 via-luxury-black/10 to-transparent z-1"></div>
        {/* Soft edge vignette for depth */}
        <div className="absolute inset-0 shadow-[inset_0_0_180px_60px_rgba(5,5,5,0.55)] z-1"></div>
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex items-center relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-32 pb-24 md:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          {/* Main Headline & Subtext */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8 text-left animate-fade-in-up">
            <div className="space-y-3">
              <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-luxury-gold font-semibold text-glow">
                Exquisite Retreats
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-white leading-[1.1] max-w-3xl">
                We create exceptional spaces that inspire lives.
              </h1>
            </div>
            <p className="text-base md:text-xl font-light text-white/70 max-w-2xl leading-relaxed">
              Discover curated private estates, cliffside sanctuaries, and oceanfront villas offering peerless design, absolute privacy, and 24/7 bespoke concierge service.
            </p>
            <div className="pt-2">
              <a
                href="#featured-properties"
                className="inline-flex items-center gap-3 text-xs uppercase tracking-widest bg-luxury-gold hover:bg-luxury-gold-accent text-luxury-black font-semibold px-8 py-4 transition-all duration-300 shadow-gold-glow group"
              >
                <span>Explore the Collection</span>
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
            </div>
          </div>

          {/* Floating Featured Overlay Property Card */}
          <div className="lg:col-span-4 flex justify-start lg:justify-end animate-fade-in md:delay-300">
            <Link
              to={`/villa/${featuredVilla.id}`}
              className="glass-card p-4 rounded-none shadow-glass max-w-sm w-full group hover:border-luxury-gold/30 transition-all duration-500 hover:scale-[1.02] flex items-center gap-4 text-left"
            >
              <div className="w-20 h-20 overflow-hidden flex-shrink-0 relative">
                <img
                  src={siteImages.hero.featuredOverlay}
                  alt={`${featuredVilla.name} featured thumbnail`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">Featured Collection</span>
                <h4 className="text-base font-serif font-light text-white leading-tight">{featuredVilla.name}</h4>
                <div className="flex items-center gap-1 text-white/50 text-xs">
                  <MapPin size={10} className="text-luxury-gold" />
                  <span>{featuredVilla.location}</span>
                </div>
                <div className="text-xs text-luxury-gold font-light mt-1 flex items-center gap-1 group-hover:underline">
                  <span>View Property</span>
                  <ArrowRight size={10} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Overlapping Search Widget container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full translate-y-1/2 mt-auto">
        <SearchWidget onSearch={onSearch} />
      </div>
    </div>
  );
}
