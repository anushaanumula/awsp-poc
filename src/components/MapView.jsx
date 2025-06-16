import React, { useMemo, useEffect } from 'react';
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
    html: `<span class="map-pointer${selected ? ' selected' : ''}" style="--color:${
      COLORS[type] || '#000'
    }"></span>`,
    iconSize: selected ? [20, 20] : [16, 16],
    iconAnchor: selected ? [10, 20] : [8, 16],
  });

const MapView = ({ sites, onSelect, selected }) => {
  const center = [39.5, -97.5];

  // Memoize coordinates so all points appear around the central US
  const fixedSites = useMemo(() => {
    return sites.map((site, i) => {
      const row = Math.floor(i / 10);
      const col = i % 10;
      const lat = 39.5 + (row - 3) * 0.3;
      const lng = -97.5 + (col - 5) * 0.3;
      return { ...site, lat, lng };
    });
  }, [sites]);

  const BoundsSetter = () => {
    const map = useMap();
    useEffect(() => {
      if (!fixedSites.length) return;
      const bounds = L.latLngBounds(fixedSites.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { maxZoom: 6 });
    }, [fixedSites, map]);
    return null;
  };

  return (
    <MapContainer center={center} zoom={4} scrollWheelZoom={true} className="w-full h-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <BoundsSetter />
      {fixedSites.map((site) => (
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
