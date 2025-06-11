import React from 'react';

const GuideBanner = ({ onClose }) => (
  <div className="p-3 mb-4 bg-blue-50 border border-blue-200 rounded flex justify-between items-start text-sm">
    <p>
      New here? Select a market then pick a site from the table below. Use the
      category filters to focus on the most severe issues and create a task when
      action is needed.
    </p>
    <button
      onClick={onClose}
      aria-label="Dismiss guidance"
      className="ml-2 text-blue-700 hover:underline"
    >
      ×
    </button>
  </div>
);

export default GuideBanner;
