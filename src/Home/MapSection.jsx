import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapSection = () => {
  const position = [23.8103, 90.4125]; // Dhaka coordinates

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className="w-full bg-white rounded-lg shadow-md p-6 mt-10"
    >
      <h2 className="text-3xl font-bold text-center text-green-700 mb-8">📍 Our Location</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Content */}
        <div className="lg:w-1/2 space-y-4">
          <p className="text-gray-700 text-justify mt-4">
            KachaBazaar is your trusted online destination for fresh produce and
            local market goods. Operating directly from the heart of Dhaka, we
            connect daily vendors and customers through a transparent and fast
            delivery ecosystem. Our platform highlights the charm and value of
            traditional bazaars while embracing the convenience of modern
            e-commerce.
          </p>
          <p className="text-gray-700">
            Whether you're shopping from home or on the go, find trusted vendors,
            real-time pricing, and market-verified freshness — all from the
            comfort of your screen.
          </p>
        </div>

        {/* Right Map */}
        <div className="lg:w-1/2 h-[300px] md:h-[400px]">
          <MapContainer
            center={position}
            zoom={12}
            scrollWheelZoom={false}
            className="h-full w-full rounded-md overflow-hidden"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>KachaBazaar Main Hub – Dhaka</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default MapSection;
