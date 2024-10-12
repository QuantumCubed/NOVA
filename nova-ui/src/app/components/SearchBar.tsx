import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const SearchBar: React.FC = () => {
  return (
    <div className="search-bar-container">
      <div className="search-bar-wrapper relative">
        {/* Input Field */}
        <input
          type="text"
          placeholder="Search"
          aria-label="Search"
          className="search-input"
        />

        {/* Search Button */}
        <button
          type="submit"
          aria-label="Search"
          className="search-button"
        >
          <MagnifyingGlassIcon className="search-icon" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
