// src/app/components/SearchBar.tsx
import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const SearchBar: React.FC = () => {
  return (
    <div className="search-bar-container flex items-center w-full max-w-md">
      <div className="search-bar-wrapper relative flex-grow">
        {/* Input Field */}
        <input
          type="text"
          placeholder="Search"
          aria-label="Search"
          className="search-input w-full py-2 pl-4 pr-12 text-sm bg-white text-black placeholder-gray-500 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Search Button */}
        <button
          type="submit"
          aria-label="Search"
          className="search-button absolute inset-y-0 right-0 flex items-center pr-4 bg-transparent border-none focus:outline-none"
        >
          <MagnifyingGlassIcon className="search-icon w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
