import React from 'react';

export default function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit();
      }}
      className="w-full"
    >
      <input
        className="border rounded w-full p-2 text-sm"
        placeholder="Search eNodeB or market"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </form>
  );
}
