import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactUs() {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just simulate a submission
    setSubmitted(true);
    setFeedback("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-6 py-10 md:px-16 text-white"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Contact Us
      </h2>

      {/* Contact Info */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
          <FaEnvelope className="text-violet-500 text-3xl mb-2" />
          <h4 className="font-semibold text-lg">Email</h4>
          <p className="text-gray-300">support@handspeak.com</p>
        </div>
        <div className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
          <FaPhoneAlt className="text-violet-500 text-3xl mb-2" />
          <h4 className="font-semibold text-lg">Phone</h4>
          <p className="text-gray-300">+91 98765 43210</p>
        </div>
        <div className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
          <FaMapMarkerAlt className="text-violet-500 text-3xl mb-2" />
          <h4 className="font-semibold text-lg">Address</h4>
          <p className="text-gray-300">Udaipur, Rajasthan, India</p>
        </div>
      </div>

      {/* Feedback Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-md max-w-2xl mx-auto shadow-xl"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Send Us Your Feedback
        </h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="We’d love to hear your thoughts..."
          className="w-full h-32 p-4 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          required
        ></textarea>
        <button
          type="submit"
          className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium py-3 rounded-xl transition"
        >
          Submit Feedback
        </button>

        {submitted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400 text-center mt-4"
          >
            🎉 Thank you for your feedback!
          </motion.p>
        )}
      </motion.form>
    </motion.div>
  );
}