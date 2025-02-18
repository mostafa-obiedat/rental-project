import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../../Redux/bookingSlice";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const BookingForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form);
  const userData = useSelector((state) => state.auth.user); // جلب بيانات المستخدم من authSlice
  const [farmData, setFarmData] = useState(null);
  const navigate = useNavigate();

  // تعبئة الحقول تلقائيًا من بيانات المستخدم في authSlice
  useEffect(() => {
    if (userData) {
      if (userData.firstname) {
        dispatch(
          updateField({ field: "firstName", value: userData.firstname })
        );
      }
      if (userData.lastname) {
        dispatch(updateField({ field: "lastName", value: userData.lastname }));
      }
      if (userData.email) {
        dispatch(updateField({ field: "email", value: userData.email }));
      }
      if (userData.phoneNumber) {
        dispatch(
          updateField({ field: "phoneNumber", value: userData.phoneNumber })
        );
      }
    }
  }, [userData, dispatch]);

  // جلب بيانات المزرعة بناءً على الـ id
  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        const response = await axios.get(
          `https://rent-app-d50fb-default-rtdb.firebaseio.com/properties/${id}.json`
        );
        setFarmData(response.data);
      } catch (error) {
        console.error("Error fetching farm data:", error);
      }
    };

    fetchFarmData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // التأكد من أن القيمة لا تقل عن 1 لحقل numberOfPeople
    if (name === "numberOfPeople") {
      newValue = Math.max(1, value); // التأكد من أن القيمة لا تقل عن 1
    }

    dispatch(updateField({ field: name, value: newValue }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    const startDate = new Date(formData.startDate);
    const dayOfWeek = startDate.getDay(); // 0 = الأحد, 1 = الاثنين, ..., 6 = السبت
    const price = dayOfWeek === 5 || dayOfWeek === 6 ? 180 : 150; // الجمعة = 5, السبت = 6

    if (formData.bookinDate < today) {
      Swal.fire({
        title: "Error!",
        text: "You cannot book a date before today.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#6a9d6f",
      });
      return; // إيقاف الإرسال إذا كان التاريخ غير صحيح
    }

    // جلب التواريخ المحجوزة من Firebase
    try {
      const response = await axios.get(
        "https://rent-app-d50fb-default-rtdb.firebaseio.com/bookings.json"
      );
      const bookings = response.data;

      // التحقق من التواريخ المحجوزة
      const isDateBooked = Object.values(bookings).some(
        (booking) => booking.bookingDate === formData.bookingDate
      );

      if (isDateBooked) {
        Swal.fire({
          title: "Error!",
          text: "This date is already booked. Please choose another date.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#6a9d6f",
        });
        return; // إيقاف الإرسال إذا كان التاريخ محجوزًا
      }

      const Status = {
        PENDING: "pending",
        APPROVED: "approved",
        DECLINED: "declined",
      };

      // استخدم البيانات الحالية بدلًا من تعريف كائن جديد فارغ
      const bookingData = {
        ...formData,
        today: today,
        status: Status.PENDING,
        price: price,
        name: farmData.name,
        farmDetails: {
          // بيانات المزرعة
          name: farmData.name,
          description: farmData.short_description,
          location: farmData.location,
          price: farmData.price,
        },
      };

      // إرسال البيانات إلى Firebase باستخدام axios
      await axios.post(
        "https://rent-app-d50fb-default-rtdb.firebaseio.com/bookings.json",
        bookingData
      );
      Swal.fire({
        title: "Success!",
        text:
          "Your rental request has been sent successfully! The owner will review it and approve on the website. You will be notified once they respond. Keep an eye on your email.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#6a9d6f",
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an error submitting your booking. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-white p-8 my-8 rounded-xl shadow-lg w-full max-w-3xl border border-green-100">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-800">BOOK NOW!</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {farmData && (
            <div className="bg-green-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4 text-green-800">Farm Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Name</label>
                  <input
                    type="text"
                    value={farmData.name}
                    readOnly
                    className="w-full p-3 bg-white border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                  <input
                    type="text"
                    value={farmData.short_description}
                    readOnly
                    className="w-full p-3 bg-white border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Location</label>
                  <input
                    type="text"
                    value={farmData.location}
                    readOnly
                    className="w-full p-3 bg-white border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Price</label>
                  <input
                    type="text"
                    value={`${farmData.price} JOD`}
                    readOnly
                    className="w-full p-3 bg-white border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
  
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-green-800">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    readOnly
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    readOnly
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">E-mail *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                readOnly
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="phoneAreaCode"
                  placeholder="Area Code"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
  
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-600">Address *</label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                placeholder="Street Address"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="text"
                name="streetAddressLine2"
                value={formData.streetAddressLine2}
                onChange={handleChange}
                placeholder="Street Address Line 2"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
  
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-green-800">Booking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Date *</label>
                  <input
                    type="date"
                    name="bookingDate"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.bookingData}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Time *</label>
                  <input
                    type="time"
                    name="bookingTime"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Number of people *</label>
              <input
                type="number"
                name="numberOfPeople"
                value={formData.numberOfPeople}
                onChange={handleChange}
                min="1"
                required
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Terms and Conditions</label>
              <textarea
                readOnly
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                rows="4"
                defaultValue={`By booking, you agree to the following terms and conditions:
  1. All bookings are subject to availability.
  2. Cancellations must be made at least 48 hours in advance for a full refund.
  3. The farm is not responsible for any personal injury or loss of property.
  4. Any photographs taken during the visit may be used for promotional purposes by the farm.`}
              />
            </div>
  
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  required
                  checked={formData.agreeTerms}
                  onChange={(e) =>
                    dispatch(
                      updateField({
                        field: "agreeTerms",
                        value: e.target.checked,
                      })
                    )
                  }
                />
                <label className="text-sm text-gray-600">I agree to the terms and conditions</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  required
                  checked={formData.agreeTerms}
                  onChange={(e) =>
                    dispatch(
                      updateField({
                        field: "agreeTerms",
                        value: e.target.checked,
                      })
                    )
                  }
                />
                <label className="text-sm text-gray-600">I agree to the use of my photographs for promotional purposes</label>
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Signature *</label>
              <input
                type="text"
                name="signature"
                placeholder="Sign here"
                value={formData.signature}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Status of Booking</label>
              <input
                type="text"
                name="status"
                value="pending"
                readOnly
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50"
              />
            </div>
          </div>
  
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            onSubmit={handleSubmit}
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
  };

export default BookingForm;