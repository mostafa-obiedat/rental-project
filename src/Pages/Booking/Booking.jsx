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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `
                       url('https://i.pinimg.com/736x/fa/68/ed/fa68ed11e00b3935324dd9cb472b2803.jpg')`,
      }}
    >
      ِ
      <div className="bg-white/60 backdrop-blur-md p-8 my-5 rounded-lg shadow-lg w-full max-w-[90vh]">
        <h1 className="text-2xl font-bold text-center mb-6">BOOK NOW!</h1>
        <form onSubmit={handleSubmit}>
          {" "}
          {/* قم بتغليف المدخلات بـ <form> */}
          {/* Farm Section */}
          {farmData && (
            <div className="w-1/2 pr-8">
              {" "}
              {/* قسم معلومات المزرعة */}
              <h2 className="text-xl font-semibold mb-4">Farm Details</h2>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={farmData.name}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={farmData.short_description}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={farmData.location}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="text"
                    value={`${farmData.price} JOD`}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
          {/* Name Section */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
            <label className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <div className="mt-1 grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                readOnly
                placeholder="First Name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                readOnly
                placeholder="Last Name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Email Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              E-mail *
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                readOnly
                placeholder="myname@example.com"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Phone Number Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <div className="mt-1 grid grid-cols-2 gap-4">
              <input
                type="text"
                name="phoneAreaCode"
                placeholder="Area Code"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Address Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Address *
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                placeholder="Street Address"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <input
                type="text"
                name="streetAddressLine2"
                value={formData.streetAddressLine2}
                onChange={handleChange}
                placeholder="Street Address Line 2"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* City, State, Postal Code, Country Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <div className="mt-1">
              <input
                type="text"
                placeholder="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Booking Date & Time Section */}
          <div className="mb-4 max-w-120">
            <label className="block text-sm font-medium text-gray-700">
              {" "}
              Booking Date & Time *
            </label>
            <div className="mt-1 grid grid-cols-2 gap-4">
              <label className="block text-sm font-medium text-gray-700">
                Date:
              </label>
              {/* startday*/}
              <input
                type="date"
                name="bookingDate"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split("T")[0]}
                value={formData.bookingData}
                onChange={handleChange}
              />

              {/* عرض السعر*/}

              {formData.startDate && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="price"
                      value={
                        new Date(formData.startDate).getDay() === 5 ||
                        new Date(formData.startDate).getDay() === 6
                          ? "180 JOD (Weekend)"
                          : "150 JOD (Weekday)"
                      }
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                    />
                  </div>
                </div>
              )}

              {/* Time*/}

              <label className="block text-sm font-medium text-gray-700">
                Time:
              </label>
              <input
                type="time"
                name="bookingTime"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {/* Number of People Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Number of people
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="numberOfPeople"
                value={formData.numberOfPeople}
                onChange={handleChange}
                min="1" // الحد الأدنى للقيمة هو 1
                required
                placeholder="Number of people"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Terms and Conditions Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Terms and Conditions
            </label>
            <div className="mt-1">
              <textarea
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                defaultValue={`By booking, you agree to the following terms and conditions:
1. All bookings are subject to availability.
2. Cancellations must be made at least 48 hours in advance for a full refund.
3. The farm is not responsible for any personal injury or loss of property.
4. Any photographs taken during the visit may be used for promotional purposes by the farm.`}
              />
            </div>
          </div>
          {/* Agreement Checkboxes */}
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="agreeTerms"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
              <label className="ml-2 block text-sm text-gray-700">
                I agree to the terms and conditions
              </label>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="agreeTerms"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
              <label className="ml-2 block text-sm text-gray-700">
                I agree to the use of my photographs for promotional purposes
              </label>
            </div>
          </div>
          {/* Signature Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Signature
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="signature"
                placeholder="Sign here"
                value={formData.signature}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>
          </div>
          {/* حقل الحالة (اختياري) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Status of Booking
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="status"
                value="pending"
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              />
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#6a9d6f] text-white py-2 px-4 rounded-md hover:bg-[#6a896d] focus:outline-none focus:ring-2 focus:ring-green-500"
            onSubmit={handleSubmit}
          >
            Book
          </button>
        </form>{" "}
        {/* إغلاق الـ form هنا */}
      </div>
    </div>
  );
};

export default BookingForm;
