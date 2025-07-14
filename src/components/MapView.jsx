import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const COLORS = {
  'Top n Offenders': '#e53e3e',
  'Heavy Hitters': '#dd6b20',
  'High Runners': '#38a169',
  'Micro/Macro Outage': '#805ad5',
  'Broken Trends': '#718096',
  'Sleepy Cells': '#3182ce',
};

// Severity-based colors for selected sites (more vibrant and distinct)
const SEVERITY_COLORS = {
  1: '#FF1744', // Critical - Bright Red
  2: '#FF9800', // Major - Orange
  3: '#FFC107', // Minor - Amber
  4: '#4CAF50', // Warning - Green
  5: '#2196F3', // Normal - Blue
};

const getIcon = (type, selected, severity = 1) => {
  // Use severity-based colors for selected sites, KPI type colors for others
  const color = selected ? (SEVERITY_COLORS[severity] || SEVERITY_COLORS[1]) : (COLORS[type] || '#000');
  
  return L.divIcon({
    className: '',
    html: `<span class="map-marker${selected ? ' selected' : ''}" style="--color:${color}"></span>`,
    iconSize: selected ? [24, 24] : [16, 16],
    iconAnchor: selected ? [12, 12] : [8, 8],
  });
};

const MapView = ({ sites, onSelect, selected, stateFilter, zoomToSelected = false }) => {
  const center = [39.5, -98.35]; // Adjusted center to better center US
  const [zoom, setZoom] = useState(5); // Start with a more zoomed out view

  const BoundsSetter = () => {
    const map = useMap();
    useEffect(() => {
      if (!sites.length) return;
      
      // Add a small delay to ensure the map is ready
      setTimeout(() => {
        const bounds = L.latLngBounds(sites.map((s) => [s.lat, s.lng]));
        map.fitBounds(bounds, { 
          maxZoom: stateFilter === 'All' ? 9 : 12, // Increased zoom levels for better detail
          padding: [20, 20] // Increased padding for better visibility
        });
        setZoom(map.getZoom());
      }, 50);
    }, [stateFilter, sites]);
    return null;
  };

  const SelectedSetter = () => {
    const map = useMap();
    useEffect(() => {
      if (zoomToSelected && selected && selected.lat && selected.lng) {
        // Add a small delay to ensure the map is ready
        setTimeout(() => {
          map.flyTo([selected.lat, selected.lng], 12, {
            duration: 1.5 // Smooth animation duration
          });
          setZoom(12);
        }, 100);
      }
    }, [selected, zoomToSelected]);
    return null;
  };

  const ZoomHandler = () => {
    const map = useMapEvents({
      zoomend: () => setZoom(map.getZoom()),
    });
    useEffect(() => {
      if (map.getZoom() !== zoom) {
        map.setZoom(zoom);
      }
    }, [zoom, map]);
    return null;
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full full-color rounded border shadow"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <BoundsSetter />
        <SelectedSetter />
        <ZoomHandler />
        {sites.map((site) => (
          <Marker
            key={site.geoId}
            position={[site.lat, site.lng]}
            icon={getIcon(site.kpiType, selected?.id === site.id, site.severity)}
            eventHandlers={{ click: () => onSelect(site) }}
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
  );
};

export default MapView;
