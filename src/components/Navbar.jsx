import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, PhoneCall } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBookNow = () => {
    // Navigate to properties grid or detail
    const featuredSection = document.getElementById("featured-properties");
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const sect = document.getElementById("featured-properties");
        if (sect) sect.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-luxury-black/80 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo Branding */}
        <Link
          to="/"
          className="flex items-center gap-2 group cursor-pointer"
        >
          <span className="font-serif text-2xl md:text-3xl font-light tracking-[0.25em] text-white group-hover:text-luxury-gold transition-colors duration-300">
            N O V A
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-10">
          <Link
            to="/"
            className="text-sm tracking-widest uppercase hover:text-luxury-gold transition-colors duration-300"
          >
            Home
          </Link>
          <a
            href="#featured-properties"
            className="text-sm tracking-widest uppercase hover:text-luxury-gold transition-colors duration-300"
          >
            Properties
          </a>
          <a
            href="#why-us"
            className="text-sm tracking-widest uppercase hover:text-luxury-gold transition-colors duration-300"
          >
            About Us
          </a>
          <a
            href="#footer"
            className="text-sm tracking-widest uppercase hover:text-luxury-gold transition-colors duration-300"
          >
            Contact
          </a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-6">
          <a
            href="tel:+917418345279"
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-luxury-lightGray hover:text-white transition-colors duration-300"
          >
            <PhoneCall size={14} className="text-luxury-gold" />
            <span>24/7 Concierge</span>
          </a>
          <button
            onClick={handleBookNow}
            className="relative px-6 py-2.5 overflow-hidden group rounded-none border border-luxury-gold/50 bg-transparent text-xs tracking-widest uppercase text-white hover:text-luxury-black transition-all duration-300"
          >
            <span className="absolute inset-0 w-full h-full bg-luxury-gold origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out -z-10"></span>
            Book Now
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-luxury-gold transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 top-[73px] bg-luxury-black/98 backdrop-blur-xl z-40 transition-all duration-500 md:hidden flex flex-col justify-between p-8 border-t border-white/5 ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-6 text-center mt-8">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-xl tracking-widest uppercase hover:text-luxury-gold transition-colors duration-300 font-light"
          >
            Home
          </Link>
          <a
            href="#featured-properties"
            onClick={() => setIsOpen(false)}
            className="text-xl tracking-widest uppercase hover:text-luxury-gold transition-colors duration-300 font-light"
          >
            Properties
          </a>
          <a
            href="#why-us"
            onClick={() => setIsOpen(false)}
            className="text-xl tracking-widest uppercase hover:text-luxury-gold transition-colors duration-300 font-light"
          >
            About Us
          </a>
          <a
            href="#footer"
            onClick={() => setIsOpen(false)}
            className="text-xl tracking-widest uppercase hover:text-luxury-gold transition-colors duration-300 font-light"
          >
            Contact
          </a>
        </div>

        <div className="flex flex-col items-center space-y-6 mb-12">
          <a
            href="tel:+917418345279"
            className="flex items-center gap-2 text-sm uppercase tracking-widest text-luxury-lightGray hover:text-white"
          >
            <PhoneCall size={16} className="text-luxury-gold" />
            <span>24/7 Concierge</span>
          </a>
          <button
            onClick={handleBookNow}
            className="w-full py-4 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black font-semibold text-xs tracking-widest uppercase transition-colors duration-300"
          >
            Book Now
          </button>
        </div>
      </div>
    </nav>
  );
}
