// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { database } from "../../firebaseConfig";
// import { ref, onValue, set, push, remove, update } from "firebase/database";
// import {
//   setProperties,
//   addProperty,
//   updateProperty,
//   deleteProperty,
// } from "../../Redux/propertySlice";
// import { setBookings, addBooking } from "../../Redux/bookingsSlice";
// import { setAnalytics } from "../../Redux/analyticsSlice";

// import {
//   Building,
//   Home,
//   MapPin,
//   DollarSign,
//   Edit2,
//   Trash2,
//   Plus,
//   User,
//   Mail,
//   Phone,
//   Calendar,
//   Clock,
//   Users,
//   FileText,
//   TrendingUp,
//   Percent,
//   CheckCircle,
//   XCircle,
//   House,
// } from "lucide-react";

// const Landlords = () => {
//   const dispatch = useDispatch();
//   const properties = useSelector((state) => state.properties);
//   const bookings = useSelector((state) => state.bookings);
//   const analytics = useSelector((state) => state.analytics);

//   // Stats State
//   const [stats, setStats] = useState({
//     totalProperties: 0,
//     occupancyRate: 0,
//     totalBookings: 0,
//     averagePrice: 0,
//   });

//   // Property Form State
//   const [newProperty, setNewProperty] = useState({
//     name: "",
//     location: "",
//     google_maps_link: { lng: 0, lat: 0 },
//     short_description: "",
//     video360: "",
//     long_description: "",
//     rooms: 0,
//     price: 0,
//     images: [],
//     soft_delete: false,
//     offers: "",
//     seasonal_offers: [],
//     available: true,
//   });

//   const [editingProperty, setEditingProperty] = useState(null);

//   // Booking Form State
//   const [newBooking, setNewBooking] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: "",
//     city: "",
//     streetAddress: "",
//     streetAddressLine2: "",
//     numberOfPeople: "",
//     bookingDate: "",
//     bookingTime: "",
//     signature: "",
//     agreeTerms: false,
//     propertyId: "",
//     status: "pending", // Added status field
//   });

//   // Calculate statistics whenever properties or bookings change
//   useEffect(() => {
//     const availableProperties = properties.filter((p) => p.available).length;
//     const avgPrice =
//       properties.reduce((acc, curr) => acc + curr.price, 0) /
//         properties.length || 0;

//     setStats({
//       totalProperties: properties.length,
//       occupancyRate:
//         ((properties.length - availableProperties) / properties.length) * 100 ||
//         0,
//       totalBookings: bookings.length,
//       averagePrice: avgPrice,
//     });
//   }, [properties, bookings]);

//   // Firebase Listeners
//   useEffect(() => {
//     const propertiesRef = ref(database, "properties");
//     const unsubscribeProperties = onValue(propertiesRef, (snapshot) => {
//       const propertiesData = [];
//       snapshot.forEach((childSnapshot) => {
//         propertiesData.push({
//           id: childSnapshot.key,
//           ...childSnapshot.val(),
//         });
//       });
//       dispatch(setProperties(propertiesData));
//     });

//     const bookingsRef = ref(database, "bookings");
//     const unsubscribeBookings = onValue(bookingsRef, (snapshot) => {
//       const bookingsData = [];
//       snapshot.forEach((childSnapshot) => {
//         bookingsData.push({
//           id: childSnapshot.key,
//           ...childSnapshot.val(),
//         });
//       });
//       dispatch(setBookings(bookingsData));
//     });

//     return () => {
//       unsubscribeProperties();
//       unsubscribeBookings();
//     };
//   }, [dispatch]);

//   // Property Handlers
//   const handleAddProperty = async () => {
//     const propertiesRef = ref(database, "properties");
//     const newPropertyRef = push(propertiesRef);
//     await set(newPropertyRef, newProperty);
//     dispatch(addProperty({ id: newPropertyRef.key, ...newProperty }));
//     resetPropertyForm();
//   };

//   const handleUpdateProperty = async () => {
//     if (!editingProperty) return;
//     const propertyRef = ref(database, `properties/${editingProperty.id}`);
//     await update(propertyRef, newProperty);
//     dispatch(updateProperty({ id: editingProperty.id, ...newProperty }));
//     setEditingProperty(null);
//     resetPropertyForm();
//   };

//   const handleDeleteProperty = async (id) => {
//     const propertyRef = ref(database, `properties/${id}`);
//     await remove(propertyRef);
//     dispatch(deleteProperty(id));
//   };

//   const handleEditProperty = (property) => {
//     setEditingProperty(property);
//     setNewProperty(property);
//   };

//   // Booking Handlers
//   const handleAddBooking = async () => {
//     const bookingsRef = ref(database, "bookings");
//     const newBookingRef = push(bookingsRef);
//     await set(newBookingRef, newBooking);
//     dispatch(addBooking({ id: newBookingRef.key, ...newBooking }));
//     resetBookingForm();
//   };

//   const handleUpdateBookingStatus = async (bookingId, status) => {
//     const bookingRef = ref(database, `bookings/${bookingId}`);
//     await update(bookingRef, { status });
//   };

//   // Reset Forms
//   const resetPropertyForm = () => {
//     setNewProperty({
//       name: "",
//       location: "",
//       google_maps_link: { lng: 0, lat: 0 },
//       short_description: "",
//       long_description: "",
//       video360: "",
//       rooms: 0,
//       price: 0,
//       images: [],
//       soft_delete: false,
//       offers: "",
//       seasonal_offers: [],
//       available: true,
//     });
//   };

//   const resetBookingForm = () => {
//     setNewBooking({
//       firstName: "",
//       lastName: "",
//       email: "",
//       phoneNumber: "",
//       city: "",
//       streetAddress: "",
//       streetAddressLine2: "",
//       numberOfPeople: "",
//       bookingDate: "",
//       bookingTime: "",
//       signature: "",
//       agreeTerms: false,
//       propertyId: "",
//       status: "pending",
//     });
//   };

//   // Function to convert file to base64
//   const toBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Property Management Dashboard
//           </h1>
//           <p className="mt-2 text-gray-600">
//             Manage your properties and bookings in one place
//           </p>
//         </div>

//         {/* Statistics Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">
//                   Total Properties
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">
//                   {stats.totalProperties}
//                 </p>
//               </div>
//               <div className="bg-blue-50 p-3 rounded-lg">
//                 <Building className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">
//                   Occupancy Rate
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">
//                   {stats.occupancyRate.toFixed(1)}%
//                 </p>
//               </div>
//               <div className="bg-green-50 p-3 rounded-lg">
//                 <Percent className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">
//                   Total Bookings
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">
//                   {stats.totalBookings}
//                 </p>
//               </div>
//               <div className="bg-purple-50 p-3 rounded-lg">
//                 <Calendar className="w-6 h-6 text-purple-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">
//                   Average Price
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">
//                   ${stats.averagePrice.toFixed(2)}
//                 </p>
//               </div>
//               <div className="bg-amber-50 p-3 rounded-lg">
//                 <TrendingUp className="w-6 h-6 text-amber-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Property Form */}
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//             <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
//               {editingProperty ? (
//                 <>
//                   <Edit2 className="w-5 h-5 text-blue-600" />
//                   Edit Property
//                 </>
//               ) : (
//                 <>
//                   <Plus className="w-5 h-5 text-blue-600" />
//                   Add New Property
//                 </>
//               )}
//             </h2>

//             <div className="space-y-4">
//               {/* Name and Location */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Home className="h-5 w-5 text-gray-400" />
//                   </span>
//                   <input
//                     type="text"
//                     value={newProperty.name}
//                     onChange={(e) =>
//                       setNewProperty({ ...newProperty, name: e.target.value })
//                     }
//                     placeholder="Property Name"
//                     className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <MapPin className="h-5 w-5 text-gray-400" />
//                   </span>
//                   <input
//                     type="text"
//                     value={newProperty.location}
//                     onChange={(e) =>
//                       setNewProperty({
//                         ...newProperty,
//                         location: e.target.value,
//                       })
//                     }
//                     placeholder="Location"
//                     className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               {/* Google Maps Coordinates */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <MapPin className="h-5 w-5 text-gray-400" />
//                   </span>
//                   <input
//                     type="number"
//                     value={newProperty.google_maps_link.lng}
//                     onChange={(e) =>
//                       setNewProperty({
//                         ...newProperty,
//                         google_maps_link: {
//                           ...newProperty.google_maps_link,
//                           lng: parseFloat(e.target.value),
//                         },
//                       })
//                     }
//                     placeholder="Longitude"
//                     className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <MapPin className="h-5 w-5 text-gray-400" />
//                   </span>
//                   <input
//                     type="number"
//                     value={newProperty.google_maps_link.lat}
//                     onChange={(e) =>
//                       setNewProperty({
//                         ...newProperty,
//                         google_maps_link: {
//                           ...newProperty.google_maps_link,
//                           lat: parseFloat(e.target.value),
//                         },
//                       })
//                     }
//                     placeholder="Latitude"
//                     className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               {/* Descriptions */}
//               <textarea
//                 value={newProperty.short_description}
//                 onChange={(e) =>
//                   setNewProperty({
//                     ...newProperty,
//                     short_description: e.target.value,
//                   })
//                 }
//                 placeholder="Short Description"
//                 className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
//                 rows="3"
//               />

//               <textarea
//                 value={newProperty.long_description}
//                 onChange={(e) =>
//                   setNewProperty({
//                     ...newProperty,
//                     long_description: e.target.value,
//                   })
//                 }
//                 placeholder="Long Description"
//                 className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
//                 rows="3"
//               />

//               {/* Price and Rooms */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <DollarSign className="h-5 w-5 text-gray-400" />
//                   </span>
//                   <input
//                     type="number"
//                     value={newProperty.price}
//                     onChange={(e) =>
//                       setNewProperty({
//                         ...newProperty,
//                         price: Number(e.target.value),
//                       })
//                     }
//                     placeholder="Price"
//                     className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <House className="h-5 w-5 text-gray-400" />
//                   </span>
//                   <input
//                     type="number"
//                     value={newProperty.rooms}
//                     onChange={(e) =>
//                       setNewProperty({
//                         ...newProperty,
//                         rooms: Number(e.target.value),
//                       })
//                     }
//                     placeholder="Number of Rooms"
//                     className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               {/* Offers */}
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={newProperty.offers}
//                   onChange={(e) =>
//                     setNewProperty({ ...newProperty, offers: e.target.value })
//                   }
//                   placeholder="Offers"
//                   className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
//                 />
//               </div>

//               {/* Seasonal Offers */}
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={newProperty.seasonal_offers.join(", ")}
//                   onChange={(e) =>
//                     setNewProperty({
//                       ...newProperty,
//                       seasonal_offers: e.target.value
//                         .split(",")
//                         .map((o) => o.trim()),
//                     })
//                   }
//                   placeholder="Seasonal Offers (comma-separated)"
//                   className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
//                 />
//               </div>

//               {/* Image Upload */}
//               <div className="relative">
//                 <input
//                   type="file"
//                   multiple
//                   onChange={async (e) => {
//                     const files = Array.from(e.target.files);
//                     const base64Images = await Promise.all(
//                       files.map(async (file) => {
//                         return await toBase64(file);
//                       })
//                     );
//                     setNewProperty({
//                       ...newProperty,
//                       images: base64Images,
//                     });
//                   }}
//                   className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
//                 />
//               </div>
//                {/* video360 */}
//               <input
//               type="text"
//                 value={newProperty.video360}
//                 onChange={(e) =>
//                   setNewProperty({
//                     ...newProperty,
//                     video360: e.target.value,
//                   })
//                 }
//                 placeholder="add your Video URL"
//                 className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
//                 rows="3"
//               />

//               {/* Availability */}
//               <div className="relative">
//                 <select
//                   value={newProperty.available}
//                   onChange={(e) =>
//                     setNewProperty({
//                       ...newProperty,
//                       available: e.target.value === "true",
//                     })
//                   }
//                   className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
//                 >
//                   <option value="true">Available</option>
//                   <option value="false">Unavailable</option>
//                 </select>
//               </div>

//               {/* Submit Button */}
//               <div className="flex items-center justify-end gap-4">
//                 {editingProperty && (
//                   <button
//                     onClick={() => {
//                       setEditingProperty(null);
//                       resetPropertyForm();
//                     }}
//                     className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                   >
//                     Cancel
//                   </button>
//                 )}
//                 <button
//                   onClick={
//                     editingProperty ? handleUpdateProperty : handleAddProperty
//                   }
//                   className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
//                 >
//                   {editingProperty ? (
//                     <Edit2 className="w-4 h-4" />
//                   ) : (
//                     <Plus className="w-4 h-4" />
//                   )}
//                   {editingProperty ? "Update Property" : "Add Property"}
//                 </button>
//               </div>
//             </div>
//           </div>
//           {/* Property List */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//             <div className="p-6 border-b border-gray-100">
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                 <Building className="w-5 h-5 text-blue-600" />
//                 Properties List
//               </h2>
//             </div>

//             <div className="divide-y divide-gray-100">
//               {properties.map((property) => (
//                 <div
//                   key={property.id}
//                   className="p-6 hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <h3 className="text-lg font-medium text-gray-900">
//                         {property.name}
//                       </h3>
//                       <div className="mt-1 flex items-center gap-4">
//                         <span className="flex items-center text-sm text-gray-500">
//                           <MapPin className="w-4 h-4 mr-1" />
//                           {property.location}
//                         </span>
//                         <span className="flex items-center text-sm text-gray-500">
//                           <DollarSign className="w-4 h-4 mr-1" />
//                           {property.price}
//                         </span>
//                         <span className="flex items-center text-sm text-gray-500">
//                           <House className="w-4 h-4 mr-1" />
//                           {property.rooms} rooms
//                         </span>
//                       </div>
//                       <p className="mt-2 text-sm text-gray-600">
//                         {property.short_description}
//                       </p>
//                       <div className="mt-3">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             property.available
//                               ? "bg-green-100 text-green-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {property.available ? "Available" : "Not Available"}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 ml-4">
//                       <button
//                         onClick={() => handleEditProperty(property)}
//                         className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
//                       >
//                         <Edit2 className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteProperty(property.id)}
//                         className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {properties.length === 0 && (
//                 <div className="p-6 text-center text-gray-500">
//                   No properties found. Add your first property above.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Bookings Section */}
//         <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
//           <div className="p-6 border-b border-gray-100">
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//               <Calendar className="w-5 h-5 text-blue-600" />
//               Recent Bookings
//             </h2>
//           </div>

//           <div className="divide-y divide-gray-100">
//             {bookings.map((booking) => (
//               <div key={booking.id} className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-start gap-4">
//                     <div className="bg-gray-100 p-3 rounded-full">
//                       <User className="w-6 h-6 text-gray-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-medium text-gray-900">
//                         {booking.firstName} {booking.lastName}
//                       </h3>
//                       <div className="mt-1 space-y-1">
//                         <p className="text-sm text-gray-500 flex items-center">
//                           <Mail className="w-4 h-4 mr-2" />
//                           {booking.email}
//                         </p>
//                         <p className="text-sm text-gray-500 flex items-center">
//                           <Phone className="w-4 h-4 mr-2" />
//                           {booking.phoneNumber}
//                         </p>
//                         <p className="text-sm text-gray-500 flex items-center">
//                           <Calendar className="w-4 h-4 mr-2" />
//                           {booking.bookingDate} at {booking.bookingTime}
//                         </p>
//                         <p className="text-sm text-gray-500 flex items-center">
//                           <Users className="w-4 h-4 mr-2" />
//                           {booking.numberOfPeople} people
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() =>
//                         handleUpdateBookingStatus(booking.id, "approved")
//                       }
//                       className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center gap-2"
//                     >
//                       <CheckCircle className="w-4 h-4" />
//                       Approve
//                     </button>
//                     <button
//                       onClick={() =>
//                         handleUpdateBookingStatus(booking.id, "declined")
//                       }
//                       className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-2"
//                     >
//                       <XCircle className="w-4 h-4" />
//                       Decline
//                     </button>
//                   </div>
//                 </div>
//                 {booking.status && (
//                   <div className="mt-4">
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         booking.status === "approved"
//                           ? "bg-green-100 text-green-800"
//                           : booking.status === "declined"
//                           ? "bg-red-100 text-red-800"
//                           : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {booking.status.charAt(0).toUpperCase() +
//                         booking.status.slice(1)}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             ))}
//             {bookings.length === 0 && (
//               <div className="p-6 text-center text-gray-500">
//                 No bookings found.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Landlords;



import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { database } from "../../firebaseConfig";
import { ref, onValue, set, push, remove, update } from "firebase/database";
import {
  setProperties,
  addProperty,
  updateProperty,
  deleteProperty,
} from "../../Redux/propertySlice";
import { setBookings, addBooking } from "../../Redux/bookingsSlice";
import { setAnalytics } from "../../Redux/analyticsSlice";

import {
  Building,
  Home,
  MapPin,
  DollarSign,
  Edit2,
  Trash2,
  Plus,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Users,
  FileText,
  TrendingUp,
  Percent,
  CheckCircle,
  XCircle,
  House,
  Trash,
} from "lucide-react";

const Landlords = () => {
  const dispatch = useDispatch();
  const properties = useSelector((state) => state.properties);
  const bookings = useSelector((state) => state.bookings);
  const analytics = useSelector((state) => state.analytics);

  // Stats State
  const [stats, setStats] = useState({
    totalProperties: 0,
    occupancyRate: 0,
    totalBookings: 0,
    averagePrice: 0,
  });

  // Property Form State
  const [newProperty, setNewProperty] = useState({
    name: "",
    location: "",
    google_maps_link: { lng: 0, lat: 0 },
    short_description: "",
    video360:"",
    long_description: "",
    rooms: 0,
    price: 0,
    images: [],
    soft_delete: false,
    offers: "",
    seasonal_offers: [],
    available: true,
    status: "pending",
  });

  const [editingProperty, setEditingProperty] = useState(null);

  // Booking Form State
  const [newBooking, setNewBooking] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
    streetAddress: "",
    streetAddressLine2: "",
    numberOfPeople: "",
    bookingDate: "",
    bookingTime: "",
    signature: "",
    agreeTerms: false,
    propertyId: "",
    status: "pending", // Added status field
  });

  // Calculate statistics whenever properties or bookings change
  useEffect(() => {
    const availableProperties = properties.filter((p) => p.available).length;
    const avgPrice =
      properties.reduce((acc, curr) => acc + curr.price, 0) /
        properties.length || 0;

    setStats({
      totalProperties: properties.length,
      occupancyRate:
        ((properties.length - availableProperties) / properties.length) * 100 ||
        0,
      totalBookings: bookings.length,
      averagePrice: avgPrice,
    });
  }, [properties, bookings]);

  // Firebase Listeners
  useEffect(() => {
    const propertiesRef = ref(database, "properties");
    const unsubscribeProperties = onValue(propertiesRef, (snapshot) => {
      const propertiesData = [];
      snapshot.forEach((childSnapshot) => {
        propertiesData.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      dispatch(setProperties(propertiesData));
    });
const handleDeleteBooking = (id) => {
  setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));
};
    const bookingsRef = ref(database, "bookings");
    const unsubscribeBookings = onValue(bookingsRef, (snapshot) => {
      const bookingsData = [];
      snapshot.forEach((childSnapshot) => {
        bookingsData.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      dispatch(setBookings(bookingsData));
    });

    return () => {
      unsubscribeProperties();
      unsubscribeBookings();
    };
  }, [dispatch]);

  // Property Handlers
  const handleAddProperty = async () => {
    const propertiesRef = ref(database, "properties");
    const newPropertyRef = push(propertiesRef);
    await set(newPropertyRef, newProperty);
    dispatch(addProperty({ id: newPropertyRef.key, ...newProperty }));
    resetPropertyForm();
  };

  const handleUpdateProperty = async () => {
    if (!editingProperty) return;
    const propertyRef = ref(database, `properties/${editingProperty.id}`);
    await update(propertyRef, newProperty);
    dispatch(updateProperty({ id: editingProperty.id, ...newProperty }));
    setEditingProperty(null);
    resetPropertyForm();
  };

  const handleDeleteProperty = async (id) => {
    const propertyRef = ref(database, `properties/${id}`);
    await remove(propertyRef);
    dispatch(deleteProperty(id));
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setNewProperty(property);
  };

  // Booking Handlers
  const handleAddBooking = async () => {
    const bookingsRef = ref(database, "bookings");
    const newBookingRef = push(bookingsRef);
    await set(newBookingRef, newBooking);
    dispatch(addBooking({ id: newBookingRef.key, ...newBooking }));
    resetBookingForm();
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    const bookingRef = ref(database, `bookings/${bookingId}`);
    await update(bookingRef, { status });
  };

  // Reset Forms
  const resetPropertyForm = () => {
    setNewProperty({
      name: "",
      location: "",
      google_maps_link: { lng: 0, lat: 0 },
      short_description: "",
      long_description: "",
      video360:"",
      rooms: 0,
      price: 0,
      images: [],
      soft_delete: false,
      offers: "",
      seasonal_offers: [],
      available: true,
    });
  };

  const resetBookingForm = () => {
    setNewBooking({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      city: "",
      streetAddress: "",
      streetAddressLine2: "",
      numberOfPeople: "",
      bookingDate: "",
      bookingTime: "",
      signature: "",
      agreeTerms: false,
      propertyId: "",
      status: "pending",
    });
  };
  // Function to convert file to base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Property Management Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your properties and bookings in one place
          </p>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Properties
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.totalProperties}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Occupancy Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.occupancyRate.toFixed(1)}%
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Percent className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.totalBookings}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Price
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${stats.averagePrice.toFixed(2)}
                </p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              {editingProperty ? (
                <>
                  <Edit2 className="w-5 h-5 text-blue-600" />
                  Edit Property
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-blue-600" />
                  Add New Property
                </>
              )}
            </h2>

            <div className="space-y-4">
              {/* Name and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={newProperty.name}
                    onChange={(e) =>
                      setNewProperty({ ...newProperty, name: e.target.value })
                    }
                    placeholder="Property Name"
                    className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={newProperty.location}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        location: e.target.value,
                      })
                    }
                    placeholder="Location"
                    className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Google Maps Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="number"
                    value={newProperty.google_maps_link.lng}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        google_maps_link: {
                          ...newProperty.google_maps_link,
                          lng: parseFloat(e.target.value),
                        },
                      })
                    }
                    placeholder="Longitude"
                    className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="number"
                    value={newProperty.google_maps_link.lat}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        google_maps_link: {
                          ...newProperty.google_maps_link,
                          lat: parseFloat(e.target.value),
                        },
                      })
                    }
                    placeholder="Latitude"
                    className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <textarea
                value={newProperty.short_description}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    short_description: e.target.value,
                  })
                }
                placeholder="Short Description"
                className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
                rows="3"
              />

              <textarea
                value={newProperty.long_description}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    long_description: e.target.value,
                  })
                }
                placeholder="Long Description"
                className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
                rows="3"
              />

              {/* Price and Rooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="number"
                    value={newProperty.price}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        price: Number(e.target.value),
                      })
                    }
                    placeholder="Price"
                    className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <House className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="number"
                    value={newProperty.rooms}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        rooms: Number(e.target.value),
                      })
                    }
                    placeholder="Number of Rooms"
                    className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Offers */}
              <div className="relative">
                <input
                  type="text"
                  value={newProperty.offers}
                  onChange={(e) =>
                    setNewProperty({ ...newProperty, offers: e.target.value })
                  }
                  placeholder="Offers"
                  className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
                />
              </div>

              {/* Seasonal Offers */}
              <div className="relative">
                <input
                  type="text"
                  value={newProperty.seasonal_offers.join(", ")}
                  onChange={(e) =>
                    setNewProperty({
                      ...newProperty,
                      seasonal_offers: e.target.value
                        .split(",")
                        .map((o) => o.trim()),
                    })
                  }
                  placeholder="Seasonal Offers (comma-separated)"
                  className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
                />
              </div>

             {/* Image Upload */}
               <div className="relative">
               <input
                  type="file"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    const base64Images = await Promise.all(
                      files.map(async (file) => {
                        return await toBase64(file);
                      })
                    );
                    setNewProperty({
                      ...newProperty,
                      images: base64Images,
                    });
                  }}
                  className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
                />
              </div>
               {/* video360 */}
              <input
              type="text"
                value={newProperty.video360}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    video360: e.target.value,
                  })
                }
                placeholder="add your Video URL"
                className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
                rows="3"
              />


              {/* Availability */}
              <div className="relative">
                <select
                  value={newProperty.available}
                  onChange={(e) =>
                    setNewProperty({
                      ...newProperty,
                      available: e.target.value === "true",
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-4">
                {editingProperty && (
                  <button
                    onClick={() => {
                      setEditingProperty(null);
                      resetPropertyForm();
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={
                    editingProperty ? handleUpdateProperty : handleAddProperty
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                >
                  {editingProperty ? (
                    <Edit2 className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {editingProperty ? "Update Property" : "Add Property"}
                </button>
              </div>
            </div>
          </div>
          {/* Property List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Properties List
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {property.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-4">
                        <span className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          {property.location}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {property.price}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <House className="w-4 h-4 mr-1" />
                          {property.rooms} rooms
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {property.short_description}
                      </p>
                      <div className="mt-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            property.available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {property.available ? "Available" : "Not Available"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditProperty(property)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {properties.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No properties found. Add your first property above.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bookings Section */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
  <div className="p-6 border-b border-gray-100">
    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
      <Calendar className="w-5 h-5 text-blue-600" />
      Recent Bookings
    </h2>
  </div>

  <div className="divide-y divide-gray-100">
    {bookings.map((booking) => (
      <div key={booking.id} className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 p-3 rounded-full">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {booking.firstName} {booking.lastName}
              </h3>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {booking.email}
                </p>
                <p className="text-sm text-gray-500 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {booking.phoneNumber}
                </p>
                <p className="text-sm text-gray-500 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {booking.bookingDate} at {booking.bookingTime}
                </p>
                <p className="text-sm text-gray-500 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {booking.numberOfPeople} people
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdateBookingStatus(booking.id, "approved")}
              className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => handleUpdateBookingStatus(booking.id, "declined")}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Decline
            </button>
            <button
              onClick={() => handleDeleteBooking(booking.id)}
              className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 flex items-center gap-2"
            >
              <Trash className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
        {booking.status && (
          <div className="mt-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                booking.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : booking.status === "declined"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {booking.status.charAt(0).toUpperCase() +
                booking.status.slice(1)}
            </span>
          </div>
        )}
      </div>
    ))}
    {bookings.length === 0 && (
      <div className="p-6 text-center text-gray-500">
        No bookings found.
      </div>
    )}
  </div>
</div>
      </div>
    </div>
  );
};

export default Landlords;