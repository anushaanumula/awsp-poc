import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import Leaflet's marker images manually because bundlers like Vite don't
// automatically include them
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Set default icon manually
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Slightly larger icon used for the selected marker
const SelectedIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [30, 50],
  iconAnchor: [15, 50],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({ sites, onSelect, selected }) => {
  const center = [37.7749, -122.4194];

  // Memoize fixed site coordinates to prevent shifting on re-render
  const fixedSites = useMemo(() => {
    return sites.map((site) => ({
      ...site,
      lat: site.lat ?? 37.7 + (site.geoId % 100) * 0.01,
      lng: site.lng ?? -122.4 + (site.geoId % 100) * 0.01,
    }));
  }, [sites]);

  return (
    <MapContainer center={center} zoom={4} scrollWheelZoom={true} className="w-full h-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {fixedSites.map((site) => (
        <Marker
          key={site.geoId}
          position={[site.lat, site.lng]}
          icon={selected?.id === site.id ? SelectedIcon : DefaultIcon}
          eventHandlers={{ click: () => onSelect(site) }}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
