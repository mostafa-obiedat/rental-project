import PropertyCarousel from "../../Components/PropertySlider";
import {
  Search,
  Star,
  Tent,
  Camera,
  Map,
  CreditCard,
  Bell,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Chatbot from "../../Components/Chatbot";
import Button from "../../Components/backtotop";

function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  const [activeSlide, setActiveSlide] = useState(0);

  // معلومات لل Feature Card
  const features = [
    {
      icon: Search,
      title: "Advanced Search",
    },
    {
      icon: Star,
      title: "Featured Farms & Chalets",
    },
    {
      icon: Tent,
      title: "Property Categories",
    },
    {
      icon: Camera,
      title: "Virtual Tour",
    },
    {
      icon: Map,
      title: "Interactive Map View",
    },
    {
      icon: CreditCard,
      title: "Secure Booking ",
    },
    {
      icon: Star,
      title: "User Reviews & Ratings",
    },
    {
      icon: Bell,
      title: "Instant Notifications",
    },
  ];

  // ديزاين لل Feature Card
  const FeatureCard = ({ icon: Icon, title }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center gap-4 hover:shadow-lg transition-shadow">
      <div className="text-gray-600">
        <Icon size={24} />
      </div>
      <h3 className="text-sm text-gray-600 text-center">{title}</h3>
    </div>
  );

  const carouselItems = [
    {
      image:
        "https://img.freepik.com/premium-photo/swimming-pool-with-lounge-chairs-palm-trees_662214-344213.jpg?w=1380",
      title: "Find Your Perfect Getaway!",
      description:
        "Escape to the most beautiful farms & chalets for a relaxing and unforgettable stay.",
    },
    {
      image:
        "https://img.freepik.com/premium-photo/pool-house-are-designed-by-architect_1151108-39384.jpg?w=1380",
      title: "Escape to Serenity!",
      description:
        "Discover the best farms & chalets for a peaceful and unforgettable retreat.",
    },
    {
      image:
        "https://img.freepik.com/free-photo/swimming-pool_74190-7325.jpg?t=st=1739290973~exp=1739294573~hmac=ef10868121ff2fb1aa22644d055c57507d48bd8f62e3988eaad2e0deaa10a268&w=996",
      title: "Your Perfect Getaway Awaits!",
      description:
        "Browse stunning farms & chalets, book with ease, and enjoy a stress-free vacation.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) =>
        prev === carouselItems.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  return (
    <>
      <div className="w-full">
        {/* Hero Section */}
        <div className="relative w-full" data-aos="fade-down">
          <div className="relative h-[500px] overflow-hidden">
            {carouselItems.map((item, index) => (
              <div
                key={index}
                className={`absolute w-full h-full transition-opacity duration-500 ${
                  index === activeSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="flex flex-col justify-center items-center absolute bottom-0 left-0 right-0 p-8 text-white bg-[#00000030]">
                  <h5 className="text-2xl font-bold">{item.title}</h5>
                  <p className="text-lg">{item.description}</p>
                  <Link
                    to="/property"
                    className="flex items-center space-x-2 logo-swing"
                  >
                    <button className="bg-[#a4cfa7] px-6 py-3 hover:cursor-pointer text-white relative overflow-hidden z-30 group hover:bg-[#5dab79] transition-all duration-500 rounded mt-4 tracking-wider font-semibold">
                      Get Started
                      {/* SVG content remains the same */}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {/* Carousel controls remain the same */}
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mt-20 mx-auto p-6" data-aos="fade-up">
          <h2 className="text-4xl text-emerald-600 text-center mb-8">
            Unique Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} data-aos="zoom-in" data-aos-delay={index * 100}>
                <FeatureCard icon={feature.icon} title={feature.title} />
              </div>
            ))}
          </div>
        </div>

        {/* Property Carousel */}
        <div data-aos="fade-up">
          <PropertyCarousel />
        </div>

        {/* About Section */}
        <div className="max-w-7xl mx-auto p-6" data-aos="fade-right">
          <div className="flex flex-col md:flex-row gap-8 bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="md:w-1/2" data-aos="zoom-in">
              <img
                src="https://img.freepik.com/free-photo/beautiful-view-blue-lake-captured-from-inside-villa_181624-10734.jpg?ga=GA1.1.908539965.1736962294&semt=ais_hybrid"
                alt="Life Valley Project"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="md:w-1/2 p-6 flex flex-col justify-between"
              data-aos="fade-left"
            >
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  About Our Platform
                </h2>
                <div className="space-y-4">
                  {/* Text Content */}
                  <div className="md:w-2/2 p-6 flex flex-col justify-between">
                    <div>
                      <p className="text-gray-600">
                        Discover the perfect farm & chalet for your next
                        getaway! Our platform makes it easy to browse, book, and
                        enjoy unique vacation spots with just a few clicks.
                      </p>
                      <p className="text-gray-600">
                        ✅ Wide Selection – Explore a variety of farms & chalets
                        tailored to your needs.
                      </p>
                      <p className="text-gray-600">
                        ✅ Virtual Tours – Experience properties online before
                        booking.
                      </p>
                      <p className="text-gray-600">
                        ✅ Secure Payments – Book with confidence using our
                        trusted payment system.
                      </p>
                      <p className="text-gray-600">
                        ✅ User Reviews – Read honest feedback from previous
                        guests. booking.
                      </p>
                      <p className="text-gray-600">
                        -- Start your journey today and find your dream retreat!
                        --
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="max-w-7xl my-20 mx-auto p-6" data-aos="fade-left">
          <div className="flex flex-col md:flex-row-reverse gap-8 bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="md:w-1/2" data-aos="zoom-in">
              <img
                src="https://img.freepik.com/premium-photo/large-villa-with-large-pool-large-house-background_861622-800.jpg?ga=GA1.1.908539965.1736962294&semt=ais_hybrid"
                alt="Life Valley Project"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="md:w-1/2 p-6 flex flex-col justify-between"
              data-aos="fade-right"
            >
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Why Choose Us?
                </h2>
                <div className="space-y-4">
                  {/* Text Content */}
                  <div className="md:w-2/2 p-6 flex flex-col justify-between">
                    <div>
                      <p className="text-gray-600">
                        We make finding and booking the perfect farm or chalet
                        simple and hassle-free! Here’s why users love our
                        platform:
                      </p>
                      <p className="text-gray-600">
                        ✅ Easy & Fast Booking – Browse, select, and book in
                        just a few clicks. tailored to your needs.
                      </p>
                      <p className="text-gray-600">
                        ✅ Verified Properties – Only trusted farms & chalets
                        for a worry-free stay.
                      </p>
                      <p className="text-gray-600">
                        ✅ Flexible Filters – Find properties based on location,
                        price, and amenities.
                      </p>
                      <p className="text-gray-600">
                        ✅ 24/7 Support – Our team is always here to help with
                        any questions.
                      </p>
                      <p className="text-gray-600">
                        -- Your dream getaway is just one click away! --
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />

      <Button />
    </>
  );
}

export default Home;