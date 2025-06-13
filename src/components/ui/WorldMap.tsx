import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '@/styles/map.css';
import L from 'leaflet';

// Define the location interface
interface Location {
  id: number;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  description?: string;
}

interface WorldMapProps {
  locations: Location[];
  height?: string;
}

// Create custom icon for markers
const createCustomIcon = () => {
  return new L.Icon({
    iconUrl: '/images/marker-circle.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: 'circular-marker'
  });
};

const WorldMap: React.FC<WorldMapProps> = ({ locations, height = '400px' }) => {
  // Create marker image element for the DOM if it doesn't exist
  useEffect(() => {
    // First, check if we need to create the marker image
    if (!document.getElementById('marker-circle-img')) {
      // Create a hidden image element with a data URL for a circular marker
      const img = document.createElement('img');
      img.id = 'marker-circle-img';
      img.style.display = 'none';
      img.src = 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="white" stroke="#ffffff" stroke-width="2" />
          <circle cx="20" cy="20" r="14" fill="#3b82f6" />
        </svg>
      `);
      document.body.appendChild(img);
    }

    // Fix the 'delete L.Icon.Default.prototype._getIconUrl' issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    return () => {
      // Clean up when component unmounts
      const img = document.getElementById('marker-circle-img');
      if (img) document.body.removeChild(img);
    };
  }, []);

  // World view settings - adjust for different screen sizes
  const [defaultPosition, setDefaultPosition] = React.useState<[number, number]>([20, 0]); // Centered on the world
  
  // Use a useEffect to safely handle window access (for SSR compatibility)
  const [defaultZoom, setDefaultZoom] = React.useState(2);
  
  // Set appropriate zoom level and position based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDefaultZoom(1); // Smaller zoom on mobile
        setDefaultPosition([10, 0]); // Adjust center position for mobile
      } else if (window.innerWidth < 1024) {
        setDefaultZoom(1.5); // Medium zoom for tablets
        setDefaultPosition([15, 0]);
      } else {
        setDefaultZoom(2); // Normal zoom on desktop
        setDefaultPosition([20, 0]);
      }
    };
    
    // Initial check
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const customIcon = createCustomIcon();
  
  // Add custom height to document if needed
  useEffect(() => {
    if (height !== '400px') {
      // Create or update the custom height style
      let style = document.getElementById('custom-map-height');
      if (!style) {
        style = document.createElement('style');
        style.id = 'custom-map-height';
        document.head.appendChild(style);
      }
      style.innerHTML = `.custom-height { height: ${height}; }`;
      
      return () => {
        // Clean up when component unmounts
        if (style) {
          document.head.removeChild(style);
        }
      };
    }
  }, [height]);

  // Apply the appropriate class based on height
  const mapContainerClass = height === '400px' ? 'map-container' : `map-container map-height-${height.replace('px', '')}`;
  
  return (
    <div className={mapContainerClass}>
      <MapContainer 
        center={defaultPosition} 
        zoom={defaultZoom} 
        className="leaflet-container dark-map"
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
      >
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {locations.map((location) => (
          <Marker 
            key={location.id} 
            position={location.coordinates}
            icon={customIcon}
          >
            <Popup className="custom-popup">
              <div className="location-popup">
                <h3>{location.name}</h3>
                {location.description && <p>{location.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default WorldMap;
