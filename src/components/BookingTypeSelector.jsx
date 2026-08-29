import React from "react";
import { Home, Bed, Users, Sparkles, Award } from "lucide-react";
import { bookingConfig, bookingOptions } from "../config/images";
import { formatCurrency } from "../utils/pricingUtils";

export default function BookingTypeSelector({ selectedType, onSelectType, villa, availabilityStatus }) {
  // Helper to calculate starting prices dynamically per villa
  const getStartingPriceText = (typeId) => {
    if (!villa) return "";

    const sortedRooms = [...(villa.rooms || [])].sort((a, b) => a.pricePerNight - b.pricePerNight);
    
    switch (typeId) {
      case "full-villa":
        return `From ${formatCurrency(villa.price)} / night`;
      case "single-room":
        if (sortedRooms[0]) {
          return `From ${formatCurrency(sortedRooms[0].pricePerNight)} / night`;
        }
        return "N/A";
      case "two-rooms":
        if (sortedRooms.length >= 2) {
          const rate = sortedRooms[0].pricePerNight + sortedRooms[1].pricePerNight;
          return `From ${formatCurrency(rate)} / night`;
        }
        return "N/A";
      case "three-rooms":
        if (sortedRooms.length >= 3) {
          const rate = sortedRooms.reduce((sum, r) => sum + r.pricePerNight, 0);
          return `From ${formatCurrency(rate)} / night`;
        }
        return "N/A";
      case "function-space":
        return `${formatCurrency(bookingConfig.functionSpace.flatRate)} / event`;
      default:
        return "";
    }
  };

  const getIcon = (typeId) => {
    const size = 18;
    const className = "text-luxury-gold";
    switch (typeId) {
      case "full-villa":
        return <Home size={size} className={className} />;
      case "single-room":
        return <Bed size={size} className={className} />;
      case "two-rooms":
        return <Users size={size} className={className} />;
      case "three-rooms":
        return <Sparkles size={size} className={className} />;
      case "function-space":
        return <Award size={size} className={className} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-semibold block">
        1. Select Experience Type
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(bookingOptions).map(([key, option]) => {
          const isSelected = selectedType === key;
          const priceText = getStartingPriceText(key);

          // Skip Two Rooms / Three Rooms if the villa doesn't have enough rooms configured
          if (key === "two-rooms" && (!villa.rooms || villa.rooms.length < 2)) return null;
          if (key === "three-rooms" && (!villa.rooms || villa.rooms.length < 3)) return null;

          // Check availability for this option if dates are chosen
          const isAvailable = availabilityStatus ? availabilityStatus[key] !== false : true;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectType(key)}
              disabled={!isAvailable}
              className={`text-left p-4 border transition-all duration-300 flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                !isAvailable 
                  ? "opacity-40 border-white/5 bg-white/[0.01] cursor-not-allowed" 
                  : isSelected
                    ? "bg-luxury-gold/5 border-luxury-gold shadow-gold-glow cursor-pointer"
                    : "bg-white/[0.02] border-white/10 hover:border-luxury-gold/50 cursor-pointer"
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <div className="p-2 border border-luxury-gold/20 bg-luxury-gold/5">
                  {getIcon(key)}
                </div>
                {isAvailable ? (
                  <span className="text-[9px] uppercase tracking-widest text-luxury-gold/70 bg-luxury-gold/5 px-2 py-0.5 border border-luxury-gold/10">
                    Available
                  </span>
                ) : (
                  <span className="text-[9px] uppercase tracking-widest text-red-400 bg-red-950/20 px-2 py-0.5 border border-red-500/20">
                    Sold Out
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-serif text-sm font-medium text-white group-hover:text-luxury-gold transition-colors duration-300">
                  {option.label}
                </h4>
                <p className="text-[11px] font-light text-luxury-lightGray mt-0.5 leading-snug line-clamp-1">
                  {option.description}
                </p>
                <p className="text-xs text-luxury-gold font-light mt-2 tracking-wide font-serif">
                  {priceText}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
