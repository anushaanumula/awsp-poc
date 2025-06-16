import React from 'react';

const GuideBanner = ({ onClose }) => (
  <div className="p-3 mb-4 bg-gray-100 border border-gray-300 rounded flex justify-between items-start text-sm bw">
    <p>
      New here? Select a market then pick a site from the table below. Use the
      category filters to focus on the most severe issues and create a task when
      action is needed.
    </p>
    <button
      onClick={onClose}
      aria-label="Dismiss guidance"
      className="btn ml-2 bg-black text-white hover:bg-gray-800"
    >
      ×
    </button>
  </div>
);

export default GuideBanner;
