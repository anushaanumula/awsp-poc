import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MapLegend from './MapLegend'

const COLORS = {
  'Top n Offenders': '#e53e3e',
  'Heavy Hitters': '#dd6b20',
  'High Runners': '#38a169',
  'Micro/Macro Outage': '#805ad5',
  'Broken Trends': '#718096',
  'Sleepy Cells': '#3182ce',
  'Default': '#000000', // Added a default fallback color here
};

// Severity-based colors for selected sites (more vibrant and distinct)
const SEVERITY_COLORS = {
  1: '#FF1744', // Critical - Bright Red
  2: '#FF9800', // Major - Orange
  3: '#FFC107', // Minor - Amber
  4: '#4CAF50', // Warning - Green
  5: '#2196F3', // Normal - Blue
};

const getMarkerColor = (kpiType, selected, severity) => {
  const effectiveSeverity = Math.max(1, Math.min(5, severity || 5));

  if (effectiveSeverity === 1 || effectiveSeverity === 2) {
    return SEVERITY_COLORS[effectiveSeverity];
  }

  if (selected) {
    return SEVERITY_COLORS[effectiveSeverity];
  }

  return COLORS[kpiType] || COLORS['Default']; // This line now correctly falls back to COLORS['Default']
};

const getIcon = (type, selected, severity = 5) => { // Default severity to 5 (Normal)
  // getIcon should now call getMarkerColor to be consistent with the coloring logic
  const color = getMarkerColor(type, selected, severity); // Use getMarkerColor for the icon color logic

  return L.divIcon({
    className: `map-marker-container ${selected ? 'selected' : ''}`,
    html: `<span class="map-marker" style="background-color:${color}; border-color:${color}"></span>`,
    iconSize: selected ? [28, 28] : [18, 18],
    iconAnchor: selected ? [14, 14] : [9, 9],
    tooltipAnchor: [0, -15]
  });
};

// Component to manage initial bounds fitting and state filter changes
const MapBoundsAndZoomHandler = ({ sites, stateFilter, selected, zoomToSelected }) => {
  const map = useMap();
  const initialLoadRef = useRef(true); // To track if it's the very first load of the map
  const lastProcessedStateFilter = useRef(null); // To prevent re-fitting if filter hasn't genuinely changed
  const lastSelectedSiteId = useRef(null); // To prevent re-flying if the same site is re-selected

  useEffect(() => {
    // Logic for fitting bounds based on stateFilter
    if (sites.length > 0) {
      // Fit bounds when stateFilter *genuinely* changes or on initial load
      const isStateFilterChanged = lastProcessedStateFilter.current !== stateFilter;
      const shouldFitBoundsInitially = initialLoadRef.current && stateFilter === 'All';

      if (shouldFitBoundsInitially || (isStateFilterChanged && stateFilter !== 'All')) {
        setTimeout(() => {
          const bounds = L.latLngBounds(sites.map(s => [s.lat, s.lng]));
          let targetZoom = 9; // Default zoom for specific states
          if (stateFilter === 'All') {
            targetZoom = 5; // Zoom out for all US
          } else if (sites.length === 1) {
            targetZoom = 12; // Zoom in for a single site
          }
          map.flyToBounds(bounds, { maxZoom: targetZoom, padding: [50, 50], duration: 1.0 });
          lastProcessedStateFilter.current = stateFilter;
        }, 100); // Small delay
      }
    }

    // Logic for flying to selected site (only if zoomToSelected is enabled)
    if (zoomToSelected && selected && selected.lat && selected.lng) {
      // Only fly if a *new* site is selected
      if (lastSelectedSiteId.current !== selected.id) {
        setTimeout(() => {
          map.flyTo([selected.lat, selected.lng], 12, { duration: 1.5 });
          lastSelectedSiteId.current = selected.id;
        }, 300); // Slightly longer delay to avoid conflict with initial fitBounds
      }
    } else if (!selected) {
      // If no site is selected, reset last selected ID to allow re-selection later
      lastSelectedSiteId.current = null;
    }

    // After initial render, set initialLoadRef to false
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
    }
  }, [sites, stateFilter, selected, zoomToSelected, map]);

  return null;
};

// Modify the return statement in the MapView component to place the legend below the map
const MapView = ({ sites, onSelect, selected, stateFilter, zoomToSelected = false }) => {
  const initialCenter = [39.5, -98.35]; // Center of the contiguous US
  const initialZoom = 5; // More zoomed out for initial overview

  // Update the return statement in the MapView component to make the map taller and legend smaller

  // Adjust the return statement to give more vertical space to the map
  return (
    <div className="flex flex-col h-full w-full">
      <div className="relative flex-grow-[15]"> {/* Increased from 9 to 15 */}
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          scrollWheelZoom={true}
          className="w-full h-full full-color rounded-t border shadow"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <MapBoundsAndZoomHandler
            sites={sites}
            stateFilter={stateFilter}
            selected={selected}
            zoomToSelected={zoomToSelected}
          />

          {sites.map((site) => (
            <Marker
              key={site.geoId}
              position={[site.lat, site.lng]}
              icon={getIcon(site.kpiType, selected?.id === site.id, site.severity)}
              eventHandlers={{ click: () => onSelect({
                ...site,
                id: site.geoId,
                kpiType: site.kpiType,
                severity: site.severity
              })}}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} className="!text-xs">
                <div>
                  <div className="font-semibold">{site.geoId}</div>
                  <div>eNodeB: {site.enodeb}</div>
                  <div>Market: {site.state}</div>
                  <div>KPI: <span className="font-mono">{site.kpiType}</span></div>
                  <div>Severity: <span className="font-mono">{site.severity}</span></div>
                  <div className="text-gray-500 text-xs">
                    {site.lat.toFixed(4)}, {site.lng.toFixed(4)}
                  </div>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Legend area - only shows content when site is selected */}
      <div className="bg-gray-50 border-t border-x border-b rounded-b shadow-sm flex-grow-[1] max-h-16">
        <MapLegend
          hasSelectedSite={!!selected}
          selectedSite={selected}
          visibleSites={sites}
        />
      </div>
    </div>
  );
};

export default MapView;