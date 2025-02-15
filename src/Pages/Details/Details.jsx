// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { useSelector, useDispatch } from "react-redux";
// import { addToWishlist, removeFromWishlist } from "../../Redux/wishlistSlice";
// import { FaStar } from "react-icons/fa";
// const PropertyDetails = () => {
//   const { id } = useParams();
//   const [property, setProperty] = useState(null);
//   const [mainImage, setMainImage] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [time, setTime] = useState("12:00");
//   const [people, setPeople] = useState(1);
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(0);
//   const [hover, setHover] = useState(null);
//   const [reviewText, setReviewText] = useState("");
//   const [username, setUsername] = useState("");

//   const wishlist = useSelector((state) => state.wishlist.wishlist);
//   const dispatch = useDispatch();

//   const isInWishlist = wishlist.some((item) => item.id === id);

//   const handleToggleWishlist = () => {
//     if (isInWishlist) {
//       dispatch(removeFromWishlist(id));
//     } else {
//       dispatch(
//         addToWishlist({
//           id,
//           name: property.name,
//           image: property.images ? property.images[0] : "",
//           ...property,
//         })
//       );
//     }
//   };

// useEffect(() => {
//   const fetchProperty = async () => {
//     try {
//       const response = await axios.get(
//         `https://rent-app-d50fb-default-rtdb.firebaseio.com/properties/${id}.json`
//       );
//       if (response.data) {
//         setProperty(response.data);
//         setMainImage(response.data.images ? response.data.images[0] : "");
//       } else {
//         setProperty(null);
//       }
//     } catch (error) {
//       console.error("Error fetching property details:", error);
//     }
//   };

//   const fetchReviews = async () => {
//     try {
//       const response = await axios.get(
//         `https://rent-app-d50fb-default-rtdb.firebaseio.com/reviews/${id}.json`
//       );
//       setReviews(response.data ? Object.values(response.data) : []);
//     } catch (error) {
//       console.error("Error fetching reviews:", error);
//     }
//   };

//   fetchProperty();
//   fetchReviews();
// }, [id]);
// // عند الضغط على (booking) اخذ ال ID
// const handlePropertyClick = (propertyId) => {
//   // Update URL without page reload
//   window.history.pushState({}, "", `/properties/${propertyId}`);
// };

// if (!property) {
//   return (
//     <p className="text-center text-red-500 font-bold text-lg">
//       ❌ Property not found
//     </p>
//   );
// }

//   const today = new Date().toISOString().split("T")[0];

//   const handleAddReview = async () => {
//     const newReview = {
//       username,
//       text: reviewText,
//       rating,
//     };
//     try {
//       await axios.post(
//         `https://rent-app-d50fb-default-rtdb.firebaseio.com/reviews/${id}.json`,
//         newReview
//       );
//       setReviews((prevReviews) => [...prevReviews, newReview]);
//       setUsername("");
//       setReviewText("");
//       setRating(0);
//     } catch (error) {
//       console.error("Error adding review:", error);
//     }
//   };

//   return (
//     <div className="container mx-auto px-20 p-4 flex flex-col gap-6">
//       <div className="flex flex-col lg:flex-row gap-6">
//         <div className="lg:w-2/3">
//           <h2 className="text-4xl font-semibold">{property.name}</h2>
//           <h3 className="text-xl font-semibold">📍 {property.location}</h3>
//           {mainImage && (
//             <img
//               src={mainImage}
//               alt="Main property"
//               className="w-full h-72 object-cover rounded-lg shadow-lg"
//             />
//           )}
//           {property.images && property.images.length > 1 && (
//             <div className="flex mt-2 space-x-2">
//               {property.images.map((image, index) => (
//                 <img
//                   key={index}
//                   src={image}
//                   alt={`property-${index}`}
//                   className="w-24 h-24 rounded-lg object-cover shadow cursor-pointer"
//                   onClick={() => setMainImage(image)}
//                 />
//               ))}
//             </div>
//           )}
//           <p className="text-gray-700 mt-8">{property.long_description}</p>
//           <p className="mt-4">
//             <strong>Price:</strong> {property.price_12_hours} per 12 hours
//           </p>
//         </div>
//         <div className="lg:w-1/3 bg-gray-100 p-4 h-100 rounded-lg">
//           <h2 className="text-xl font-semibold">User Reviews</h2>
//           {reviews.length === 0 ? (
//             <p>No reviews yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {reviews.map((review, index) => (
//                 <div
//                   key={index}
//                   className="p-4 bg-white border rounded-lg shadow-md"
//                 >
//                   <h3 className="font-semibold">{review.username}</h3>
//                   <p>{review.text}</p>
//                   <div className="flex text-yellow-500">
//                     {[...Array(5)].map((_, i) => (
//                       <FaStar
//                         key={i}
//                         className={
//                           i < review.rating
//                             ? "text-yellow-500"
//                             : "text-gray-300"
//                         }
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//       {/* خريطة الموقع */}
//       {/* <h2 className="text-xl font-semibold mt-6">📍 Farm Location</h2> */}
//       <div className="mt-6 flex space-x-4 w-1/3">
//         <button
//           onClick={() => handlePropertyClick(property.id)}
//           className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
//         >
//           Book Now 📅
//         </button>
//         <button
//           className={`flex-1 ${
//             isInWishlist ? "bg-red-500" : "bg-green-500"
//           } text-white py-2 rounded hover:${
//             isInWishlist ? "bg-red-600" : "bg-green-600"
//           }`}
//           onClick={handleToggleWishlist}
//         >
//           {isInWishlist ? "Remove from Favorites ❌" : "Add to Favorites ❤️"}
//         </button>
//       </div>
//       <div className="mt-6  space-x-4 w-1/3">
//         <h2 className="text-xl font-semibold mb-4">Add Your Review</h2>
//         <input
//           type="text"
//           className="w-full p-2 mb-2 border rounded"
//           placeholder="Your Name"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <textarea
//           className="w-full p-2 mb-2 border rounded"
//           placeholder="Write your review here"
//           value={reviewText}
//           onChange={(e) => setReviewText(e.target.value)}
//         />
//         <div className="flex mb-2">
//           {[...Array(5)].map((_, index) => {
//             const currentRating = index + 1;
//             return (
//               <FaStar
//                 key={index}
//                 className={
//                   currentRating <= (hover || rating)
//                     ? "text-yellow-500"
//                     : "text-gray-300"
//                 }
//                 onClick={() => setRating(currentRating)}
//                 onMouseEnter={() => setHover(currentRating)}
//                 onMouseLeave={() => setHover(null)}
//                 size={30}
//               />
//             );
//           })}
//         </div>
//         <button
//           className="w-full bg-green-500 text-white py-2 rounded"
//           onClick={handleAddReview}
//         >
//           Submit Review
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PropertyDetails;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../Redux/wishlistSlice";
import { FaStar } from "react-icons/fa";
import { FaVideo } from "react-icons/fa"; // إضافة أيقونة الفيديو

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [username, setUsername] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // حالة لفتح أو غلق النافذة المنبثقة

  const { user } = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const dispatch = useDispatch();

  const isInWishlist = wishlist.some(
    (item) => item.id === id && item.userId === user?.uid
  );

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(
          `https://rent-app-d50fb-default-rtdb.firebaseio.com/properties/${id}.json`
        );
        if (response.data) {
          setProperty(response.data);
          setMainImage(response.data.images ? response.data.images[0] : "");
          setVideoUrl(response.data.video360 || ""); // جلب رابط الفيديو 360°
        } else {
          setProperty(null);
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://rent-app-d50fb-default-rtdb.firebaseio.com/reviews/${id}.json`
        );
        setReviews(response.data ? Object.values(response.data) : []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchProperty();
    fetchReviews();
  }, [id]);

  const handlePropertyClick = (propertyId) => {
    window.history.pushState({}, "", `/booking/${propertyId}`);
  };

  const handleToggleWishlist = () => {
    if (!user) {
      navigate("/Register");
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist({ id, userId: user.uid }));
    } else {
      dispatch(
        addToWishlist({
          id,
          name: property.name,
          image: property.images ? property.images[0] : "",
          userId: user.uid,
          ...property,
        })
      );
    }
  };

  const handleBookNow = () => {
    if (!user) {
      navigate("/Register");
      return;
    }

    if (!id) {
      // تحقق من وجود الـ id في الرابط
      console.error("Property ID is missing!");
      return;
    }

    navigate(`/booking/${id}`);
  };

  const handleAddReview = async () => {
    if (!user) {
      navigate("/Register");
      return;
    }

    // const hasBooked = await checkIfUserBookedProperty(user.uid, id);
    // if (!hasBooked) {
    //   alert("يجب عليك حجز المزرعة أولاً قبل التقييم.");
    //   return;
    // }

    const newReview = {
      username,
      text: reviewText,
      rating,
      userId: user.uid,
    };
    try {
      await axios.post(
        `https://rent-app-d50fb-default-rtdb.firebaseio.com/reviews/${id}.json`,
        newReview
      );
      setReviews((prevReviews) => [...prevReviews, newReview]);
      setUsername("");
      setReviewText("");
      setRating(0);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  // فتح النافذة المنبثقة
  const openModal = () => {
    setIsModalOpen(true);
  };

  // غلق النافذة المنبثقة
  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-red-500 font-bold text-xl bg-red-50 px-6 py-4 rounded-lg shadow">
          ❌ Property not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              {mainImage && (
                <img
                  src={mainImage}
                  alt="Main property"
                  className="w-full h-[500px] object-cover transform transition-transform duration-300 hover:scale-105"
                />
              )}
            </div>

            {/* Image Gallery */}
            {property.images && property.images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`property-${index}`}
                    className={`h-24 w-full object-cover rounded-lg cursor-pointer transition-all duration-200 
                      ${
                        mainImage === image
                          ? "ring-4 ring-green-500"
                          : "hover:ring-2 ring-green-300"
                      }`}
                    onClick={() => setMainImage(image)}
                  />
                ))}
              </div>
            )}
            {/* إضافة أيقونة الفيديو */}
            {videoUrl && (
              <div className="mt-4">
                <button
                  onClick={openModal}
                  className="flex items-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  <FaVideo size={20} />
                  <span className="text-sm">Watch Video</span>
                </button>
              </div>
            )}
            {/* Property Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {property.name}
              </h1>
              <div className="flex items-center text-gray-600">
                <span className="text-2xl mr-2">📍</span>
                <span className="text-xl">{property.location}</span>
              </div>
            </div>
            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">
                About this property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {property.long_description}
              </p>
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <p className="text-xl font-semibold text-blue-900">
                  Price: <span className="text-blue-600">{property.price}</span>{" "}
                  JD per 12 hours
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <button
                onClick={handleBookNow}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold 
                 hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {user ? "Book Now 📅" : "Register now to book with us"}
              </button>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg
                  ${
                    isInWishlist
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                      : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
                  }`}
                onClick={handleToggleWishlist}
              >
                {user
                  ? isInWishlist
                    ? "Remove from Favorites"
                    : "Add to Favorites ❤️"
                  : "Sign-In to save farm"}
              </button>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-4">
                    No reviews yet
                  </p>
                ) : (
                  reviews.map((review, index) => (
                    <div key={index} className="border-b last:border-0 pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg">
                          {review.username}
                        </h3>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add Review Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Write a Review</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 
                    transition-all duration-200"
                  placeholder="Your Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <textarea
                  className="w-full p-3 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-green-500 
                    focus:border-green-500 transition-all duration-200"
                  placeholder="Write your review here"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, index) => {
                    const currentRating = index + 1;
                    return (
                      <FaStar
                        key={index}
                        className={`w-8 h-8 cursor-pointer transition-colors duration-200 
                          ${
                            currentRating <= (hover || rating)
                              ? "text-yellow-400"
                              : "text-gray-200"
                          }`}
                        onClick={() => setRating(currentRating)}
                        onMouseEnter={() => setHover(currentRating)}
                        onMouseLeave={() => setHover(null)}
                        size={30}
                      />
                    );
                  })}
                </div>
                <button
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 
                    rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all 
                    duration-200 shadow-md hover:shadow-lg"
                  onClick={handleAddReview}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* نافذة الفيديو */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg max-w-3xl w-full">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white font-bold text-xl"
            >
              X
            </button>
            <iframe
              src={videoUrl}
              title="Property 360 Video"
              className="w-full h-80"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
