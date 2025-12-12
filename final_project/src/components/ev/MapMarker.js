import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createMarkerIcon = (status) => {
  const colors = {
    available: '#10b981',
    charging: '#f59e0b',
    offline: '#ef4444',
    unknown: '#9ca3af'
  };

  const color = colors[status] || colors.unknown;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 3px solid white;
      ">
        <svg style="transform: rotate(45deg);" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

export default function MapMarker({ station }) {
  if (!station.lat || !station.lng) {
    return null;
  }

  return (
    <Marker
      position={[station.lat, station.lng]}
      icon={createMarkerIcon(station.status)}
    >
      <Popup>
        <strong>{station.name}</strong>
        <br />
        {station.company}
      </Popup>
    </Marker>
  );
}
