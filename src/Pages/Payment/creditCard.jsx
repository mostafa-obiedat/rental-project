import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateField, setLoading, setError } from '../../Redux/creditCardSlice';
import axios from 'axios';

const CreditCard = () => {
  const formData = useSelector((state) => state.creditCard);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        dispatch(setLoading(true));
        
        const response = await axios.get('https://rent-app-d50fb-default-rtdb.firebaseio.com/bookings.json');
  
        if (!response.data) {
          dispatch(setError('No bookings found.'));
          dispatch(setLoading(false));
          return;
        }
  
        // جلب آخر حجز بناءً على مفاتيح الكائن (أحدث مفتاح)
        const bookingKeys = Object.keys(response.data);
        const latestBookingKey = bookingKeys[bookingKeys.length - 1];
        const latestBooking = response.data[latestBookingKey];
  
        console.log("Latest Booking Data:", latestBooking);
  
        if (latestBooking) {
          dispatch(updateField({ name: 'farmName', value: latestBooking.farmDetails?.name || '' }));
          dispatch(updateField({ name: 'bookingDate', value: latestBooking.bookingDate || '' }));
          dispatch(updateField({ name: 'bookingTime', value: latestBooking.bookingTime || '' }));
          dispatch(updateField({ name: 'price', value: latestBooking.farmDetails?.price || '' }));
        }
  
        dispatch(setLoading(false));
      } catch (error) {
        console.error('Error fetching booking data:', error);
        dispatch(setError('Failed to fetch booking data.'));
        dispatch(setLoading(false));
      }
    };
  
    fetchBookingData();
  }, [dispatch]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    }

    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    }

    if (name === 'cvv') {
      formattedValue = value.slice(0, 4).replace(/\D/g, '');
    }

    dispatch(updateField({ name, value: formattedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await axios.post(
        'https://rent-app-d50fb-default-rtdb.firebaseio.com/payment.json',
        formData
      );

      console.log('Data submitted successfully:', response.data);
      dispatch(setLoading(false));
      alert('Booking submitted successfully!');
    } catch (error) {
      console.error('Error submitting data:', error);
      dispatch(setError('Failed to submit booking. Please try again.'));
      dispatch(setLoading(false));
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center" 
      style={{ backgroundImage: `url('https://i.pinimg.com/736x/fa/68/ed/fa68ed11e00b3935324dd9cb472b2803.jpg')` }}
    >
      <div className="w-full max-w-md bg-white/60 shadow-lg rounded-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Credit Card Details</h2>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* اسم المزرعة المحجوزة (غير قابل للتعديل) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Farm Name</label>
            <input
              type="text"
              name="farmName"
              value={formData.farmName}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
            />
          </div>

          {/* يوم الحجز (غير قابل للتعديل) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Booking Date</label>
            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
            />
          </div>

          {/* ساعة الحجز (غير قابل للتعديل) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Booking Time</label>
            <input
              type="time"
              name="bookingTime"
              value={formData.bookingTime}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
            />
          </div>

          {/* السعر */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* تفاصيل البطاقة الائتمانية */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Card Holder Name</label>
            <input
              type="text"
              name="cardHolder"
              value={formData.cardHolder}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">CVV</label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            disabled={formData.loading}
          >
            {formData.loading ? 'Submitting...' : 'Submit Payment'}
          </button>

          {formData.error && (
            <p className="text-red-500 text-center">{formData.error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreditCard;