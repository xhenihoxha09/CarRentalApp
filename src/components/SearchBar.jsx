import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const citySuggestions = [
  "Tirane",
  "Durres",
  "Vlore",
  "Saranda",
  "Shkoder",
  "Berat",
  "Gjirokaster",
  "Korce",
  "Elbasan",
];

export default function SearchBar({
  model,
  setModel,
  location,
  setLocation,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  searchOpen,
  setSearchOpen,
  handleSearch,
}) {
  const wrapperRef = useRef();
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  // Close search when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  // Update filtered city list as user types
  useEffect(() => {
    if (!location) {
      setFilteredSuggestions([]);
    } else {
      const filtered = citySuggestions.filter((city) =>
        city.toLowerCase().startsWith(location.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
  }, [location]);

  const handleSelectSuggestion = (city) => {
    setLocation(city);
    setFilteredSuggestions([]);
  };

  return (
    <div
      className="relative w-full max-w-[95%] sm:max-w-xl mx-auto"
      ref={wrapperRef}
    >
      {/* Collapsed Search (Mobile + Default View) */}
      <div
        className="flex items-center justify-between gap-2 px-4 py-2 border rounded-full shadow-sm cursor-pointer bg-white hover:shadow-md transition"
        onClick={() => setSearchOpen(true)}
      >
        <span className="text-sm text-gray-700">{location || "Anywhere"}</span>
        <span className="text-sm text-gray-500 hidden sm:inline">
          {startDate ? startDate.toLocaleDateString() : "Any week"}
        </span>
        <div className="p-2 bg-[#A9FF3A] rounded-full">
          <svg
            className="h-4 w-4 text-[#2E2E3A]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 10-14 0 7 7 0 0014 0z"
            />
          </svg>
        </div>
      </div>

      {/* Expanded Search */}
      {searchOpen && (
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-full sm:w-[90vw] max-w-lg bg-white shadow-xl rounded-xl z-50 p-4 sm:p-6 space-y-4">
          {/* Location Input */}
          <div>
            <label className="text-sm font-medium">Location</label>
            <input
              type="text"
              placeholder="Search location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md text-sm"
            />
            {filteredSuggestions.length > 0 && (
              <ul className="mt-1 border border-gray-200 rounded-md bg-white max-h-40 overflow-y-auto text-sm">
                {filteredSuggestions.map((city, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectSuggestion(city)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Car Model */}
          <div>
            <label className="text-sm font-medium">Car Model</label>
            <input
              type="text"
              placeholder="e.g. Audi, Toyota..."
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md text-sm"
            />
          </div>

          {/* Date Pickers */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="text-sm font-medium">From</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Check-in"
                className="w-full mt-1 px-4 py-2 border rounded-md text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">To</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="Check-out"
                className="w-full mt-1 px-4 py-2 border rounded-md text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSearch}
            className="w-full mt-2 py-2 bg-[#A9FF3A] text-[#2E2E3A] font-semibold rounded-md"
          >
            Search
          </button>
        </div>
      )}
    </div>
  );
}
