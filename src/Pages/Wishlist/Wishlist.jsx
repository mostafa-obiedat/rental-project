// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { setLoading, setWishlist, removeFarmFromWishlist } from '../../Redux/wishlistSlice';
// import axios from 'axios';
// import { Link } from 'react-router-dom';  // استيراد Link من react-router-dom

// const WishlistPage = () => {
//   const dispatch = useDispatch();
//   const { wishlist, loading } = useSelector((state) => state.wishlist);

//   // حالة لتخزين روابط الصور
//   const [imageUrls, setImageUrls] = useState({});

//   // جلب المفضلة من Firebase
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       dispatch(setLoading(true));  // بدء التحميل
//       try {
//         const response = await axios.get(`https://rent-app-d50fb-default-rtdb.firebaseio.com/wishlist/${id}.json`);
//         const data = response.data ? Object.entries(response.data).map(([key, value]) => ({ id: key, ...value })) : [];
//         dispatch(setWishlist(data));  // تحديث المفضلة

//         // جلب رابط أول صورة من المزرعة
//         const images = {};
//         for (const farm of data) {
//           if (farm.images && farm.images.length > 0) {
//             images[farm.id] = farm.images[0];  // أول صورة من المزرعة
//           }
//         }
//         setImageUrls(images); // حفظ روابط الصور
//       } catch (error) {
//         console.error('Error fetching wishlist:', error);
//       } finally {
//         dispatch(setLoading(false));  // إيقاف التحميل بعد الانتهاء
//       }
//     };

//     fetchWishlist();
//   }, [dispatch]);

//   // إزالة مزرعة من المفضلة
//   const handleRemoveFromWishlist = (id) => {
//     axios.delete(`https://rent-app-d50fb-default-rtdb.firebaseio.com/wishlist/${id}.json`)
//       .then(() => {
//         dispatch(removeFarmFromWishlist(id));  // إزالة المزرعة من المفضلة
//       })
//       .catch((error) => {
//         console.error('Error removing farm from wishlist:', error);
//       });
//   };

//   return (
//     <div className="container mx-auto px-20 p-4">
//       <h1 className="text-4xl font-semibold text-center mb-4">Whishlist</h1>

//       {loading ? (
//         <p className="text-center text-lg"> Reloading...</p>
//       ) : wishlist.length === 0 ? (
//         <p className="text-center text-lg">There are no farms in the favorites list. Add some farms to return to.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {wishlist.map((farm) => (
//             <div key={farm.id} className="border rounded-lg p-4 shadow-md">
//               <h2 className="text-xl font-semibold">
//                 <Link to={`/properties/${farm.id}`}>{farm.name}</Link> {/* تعديل الرابط هنا */}
//               </h2>
//               {imageUrls[farm.id] && (
//                 <img src={imageUrls[farm.id]} alt={farm.name} className="w-full h-auto mt-2" />
//               )}
//               <p>{farm.description}</p>
//               <button
//                 className="mt-2 bg-red-500 text-white py-1 px-4 rounded"
//                 onClick={() => handleRemoveFromWishlist(farm.id)}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default WishlistPage;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchWishlist,
  removeFromWishlist,
  addToWishlist,
} from "../../Redux/wishlistSlice";
import { Link } from "react-router-dom";

const WishlistPage = ({ hideTitle }) => {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.wishlist);
  const [imageUrls, setImageUrls] = useState({});

  // 🔹 جلب بيانات المفضلة عند تحميل الصفحة
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  // 🔹 تحديث الصور بعد جلب المفضلة
  useEffect(() => {
    const images = {};
    wishlist.forEach((farm) => {
      if (farm.image) {
        images[farm.id] = farm.image;
      }
    });
    setImageUrls(images);
  }, [wishlist]);

  // 🔹 إضافة مزرعة إلى المفضلة
  const handleAddToWishlist = (farm) => {
    dispatch(addToWishlist(farm));
  };

  // 🔹 إزالة مزرعة من المفضلة
  const handleRemoveFromWishlist = (id) => {
    dispatch(removeFromWishlist(id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!hideTitle && ( // 🔹 إظهار العنوان فقط إذا لم يتم إخفاؤه
          <div className="text-center mb-12">
            <h1 className="text-2xl font-bold text-[#358853] flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Your Wishlist
            </h1>
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-lg text-gray-600">Loading your favorites...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-xl text-gray-600 mb-4">
                Your favorites list is empty
              </p>
              <Link
                to="/property"
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((farm) => (
              <div
                key={farm.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {imageUrls[farm.id] && (
                  <img
                    src={imageUrls[farm.id]}
                    alt={farm.name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform"
                  />
                )}
                <div className="p-6">
                  <Link
                    to={`/properties/${farm.id}`}
                    className="block hover:text-green-600"
                  >
                    <h2 className="text-2xl font-semibold">{farm.name}</h2>
                  </Link>
                  <p className="text-gray-600 mb-4">
                    {farm.shortDescription || "No description available."}
                  </p>
                  <div className="mb-6 space-y-2 text-gray-700">
                    <p>
                      <strong>Rooms:</strong> {farm.rooms || "N/A"}
                    </p>
                    <p>
                      <strong>Price:</strong> {farm.price || "N/A"} JD
                    </p>
                    <p>
                      <strong>Location:</strong> {farm.location || "Unknown"}
                    </p>
                    {farm.offers && (
                      <p>
                        <strong>Offers:</strong> {farm.offers}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/properties/${farm.id}`}
                      className="text-green-600 hover:text-green-700"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(farm.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
