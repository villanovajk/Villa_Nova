import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import VillaDetailPage from "./pages/VillaDetailPage";

function App() {
  return (
    <Router>
      <div className="bg-luxury-black min-h-screen text-white flex flex-col font-sans select-none">
        {/* Global Navigation Header */}
        <Navbar />

        {/* Dynamic Route Render Body */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/villa/:id" element={<VillaDetailPage />} />
          </Routes>
        </div>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
