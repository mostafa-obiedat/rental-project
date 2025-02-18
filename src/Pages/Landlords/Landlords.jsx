import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import emailjs from 'emailjs-com';
import { database } from "../../firebaseConfig";
import { ref, onValue, set, push, remove, update } from "firebase/database";
import {
  setProperties,
  addProperty,
  updateProperty,
  deleteProperty,
} from "../../Redux/propertySlice";
import { setBookings, addBooking } from "../../Redux/bookingsSlice";

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
    video360: "",
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
        // to push it in the end of the array
        propertiesData.push({
          // i take the key and put it as id
          id: childSnapshot.key,
          // the rest of the data is the value
          ...childSnapshot.val(),
        });
      });
      // after getting the data from firebase i dispatch it to the store
      dispatch(setProperties(propertiesData));
    });

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
  
    if (status === "approved") {
      const booking = bookings.find((b) => b.id === bookingId);
      if (booking) {
        const templateParams = {
          fullName: `${booking.firstName} ${booking.lastName}`,
          email: booking.email,
          pitchName: booking.farmDetails.name, // يمكنك تعديل هذا ليكون اسم العقار إذا كان متاحًا
          date: booking.bookingDate,
          time: booking.bookingTime,
          price: booking.price, // إذا كان السعر متاحًا في بيانات الحجز
          reply_to: booking.email,
        };
  
        emailjs
          .send(
            'service_xgi6ko9', // استبدل بمعرف الخدمة الخاص بك
            'template_iirw548', // استبدل بمعرف القالب الخاص بك
            templateParams,
            'FGrYPggp2pBaiMe9F' // استبدل بمفتاح المستخدم الخاص بك
          )
          .then(
            (response) => {
              console.log('Email sent successfully:', response.status, response.text);
            },
            (error) => {
              console.error('Failed to send email:', error);
            }
          );
      }
    }
  };

  // Reset Forms
  const resetPropertyForm = () => {
    setNewProperty({
      name: "",
      location: "",
      google_maps_link: { lng: 0, lat: 0 },
      short_description: "",
      long_description: "",
      video360: "",
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
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Property Management Dashboard
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Manage your properties and bookings in one place
          </p>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Properties
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {stats.totalProperties}
                </p>
              </div>
              <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                <Building className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {stats.totalBookings}
                </p>
              </div>
              <div className="bg-purple-50 p-2 sm:p-3 rounded-lg">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Average Price
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">
                  ${stats.averagePrice.toFixed(2)}
                </p>
              </div>
              <div className="bg-amber-50 p-2 sm:p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Property Form */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 h-[calc(155vh-200px)] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sticky top-0 bg-white pt-2 pb-4 z-10">
              {editingProperty ? (
                <>
                  <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Edit Property
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Add New Property
                </>
              )}
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {/* Name and Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={newProperty.name}
                    onChange={(e) =>
                      setNewProperty({ ...newProperty, name: e.target.value })
                    }
                    placeholder="Property Name"
                    className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
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
                    className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Google Maps Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
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
                    className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
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
                    className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-2 sm:p-3 text-sm sm:text-base"
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
                className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-2 sm:p-3 text-sm sm:text-base"
                rows="3"
              />

              {/* Price and Rooms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
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
                    className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <House className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
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
                    className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                  className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-2 sm:p-3 text-sm sm:text-base"
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
                  className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-2 sm:p-3 text-sm sm:text-base"
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
                  className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-2 sm:p-3 text-sm sm:text-base"
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
                className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-2 sm:p-3 text-sm sm:text-base"
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
                  className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-2 sm:p-3 text-sm sm:text-base"
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                {editingProperty && (
                  <button
                    onClick={() => {
                      setEditingProperty(null);
                      resetPropertyForm();
                    }}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={
                    editingProperty ? handleUpdateProperty : handleAddProperty
                  }
                  className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 text-sm sm:text-base"
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
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Properties List
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-0">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900">
                        {property.name}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-4">
                        <span className="flex items-center text-xs sm:text-sm text-gray-500">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {property.location}
                        </span>
                        <span className="flex items-center text-xs sm:text-sm text-gray-500">
                          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {property.price}
                        </span>
                        <span className="flex items-center text-xs sm:text-sm text-gray-500">
                          <House className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {property.rooms} rooms
                        </span>
                      </div>
                      <p className="mt-2 text-xs sm:text-sm text-gray-600">
                        {property.short_description}
                      </p>
                      <div className="mt-3">
                        <span
                          className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            property.available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {property.available ? "Available" : "Not Available"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleEditProperty(property)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {properties.length === 0 && (
                <div className="p-4 sm:p-6 text-center text-sm sm:text-base text-gray-500">
                  No properties found. Add your first property above.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="mt-4 sm:mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              Recent Bookings
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-gray-100 p-2 sm:p-3 rounded-full">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-medium text-gray-900">
                        {booking.firstName} {booking.lastName}
                      </h3>
                      <div className="mt-1 space-y-1">
                        <p className="text-xs sm:text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          {booking.email}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          {booking.phoneNumber}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          {booking.bookingDate} at {booking.bookingTime}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 flex items-center">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          {booking.numberOfPeople} people
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateBookingStatus(booking.id, "approved")
                      }
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateBookingStatus(booking.id, "declined")
                      }
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      Decline
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(booking.id)}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <Trash className="w-3 h-3 sm:w-4 sm:h-4" />
                      Delete
                    </button>
                  </div>
                </div>
                {booking.status && (
                  <div className="mt-3 sm:mt-4">
                    <span
                      className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
              <div className="p-4 sm:p-6 text-center text-sm sm:text-base text-gray-500">
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