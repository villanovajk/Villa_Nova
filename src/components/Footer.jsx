import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer id="footer" className="bg-luxury-black border-t border-white/5 pt-20 pb-10 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
        
        {/* Brand & Narrative */}
        <div className="space-y-6 md:col-span-1">
          <Link to="/" className="inline-block">
            <span className="font-serif text-3xl font-light tracking-[0.25em] text-white hover:text-luxury-gold transition-colors duration-300">
              N O V A
            </span>
          </Link>
          <p className="text-sm font-light text-luxury-lightGray leading-relaxed max-w-sm">
            A spectacular private estate offering peerless design, absolute privacy, and bespoke concierge services tailored exclusively for you.
          </p>
          <div className="flex space-x-5">
            <a href="https://instagram.com" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-luxury-lightGray hover:text-luxury-gold hover:border-luxury-gold transition-all duration-300" aria-label="Instagram">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a href="https://facebook.com" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-luxury-lightGray hover:text-luxury-gold hover:border-luxury-gold transition-all duration-300" aria-label="Facebook">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="https://twitter.com" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-luxury-lightGray hover:text-luxury-gold hover:border-luxury-gold transition-all duration-300" aria-label="Twitter">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Sitemap Navigation */}
        <div className="space-y-6">
          <h4 className="text-xs uppercase font-semibold tracking-[0.2em] text-luxury-gold">Sitemap</h4>
          <ul className="space-y-3 text-sm font-light text-luxury-lightGray">
            <li>
              <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
            </li>
            <li>
              <a href="#featured-properties" className="hover:text-white transition-colors duration-200">Properties</a>
            </li>
            <li>
              <a href="#why-us" className="hover:text-white transition-colors duration-200">Why NOVA</a>
            </li>
            <li>
              <a href="#about" className="hover:text-white transition-colors duration-200">About Us</a>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h4 className="text-xs uppercase font-semibold tracking-[0.2em] text-luxury-gold">Contact Office</h4>
          <ul className="space-y-4 text-sm font-light text-luxury-lightGray">
            <li className="flex items-start space-x-3">
              <MapPin size={16} className="text-luxury-gold flex-shrink-0 mt-0.5" />
              <span>Anugraha Satellite Township Backside, Periyakattupalayan, Madalpattu, Tamil Nadu 605007</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={16} className="text-luxury-gold flex-shrink-0" />
              <a href="tel:+917418345279" className="hover:text-white transition-colors duration-200">+91 74183 45279</a>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={16} className="text-luxury-gold flex-shrink-0" />
              <a href="tel:+916379176913" className="hover:text-white transition-colors duration-200">+91 6379 176913</a>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={16} className="text-luxury-gold flex-shrink-0" />
              <a href="mailto:villanovajk@gmail.com" className="hover:text-white transition-colors duration-200">villanovajk@gmail.com</a>
            </li>
          </ul>
        </div>

        {/* Exclusive newsletter */}
        <div className="space-y-6">
          <h4 className="text-xs uppercase font-semibold tracking-[0.2em] text-luxury-gold">Private Member List</h4>
          <p className="text-sm font-light text-luxury-lightGray leading-relaxed">
            Subscribe to receive exclusive off-market listings, custom itineraries, and early booking access.
          </p>
          {subscribed ? (
            <p className="text-xs text-luxury-gold animate-fade-in font-light">
              Welcome to the NOVA inner circle.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="relative border-b border-white/20 pb-2">
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-sm w-full font-light focus:outline-none placeholder-white/30 text-white pr-10"
              />
              <button type="submit" className="absolute right-0 top-0 text-luxury-gold hover:text-white transition-colors duration-200" aria-label="Subscribe">
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Copyright and Legal links */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-light text-white/40 gap-4">
        <div>
          &copy; {new Date().getFullYear()} Nova Villa. All rights reserved.
        </div>
        <div className="flex space-x-8">
          <a href="#privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
          <a href="#terms" className="hover:text-white transition-colors duration-200">Terms & Conditions</a>
          <a href="#licensing" className="hover:text-white transition-colors duration-200">Licensing</a>
        </div>
      </div>
    </footer>
  );
}
