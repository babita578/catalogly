import React from "react";

const options = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Top Rated" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "stock-desc", label: "Stock Availability" },
];

export default function SortPanel({ sortBy, onChange }) {
  return (
    <label className="field">
      <span>Sort</span>
      <select value={sortBy} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
