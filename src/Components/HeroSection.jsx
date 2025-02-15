import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
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
      setActiveSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  return (
    <div data-aos="fade-left">
    <div className="relative w-full">
      <div className="relative h-[500px] overflow-hidden">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-500 ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="flex flex-col justify-center items-center absolute bottom-0 left-0 right-0 p-8 text-white bg-[#00000030]">
              <h5 className="text-2xl font-bold">{item.title}</h5>
              <p className="text-lg">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() =>
          setActiveSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1))
        }
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#eeeeee3b] text-white p-2 rounded-full"
      >
        ←
      </button>
      <button
        onClick={() =>
          setActiveSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1))
        }
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#eeeeee3b] text-white p-2 rounded-full"
      >
        →
      </button>
    </div>
    </div>
  );
};

export default HeroSection;