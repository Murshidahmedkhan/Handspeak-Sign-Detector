import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHandPeace } from "react-icons/fa";
import SignDetector from "./SignDetector";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";

export default function LandingPage() {
  const [page, setPage] = useState("home");

  const renderContent = () => {
    if (page === "detect") return <SignDetector />;
    if (page === "about") return <AboutUs />;
    if (page === "contact") return <ContactUs />;
    return (
      <>
        {/* Hero Section (Default) */}
        <main className="flex flex-1 flex-col-reverse md:flex-row items-center justify-between px-6 py-12 md:px-20 gap-10">
          {/* Left Text */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 text-center md:text-left space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow">
              Speak with
              <br className="hidden md:block" /> Your Hands.
            </h1>
            <p className="text-gray-300 text-lg max-w-xl">
              HandSpeak turns sign language into text in real-time using your
              camera. Bridging communication, one gesture at a time.
            </p>
            <button
              onClick={() => setPage("detect")}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
            >
              Start Detection
            </button>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 flex justify-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3909/3909444.png"
              alt="Hand Sign Language Illustration"
              className="w-64 md:w-80 drop-shadow-xl rounded-xl border border-white/20"
            />
          </motion.div>
        </main>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      {/* Header */}
      <header className="flex flex-wrap justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2 text-2xl font-bold text-white">
          <FaHandPeace className="text-violet-500" />
          HandSpeak
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          {[
            { label: "Home", value: "home" },
            { label: "About Us", value: "about" },
            { label: "Contact Us", value: "contact" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setPage(item.value)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                page === item.value
                  ? "bg-violet-600 text-white shadow-md scale-105"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Page Content */}
      <div className="flex-1">{renderContent()}</div>

      {/* Footer */}
      {page === "home" && (
        <footer className="text-center py-6 text-sm text-gray-400">
          &copy; 2025 HandSpeak. Empowering communication for all.
        </footer>
      )}
    </div>
  );
}
