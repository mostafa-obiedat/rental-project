import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateField, setLoading, setError } from '../../Redux/creditCardSlice';
import axios from 'axios';
import Swal from 'sweetalert2';

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
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Booking submitted successfully!',
      });
  
    } catch (error) {
      console.error('Error submitting data:', error);
      dispatch(setError('Failed to submit booking. Please try again.'));
      dispatch(setLoading(false));
  
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to submit booking. Please try again.',
      });
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 m-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-800">Credit Card Details</h2>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Read-only Fields Section */}
          <div className="bg-green-50 p-6 rounded-lg space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Farm Name</label>
              <input
                type="text"
                name="farmName"
                value={formData.farmName}
                readOnly
                className="w-full px-4 py-3 border border-green-200 rounded-lg bg-white text-gray-700"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Booking Date</label>
              <input
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                readOnly
                className="w-full px-4 py-3 border border-green-200 rounded-lg bg-white text-gray-700"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Booking Time</label>
              <input
                type="time"
                name="bookingTime"
                value={formData.bookingTime}
                readOnly
                className="w-full px-4 py-3 border border-green-200 rounded-lg bg-white text-gray-700"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Total Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                readOnly
                className="w-full px-4 py-3 border border-green-200 rounded-lg bg-white text-gray-700 font-semibold"
              />
            </div>
          </div>
  
          {/* Credit Card Fields Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Card Holder Name</label>
              <input
                type="text"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
              />
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>
          </div>
  
          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition duration-200 mt-8 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            disabled={formData.loading}
          >
            {formData.loading ? 'Processing Payment...' : 'Submit Payment'}
          </button>
  
          {formData.error && (
            <p className="text-red-500 text-center mt-4 bg-red-50 p-3 rounded-lg">
              {formData.error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
  };
export default CreditCard;