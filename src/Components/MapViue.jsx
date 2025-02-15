import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useEffect, useRef } from "react";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the AOS CSS

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapViue() {
  // Initialize AOS
  useEffect(() => {
    AOS.init();
  }, []);

  const mapRef = useRef(null); // لاستخدام الـ ref لتخزين الخريطة

  const locations = [
    { id: 1, name: "Al-Qudis - soccer field", position: [32.0784409, 36.072574] },
    { id: 2, name: "Petra soccer field", position: [32.08336976603278, 36.081933847826285] },
    { id: 3, name: "Bolywood soccer field", position: [32.110474812696, 36.090716838817514] },
    { id: 4, name: "Municipal Stadium", position: [32.054181432072866, 36.08836619659992] },
    { id: 5, name: "Golden Ball Stadium Penta", position: [32.04704880147237, 36.09512434593029] },
    { id: 6, name: "Aljmzawey courts", position: [32.068184029167426, 36.074773142959764] },
    { id: 7, name: "Khatab Court", position: [32.083348319095606, 36.08748916334725] },
    { id: 8, name: "Seher Alshouq", position: [32.08847753364245, 36.113675371048494] },
    { id: 9, name: "Tarawneh Stadium", position: [32.09444815587646, 36.07893494685292] },
  ];

  return (
    <>
      <h2
        className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        Find Stadiums Near You
      </h2>

      <div
        className="w-full max-w-4xl my-20 mx-auto mt-6 h-[400px] rounded-lg shadow-lg border border-gray-300"
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="200"
      >
        <MapContainer
          center={[32.07275, 36.08796]} // Centered on Amman
          zoom={12} // Adjust zoom level to show all markers
          style={{ height: "100%", width: "100%" }}
          ref={mapRef} // ربط الخريطة باستخدام ref
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locations.map((location) => (
            <Marker key={location.id} position={location.position}>
              <Popup>
                <strong>{location.name}</strong> <br />
                Available for bookings.
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
}

export default MapViue;
