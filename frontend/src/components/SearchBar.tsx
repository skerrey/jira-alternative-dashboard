import React from "react";
import { SearchBarProps } from "../interfaces";

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <div className="flex-1 max-w-[400px]">
      <input
        type="text"
        placeholder="Search issues..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 border-2 border-gray-300 rounded text-sm outline-none transition-colors focus:border-blue-600"
      />
    </div>
  );
};

export default SearchBar;

