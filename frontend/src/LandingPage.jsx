// src/pages/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 shadow">
        <h1>MedTrack</h1>
        <nav>
          <Link to="/login" className="mr-4 text-blue-600 font-medium hover:underline">Login</Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center flex-1 text-center px-4 py-16">
        <h2 className="text-4xl font-extrabold mb-4">All your medical tests in one secure place</h2>
        <p className="text-lg mb-6 text-gray-600">
          Upload PDFs, get instant interpretation, and track your health over time.
        </p>
        <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700">
          Get Started
        </Link>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-2 gap-6 max-w-4xl w-full text-left">
          <Feature text="✅ Easy PDF Upload" />
          <Feature text="✅ Automatic Interpretation" />
          <Feature text="✅ Full History of Your Tests" />
          <Feature text="✅ Encrypted and Secure Data" />
        </div>

        {/* Image/Mockup placeholder */}
        <div className="mt-16 w-full max-w-3xl">
          <div className="aspect-video bg-gray-200 rounded-xl shadow-inner flex items-center justify-center text-gray-500">
            [App screenshot or feature graphic]
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm py-6 border-t mt-12 text-gray-500">
        © 2025 MedAI | <Link to="/terms" className="hover:underline">Terms of Service</Link> | <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
      </footer>
    </div>
  );
}

function Feature({ text }) {
  return <div className="bg-gray-50 p-4 rounded shadow-sm">{text}</div>;
}
