import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
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

const getIcon = (type, selected) =>
  L.divIcon({
    className: '',
    html: `<span class="map-marker${selected ? ' selected' : ''}" style="--color:${
      COLORS[type] || '#000'
    }"></span>`,
    iconSize: selected ? [18, 18] : [14, 14],
    iconAnchor: selected ? [9, 9] : [7, 7],
  });

const MapView = ({ sites, onSelect, selected, stateFilter }) => {
  const center = [39.5, -97.5];

  const BoundsSetter = () => {
    const map = useMap();
    useEffect(() => {
      if (!sites.length) return;
      const bounds = L.latLngBounds(sites.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { maxZoom: stateFilter === 'All' ? 7 : 10 });
    }, [sites, map, stateFilter]);
    return null;
  };

  return (
    <MapContainer center={center} zoom={6} scrollWheelZoom={true} className="w-full h-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <BoundsSetter />
      {sites.map((site) => (
        <Marker
          key={site.geoId}
          position={[site.lat, site.lng]}
          icon={getIcon(site.kpiType, selected?.id === site.id)}
          eventHandlers={{ click: () => onSelect(site) }}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
