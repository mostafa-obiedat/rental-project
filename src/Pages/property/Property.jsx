// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import HeroSection from "../../Components/HeroSection";
// import Chatbot from "../../Components/Chatbot";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import MapViue from "../../Components/MapViue";
// import Button from "../../Components/backtotop";

// function Property() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [priceFilter, setPriceFilter] = useState(0);
//   const [ratingFilter, setRatingFilter] = useState(0);
//   const [roomsFilter, setRoomsFilter] = useState(0);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     AOS.init({ duration: 1000 }); // مدة الأنميشن 1 ثانية
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "https://rent-app-d50fb-default-rtdb.firebaseio.com/properties.json"
//         );
//         const properties = response.data
//           ? Object.keys(response.data).map((key) => ({
//               id: key,
//               ...response.data[key],
//             }))
//           : [];

//         setData(properties);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
//       </div>
//     );

//   if (error)
//     return <div className="text-red-500 text-center mt-5">Error: {error}</div>;

//   const filteredProperties = data
//     .filter(
//       (property) =>
//         !property.soft_delete &&
//         property.status === "approved" &&
//         (priceFilter === 0 || property.price <= priceFilter) &&
//         (ratingFilter === 0 || property.rating >= ratingFilter) &&
//         (roomsFilter === 0 || property.rooms == roomsFilter)
//     )
//     .filter((property) =>
//       property.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   if (filteredProperties.length === 0) {
//     return (
//       <>
//         {/* Hero Section */}
//         <HeroSection />

//         <Chatbot />
//         <div className=" space-y-2 w-full flex items-center justify-center p-4">
//           <div
//             role="alert"
//             className="bg-blue-100 dark:bg-green-900 my-30 border-l-4 border-green-500 dark:border-green-700 text-green-900 dark:text-blue-100 p-2 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-blue-200 dark:hover:bg-green-800 transform hover:scale-105"
//           >
//             <svg
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               fill="none"
//               className="h-10 w-10 flex-shrink-0 mr-2 text-green-600"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 strokeWidth={2}
//                 strokeLinejoin="round"
//                 strokeLinecap="round"
//               />
//             </svg>
//             <p className=" text-4xl font-semibold">There are no properties</p>
//           </div>
//         </div>

//         <MapViue />

//         <Button />
//       </>
//     );
//   }

//   return (
//     <>
//       {/* Hero Section */}
//       <HeroSection />

//       <Chatbot />

//       {/* Property Cards */}
//       <div className="flex flex-col items-center justify-center my-20">
//         <div className="flex flex-wrap w-full justify-center items-center space-x-4 gap-3">
//           <select
//             onChange={(e) => setPriceFilter(Number(e.target.value))}
//             className="border text-green-700 border-green-500 p-2 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
//           >
//             <option value={0}>All Prices</option>
//             <option value={100}>Under $100</option>
//             <option value={150}>Under $150</option>
//             <option value={200}>Under $200</option>
//           </select>
//           <select
//             onChange={(e) => setRatingFilter(Number(e.target.value))}
//             className="border text-green-700 border-green-500 p-2 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
//           >
//             <option value={0}>All Ratings</option>
//             <option value={1}>1+ Stars</option>
//             <option value={2}>2+ Stars</option>
//             <option value={3}>3+ Stars</option>
//             <option value={4}>4+ Stars</option>
//             <option value={5}>5 Stars</option>
//           </select>
//           <select
//             onChange={(e) => setRoomsFilter(Number(e.target.value))}
//             className="border text-green-700 border-green-500 p-2 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
//           >
//             <option value={0}>All Rooms</option>
//             <option value={1}>1+ Room</option>
//             <option value={2}>2+ Rooms</option>
//             <option value={3}>3+ Rooms</option>
//             <option value={4}>4+ Rooms</option>
//             <option value={5}>5+ Rooms</option>
//           </select>
//           <div className="relative w-1/2 flex items-center">
//             <input
//               type="text"
//               className="w-full px-4 text-green-700 placeholder:text-green-700 py-2 border rounded-lg border-green-500 focus:ring-2 focus:ring-green-400 transition-all duration-300 ease-in-out"
//               placeholder="Search"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="my-10 flex-wrap flex items-center justify-center w-[100%]">
//           {filteredProperties.map((property) => (
//             <div key={property.id} className="p-4">
//               <div className="rounded-lg overflow-hidden w-[370px] flex flex-col justify-between min-h-120 shadow-lg p-4 bg-white hover:shadow-2xl transition-all duration-300 ease-in-out">
//                 <img
//                   className="w-full h-48 object-cover"
//                   src={
//                     property.images && property.images[0]
//                       ? property.images[1]
//                       : "https://via.placeholder.com/400"
//                   }
//                   alt={property.name || "Property Image"}
//                 />
//                 <div className="py-4">
//                   <h2 className="font-bold text-xl text-gray-800">
//                     {property.name}
//                   </h2>
//                   <p className="text-gray-600 text-base">
//                     {property.short_description}
//                   </p>
//                   <p className="text-lg text-green-600">
//                     {property.price} JD
//                   </p>
//                   <p className="text-yellow-500">{(4 + Math.random()).toFixed(1)} ★</p>
//                   <p className="text-[#ff4d00]">
//                     🔥 {property.seasonal_offers[0]}
//                   </p>
//                   <Link
//                     to={`/properties/${property.id}`}
//                     className="flex items-center space-x-2 logo-swing"
//                   >
//                     <button
//                       className="hover:cursor-pointer bg-gradient-to-r  shadow-lg border mt-2 border-gray-50 text-center w-48 rounded-2xl h-14 relative  text-xl font-semibold group"
//                       type="button"
//                     >
//                       <div className="bg-[#508D4E] rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 1024 1024"
//                           height="25px"
//                           width="25px"
//                         >
//                           <path
//                             d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
//                             fill="#fff"
//                           />
//                           <path
//                             d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
//                             fill="#fff"
//                           />
//                         </svg>
//                       </div>
//                       <p className="translate-x-2">Details</p>
//                     </button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <MapViue />

//       <Button />
//     </>
//   );
// }

// export default Property;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import HeroSection from "../../Components/HeroSection";
import Chatbot from "../../Components/Chatbot";
import AOS from "aos";
import "aos/dist/aos.css";
import MapViue from "../../Components/MapViue";
import Button from "../../Components/backtotop";

function Property() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceFilter, setPriceFilter] = useState(0);
  const [roomsFilter, setRoomsFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 }); // مدة الأنميشن 1 ثانية
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://rent-app-d50fb-default-rtdb.firebaseio.com/properties.json"
        );
        const properties = response.data
          ? Object.keys(response.data).map((key) => ({
              id: key,
              ...response.data[key],
            }))
          : [];

        setData(properties);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center mt-5">Error: {error}</div>;

  const filteredProperties = data
    .filter(
      (property) =>
        !property.soft_delete &&
        property.status === "approved" &&
        (priceFilter === 0 || property.price <= priceFilter) &&
        (roomsFilter === 0 || property.rooms == roomsFilter)
    )
    .filter((property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (filteredProperties.length === 0) {
    return (
      <>
        {/* Hero Section */}
        <HeroSection />

        <Chatbot />
        <div className=" space-y-2 w-full flex items-center justify-center p-4">
          <div
            role="alert"
            className="bg-blue-100 dark:bg-green-900 my-30 border-l-4 border-green-500 dark:border-green-700 text-green-900 dark:text-blue-100 p-2 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-blue-200 dark:hover:bg-green-800 transform hover:scale-105"
          >
            <svg
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              className="h-10 w-10 flex-shrink-0 mr-2 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
            <p className=" text-4xl font-semibold">There are no properties</p>
          </div>
        </div>

        <MapViue />

        <Button />
      </>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      <Chatbot />

      {/* Property Cards */}
      <div className="flex flex-col items-center justify-center my-20">
        <div className="flex flex-wrap w-full justify-center items-center space-x-4 gap-3">
          <select
            onChange={(e) => setPriceFilter(Number(e.target.value))}
            className="border text-green-700 border-green-500 p-2 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <option value={0}>All Prices</option>
            <option value={100}>Under $100</option>
            <option value={150}>Under $150</option>
            <option value={200}>Under $200</option>
          </select>
          <select
            onChange={(e) => setRoomsFilter(Number(e.target.value))}
            className="border text-green-700 border-green-500 p-2 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <option value={0}>All Rooms</option>
            <option value={1}>1+ Room</option>
            <option value={2}>2+ Rooms</option>
            <option value={3}>3+ Rooms</option>
            <option value={4}>4+ Rooms</option>
            <option value={5}>5+ Rooms</option>
          </select>
          <div className="relative w-1/2 flex items-center">
            <input
              type="text"
              className="w-full px-4 text-green-700 placeholder:text-green-700 py-2 border rounded-lg border-green-500 focus:ring-2 focus:ring-green-400 transition-all duration-300 ease-in-out"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="my-10 flex-wrap flex items-center justify-center w-[100%]">
          {filteredProperties.map((property) => (
            <div key={property.id} className="p-4">
              <div className="rounded-lg overflow-hidden w-[370px] flex flex-col justify-between min-h-120 shadow-lg p-4 bg-white hover:shadow-2xl transition-all duration-300 ease-in-out">
                <img
                  className="w-full h-48 object-cover"
                  src={
                    property.images && property.images[0]
                      ? property.images[1]
                      : "https://via.placeholder.com/400"
                  }
                  alt={property.name || "Property Image"}
                />
                <div className="py-4">
                  <h2 className="font-bold text-xl text-gray-800">
                    {property.name}
                  </h2>
                  <p className="text-gray-600 text-base">
                    {property.short_description}
                  </p>
                  <p className="text-lg text-green-600">
                    {property.price} JD
                  </p>
                  <p className="text-yellow-500">{(4 + Math.random()).toFixed(1)} ★</p>
                  <p className="text-[#ff4d00]">
                    🔥 {property.seasonal_offers[0]}
                  </p>
                  <Link
                    to={`/properties/${property.id}`}
                    className="flex items-center space-x-2 logo-swing"
                  >
                    <button
                      className="hover:cursor-pointer bg-gradient-to-r  shadow-lg border mt-2 border-gray-50 text-center w-48 rounded-2xl h-14 relative  text-xl font-semibold group"
                      type="button"
                    >
                      <div className="bg-[#508D4E] rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 1024 1024"
                          height="25px"
                          width="25px"
                        >
                          <path
                            d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                            fill="#fff"
                          />
                          <path
                            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                            fill="#fff"
                          />
                        </svg>
                      </div>
                      <p className="translate-x-2">Details</p>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MapViue />

      <Button />
    </>
  );
}

export default Property;