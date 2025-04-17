import React from "react";
import { motion } from "framer-motion";
import { FaPeopleCarry, FaHandsHelping, FaGlobeAmericas } from "react-icons/fa";

export default function AboutUs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-6 py-10 md:px-16 text-white"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        About HandSpeak
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-sm hover:scale-105 transition">
          <FaPeopleCarry className="text-violet-500 text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
          <p className="text-gray-300">
            To bridge the communication gap between the hearing and deaf
            communities using cutting-edge AI and computer vision technology.
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-sm hover:scale-105 transition">
          <FaHandsHelping className="text-violet-500 text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">What We Do</h3>
          <p className="text-gray-300">
            We convert sign language into text in real time, empowering more
            inclusive conversations and making the world a bit more accessible.
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-sm hover:scale-105 transition">
          <FaGlobeAmericas className="text-violet-500 text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Global Vision</h3>
          <p className="text-gray-300">
            We're committed to a future where language is no longer a barrier —
            across borders, communities, and abilities.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
