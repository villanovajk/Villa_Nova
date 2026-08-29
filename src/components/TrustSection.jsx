import React from "react";
import { ShieldCheck, Award, Zap, Clock } from "lucide-react";

export default function TrustSection() {
  const points = [
    {
      icon: <ShieldCheck size={28} className="text-luxury-gold stroke-[1.25]" />,
      title: "Verified Properties",
      description: "Every listing is personally inspected and certified to exceed our rigorous high-end hospitality standards.",
    },
    {
      icon: <Award size={28} className="text-luxury-gold stroke-[1.25]" />,
      title: "Best Price Guarantee",
      description: "Direct relationship with owners ensures you receive the lowest luxury rate for your booking.",
    },
    {
      icon: <Zap size={28} className="text-luxury-gold stroke-[1.25]" />,
      title: "Instant Confirmation",
      description: "Real-time reservation updates. Book and lock down your high-end retreat dates securely in seconds.",
    },
    {
      icon: <Clock size={28} className="text-luxury-gold stroke-[1.25]" />,
      title: "24/7 Concierge Support",
      description: "A professional travel butler handles transfers, yacht charters, spa services, and bookings.",
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-luxury-black border-t border-b border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-luxury-gold font-semibold text-glow">
            Why NOVA
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-white leading-tight">
            An Uncompromising Booking Experience
          </h2>
          <div className="w-12 h-[1px] bg-luxury-gold/50 mx-auto mt-4"></div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {points.map((point, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4 p-4 border border-transparent hover:border-white/5 hover:bg-white/[0.01] transition-all duration-500 ease-out"
            >
              <div className="w-16 h-16 rounded-full border border-luxury-gold/25 flex items-center justify-center bg-luxury-gold/5 mb-2 shadow-gold-glow">
                {point.icon}
              </div>
              <h3 className="text-lg font-serif text-white font-medium">
                {point.title}
              </h3>
              <p className="text-sm font-light text-luxury-lightGray leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
