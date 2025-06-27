import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./GlobalWorkforceMap.css";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import L from "leaflet";

// Fix for default marker icons in Leaflet with React
// This is needed because the default icons reference files that are not properly loaded in the React environment
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface WorkforceLocation {
  id: number;
  country: string;
  city: string;
  position: [number, number]; // [latitude, longitude]
  count?: number; // Made optional
}

const GlobalWorkforceMap: React.FC = () => {
  // State to track the selected continent
  const [selectedContinent, setSelectedContinent] = useState<string | null>(
    null
  );
  const { t } = useLanguage();

  // Using hardcoded text instead of translations
  // Map configuration is handled by LayersControl

  // Continent data for cards
  const continents = [
    { id: "all", name: "All Continents", color: "bg-brand-blue", icon: "🌎" },
    { id: "africa", name: "Africa", color: "bg-brand-blue", icon: "🌍" },
    {
      id: "north-america",
      name: "North America",
      color: "bg-brand-blue",
      icon: "🌎",
    },
    { id: "asia", name: "Asia", color: "bg-brand-blue", icon: "🌏" },
    { id: "europe", name: "Europe", color: "bg-brand-blue", icon: "🌍" },
    { id: "caribbean", name: "Caribbean", color: "bg-brand-blue", icon: "🌎" },
  ];

  // Handle continent selection
  const handleContinentClick = (continentId: string) => {
    if (continentId === "all") {
      setSelectedContinent(null);
    } else {
      setSelectedContinent(continentId);
    }
  };

  // Workforce data for all global locations
  const africaLocations: WorkforceLocation[] = [
    { id: 1, country: "Ghana", city: "Accra", position: [5.6037, -0.187] },
    { id: 2, country: "Ghana", city: "Kumasi", position: [6.6885, -1.6244] },
    { id: 3, country: "Nigeria", city: "Lagos", position: [6.5244, 3.3792] },
    {
      id: 4,
      country: "Burkina Faso",
      city: "Ouagadougou",
      position: [12.3714, -1.5197],
    },
  ];

  const usLocations: WorkforceLocation[] = [
    {
      id: 5,
      country: "USA",
      city: "Cambridge, Maryland",
      position: [38.5632, -76.0788],
    },
    {
      id: 6,
      country: "USA",
      city: "Maui, Hawaii",
      position: [20.7984, -156.3319],
    },
    {
      id: 7,
      country: "USA",
      city: "Kauai, Hawaii",
      position: [22.0964, -159.5261],
    },
    {
      id: 8,
      country: "USA",
      city: "Kihei, Hawaii",
      position: [20.7645, -156.445],
    },
    {
      id: 9,
      country: "USA",
      city: "Kahului, Hawaii",
      position: [20.8893, -156.4729],
    },
    {
      id: 10,
      country: "USA",
      city: "Bellevue, Washington",
      position: [47.6101, -122.2015],
    },
    {
      id: 11,
      country: "USA",
      city: "Seattle, Washington",
      position: [47.6062, -122.3321],
    },
    {
      id: 12,
      country: "USA",
      city: "Stowe, Vermont",
      position: [44.4654, -72.6874],
    },
  ];

  const asiaLocations: WorkforceLocation[] = [
    {
      id: 13,
      country: "China",
      city: "Beijing",
      position: [39.9042, 116.4074],
    },
    {
      id: 14,
      country: "Malaysia",
      city: "Kuala Lumpur",
      position: [3.139, 101.6869],
    },
    {
      id: 15,
      country: "Mongolia",
      city: "Ulaanbaatar",
      position: [47.8864, 106.9057],
    },
    { id: 16, country: "Taiwan", city: "Taipei", position: [25.033, 121.5654] },
    {
      id: 17,
      country: "Thailand",
      city: "Bangkok",
      position: [13.7563, 100.5018],
    },
    { id: 18, country: "Jordan", city: "Amman", position: [31.9454, 35.9284] },
  ];

  const europeLocations: WorkforceLocation[] = [
    { id: 19, country: "Poland", city: "Warsaw", position: [52.2297, 21.0122] },
    {
      id: 20,
      country: "Romania",
      city: "Bucharest",
      position: [44.4268, 26.1025],
    },
    {
      id: 21,
      country: "Kosovo",
      city: "Pristina",
      position: [42.6629, 21.1655],
    },
  ];

  const caribbeanLocations: WorkforceLocation[] = [
    {
      id: 22,
      country: "Dominican Republic",
      city: "Santo Domingo",
      position: [18.4861, -69.9312],
    },
    {
      id: 23,
      country: "Jamaica",
      city: "Kingston",
      position: [18.0179, -76.8099],
    },
    {
      id: 24,
      country: "Ecuador",
      city: "Quito",
      position: [-0.1807, -78.4678],
    },
  ];

  // Locations are configured above and displayed on the map

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-brand-orange font-medium mb-3"
          >
            {t("global_workforce_tag")}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            {t("global_workforce_title")}
          </motion.h2>

          <motion.div
            initial={{ width: "0%" }}
            whileInView={{ width: "80px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1 bg-brand-orange mx-auto rounded-full"
          ></motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto"
          >
            {t("global_workforce_description")}
          </motion.p>
        </div>

        {/* Continent Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {continents.map((continent) => (
            <motion.div
              key={continent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleContinentClick(continent.id)}
              className={`continent-card rounded-lg shadow-md cursor-pointer p-2 text-center ${
                continent.color
              } ${
                selectedContinent === continent.id ||
                (continent.id === "all" && selectedContinent === null)
                  ? "ring-2 ring-white ring-opacity-60 shadow-lg"
                  : ""
              }`}
            >
              <div className="text-xl mb-1">{continent.icon}</div>
              <h3 className="text-white text-xs font-semibold">
                {continent.name}
              </h3>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-lg overflow-hidden shadow-lg border border-gray-200 h-[600px]"
        >
          <MapContainer
            center={[20, 0]}
            zoom={2}
            className="h-full w-full"
            scrollWheelZoom={false}
            style={{ zIndex: 1 }}
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Street View">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Satellite View">
                <TileLayer
                  attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            {/* Conditionally render markers based on selected continent */}
            {(selectedContinent === null || selectedContinent === "africa") &&
              africaLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.position}
                  eventHandlers={{
                    mouseover: (e) => {
                      e.target.openPopup();
                    },
                  }}
                >
                  <Tooltip permanent direction="top" className="custom-tooltip">
                    <span className="font-medium">{location.country}</span>
                  </Tooltip>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-semibold">
                        {location.city}, {location.country}
                      </h3>
                      {location.count && (
                        <p className="text-sm">{location.count} employees</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* US Markers */}
            {(selectedContinent === null ||
              selectedContinent === "north-america") &&
              usLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.position}
                  eventHandlers={{
                    mouseover: (e) => {
                      e.target.openPopup();
                    },
                  }}
                >
                  <Tooltip permanent direction="top" className="custom-tooltip">
                    <span className="font-medium">{location.country}</span>
                  </Tooltip>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-semibold">
                        {location.city}, {location.country}
                      </h3>
                      {location.count && (
                        <p className="text-sm">{location.count} employees</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* Asia Markers */}
            {(selectedContinent === null || selectedContinent === "asia") &&
              asiaLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.position}
                  eventHandlers={{
                    mouseover: (e) => {
                      e.target.openPopup();
                    },
                  }}
                >
                  <Tooltip permanent direction="top" className="custom-tooltip">
                    <span className="font-medium">{location.country}</span>
                  </Tooltip>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-semibold">
                        {location.city}, {location.country}
                      </h3>
                      {location.count && (
                        <p className="text-sm">{location.count} employees</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* Europe Markers */}
            {(selectedContinent === null || selectedContinent === "europe") &&
              europeLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.position}
                  eventHandlers={{
                    mouseover: (e) => {
                      e.target.openPopup();
                    },
                  }}
                >
                  <Tooltip permanent direction="top" className="custom-tooltip">
                    <span className="font-medium">{location.country}</span>
                  </Tooltip>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-semibold">
                        {location.city}, {location.country}
                      </h3>
                      {location.count && (
                        <p className="text-sm">{location.count} employees</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* Caribbean Markers */}
            {(selectedContinent === null ||
              selectedContinent === "caribbean") &&
              caribbeanLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.position}
                  eventHandlers={{
                    mouseover: (e) => {
                      e.target.openPopup();
                    },
                  }}
                >
                  <Tooltip permanent direction="top" className="custom-tooltip">
                    <span className="font-medium">{location.country}</span>
                  </Tooltip>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-semibold">
                        {location.city}, {location.country}
                      </h3>
                      {location.count && (
                        <p className="text-sm">{location.count} employees</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </motion.div>

        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            {selectedContinent === null
              ? "Showing all locations. Click on a continent card above to filter the map."
              : `Showing locations in ${
                  continents.find((c) => c.id === selectedContinent)?.name
                }. Click on markers for details.`}
          </p>
        </div>

        {/* Custom styles are added via CSS classes */}
      </div>
    </section>
  );
};

export default GlobalWorkforceMap;
