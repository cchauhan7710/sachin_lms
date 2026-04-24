import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { SunIcon, MoonIcon } from "../icons/IconLibrary";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group overflow-hidden shadow-sm"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Sun Icon */}
        <div
          className={`absolute transition-all duration-500 transform ${
            theme === "dark" ? "rotate-90 opacity-0 scale-0" : "rotate-0 opacity-100 scale-100"
          }`}
        >
          <SunIcon className="w-6 h-6 text-orange-500" />
        </div>

        {/* Moon Icon */}
        <div
          className={`absolute transition-all duration-500 transform ${
            theme === "dark" ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-0"
          }`}
        >
          <MoonIcon className="w-6 h-6 text-indigo-400" />
        </div>
      </div>
      
      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className={`absolute inset-0 blur-md ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-orange-500/10'}`}></div>
      </div>
    </button>
  );
};

export default ThemeToggle;
