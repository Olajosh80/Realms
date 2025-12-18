"use client";

import React, { useEffect, useState } from "react";
import { MdWbSunny, MdDarkMode } from "react-icons/md";

export default function Topbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 shadow bg-gradient-blue from-blue-800 to-blue-600 text-white">
      {/* Portal name */}
      <h1 className="text-lg font-bold flex items-center gap-2">
        <img src="/logo.png" alt="BeyondRealms" className="h-8 w-8 rounded-full" />
        BeyondRealms
      </h1>

      {/* Right section */}
      <div className="flex items-center gap-6">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-white/20 transition"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <MdWbSunny className="w-5 h-5" /> : <MdDarkMode className="w-5 h-5" />}
        </button>

        {/* Current time */}
        <div className="font-mono text-sm">{time.toLocaleTimeString()}</div>

        {/* User info */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">John Doe</span>
          <img
            src="/admin-logo.png"
            alt="Admin"
            className="h-8 w-8 rounded-full border-2 border-white object-cover"
          />
        </div>
      </div>
    </header>
  );
}
