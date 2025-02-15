import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

function PropertyCarousel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب الداتا
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

  // وضع ال id في لينك الصفحه عند الضغط على زر ال details
  const handlePropertyClick = (propertyId) => {
    // Update URL without page reload
    window.history.pushState({}, "", `/properties/${propertyId}`);
    // You can also use this if you want the page to reload:
    // window.location.href = `/property/${propertyId}`;
  };

  // loading
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );

  // error
  if (error)
    return <div className="text-red-500 text-center mt-5">Error: {error}</div>;

  // فلتر لجلب الداتا الغير محذوفه و يوجد عليها عروض موسمية
  const properties = data.filter(
    (property) =>
      !property.soft_delete &&
      property.seasonal_offers &&
      property.status === "approved"
  );

  if (properties.length === 0) {
    return (
      <div className="space-y-2 w-full flex items-center justify-center p-4">
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
    );
  }

  // للتحكم في السلايد
  const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} left-0 z-10 text-black text-3xl cursor-pointer`}
        style={{
          ...style,
          left: "20px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        onClick={onClick}
      >
        ◀
      </div>
    );
  };

  const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} right-0 z-10 text-black text-3xl cursor-pointer`}
        style={{
          ...style,
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        onClick={onClick}
      >
        ▶
      </div>
    );
  };

  // بيانات للسلايد
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center my-20 ">
        <div className="my-10 w-[80%] mx-5">
          <p className="text-4xl text-emerald-500 flex justify-center items-center">
            Seasonal Offers
          </p>
          <Slider {...settings}>
            {properties.map((property) => (
              <div key={property.id} className="p-4">
                <div className="rounded overflow-hidden shadow-lg p-4">
                  {/* <img
                    className="w-full h-48 object-cover"
                    src={property.images[1]}
                    alt={property.name}
                  /> */}
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
                    <h2 className="font-bold text-xl">{property.name}</h2>
                    <p className="text-gray-700 text-base">
                      {property.short_description}
                    </p>
                    <p className="text-lg text-green-600">{property.price} JD</p>
                    <p className="text-yellow-500">{(4 + Math.random()).toFixed(1)} ★</p>
                    <p className="text-[#ff4d00]">
                      🔥{property.seasonal_offers[0]}
                    </p>
                    <Link
                      to={`/properties/${property.id}`}
                      className="flex items-center space-x-2 logo-swing"
                    >
                      <button
                        onClick={() => handlePropertyClick(property.id)}
                        className="hover:cursor-pointer bg-white shadow-lg border mt-2 border-gray-50 text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
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
          </Slider>
        </div>
        <div className="flex justify-center">
          <Link
            to="/property"
            className="flex items-center space-x-2 logo-swing"
          >
            <button className="relative hover:cursor-pointer flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-green-500 rounded-md group">
              <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-green-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
              </span>
              <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-green-700 rounded group-hover:-ml-4 group-hover:-mb-4">
                <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
              </span>
              <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-green-600 rounded-md group-hover:translate-x-0" />
              <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                Get Started
              </span>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default PropertyCarousel;