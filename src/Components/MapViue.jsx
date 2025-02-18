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
    { id: 1, name: "Mountain Flower Farm and Chalet", position: [32.126552, 35.991287] },
    { id: 2, name: "Azraq Lodge", position: [32.111568, 35.982770] },
    { id: 3, name: "Golden Inn", position: [32.093654, 35.960539] },
    { id: 4, name: "Petra Rose Farm", position: [32.110437, 35.908479] },
    { id: 5, name: "RR Inn", position: [32.115831, 36.060163] },
    { id: 6, name: "Alsharif Luxury Holiday Villa", position: [32.011442, 36.087067] },
    { id: 7, name: "Round Trips Home", position: [32.069322, 35.973395] },
    { id: 8, name: "Beautiful Chalet in Zarqa", position: [32.074774, 36.277093] },
    { id: 9, name: "Mazra'a and Swimming Pools Chalets", position: [32.146025, 36.164808] },
    { id: 10, name: "Shaleh Jamil in Zarqa", position: [31.935819, 36.199375] },
  ];

  return (
    <>
      <h2
        className="text-2xl md:text-3xl font-bold text-green-600 text-center mb-6"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        Find Farms Near You
      </h2>

      <div
        className="w-full max-w-4xl my-20 mx-auto mt-6 h-[400px] rounded-lg shadow-lg border border-gray-300"
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="200"
      >
        <MapContainer
          center={[32.058747, 36.085075]} // Centered on Zarqa
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
