import React from 'react';
import MapView from './MapView';

export default function MapBox({ sites, selected, onSelect }) {
  if (!sites || sites.length === 0) {
    return <div className="h-64 border rounded" />;
  }
  return (
    <div className="h-64 border rounded">
      <MapView
        sites={sites}
        onSelect={onSelect || (() => {})}
        selected={selected}
        stateFilter={sites[0].state || sites[0].market}
        zoomToSelected
      />
    </div>
  );
}
