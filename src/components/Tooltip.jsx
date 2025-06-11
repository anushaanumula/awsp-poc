import React from 'react';

// Simple tooltip that appears on hover or keyboard focus.
const Tooltip = ({ text, children }) => (
  <span className="relative group focus:outline-none">
    {children}
    <span
      role="tooltip"
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none whitespace-nowrap z-10"
    >
      {text}
    </span>
  </span>
);

export default Tooltip;
