import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Chatbot from "../../Components/Chatbot";
import Button from "../../Components/backtotop";

function About() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // مدة الأنيميشن بالمللي ثانية
      easing: "ease-in-out", // نوع الحركة
      once: true, // تشغيل الأنيميشن مرة واحدة فقط
    });
  }, []);

  return (
    <main>
      <section className="service-section flex justify-between items-center lg:h-[60vh] h-auto py-12 px-4 bg-[#e0f2e9]">
        <div className="container mx-auto">
          <div className="flex flex-col-reverse md:flex-row items-center mx-20">
            <div
              data-aos="fade-up"
              className="md:w-1/2 w-full text-center md:text-left"
            >
              <h2 className="text-3xl font-bold text-[#256d1b] mb-4">
                Discover Your Perfect Getaway
              </h2>
              <p className="text-gray-700 md:text-2xl">
                Our platform allows you to explore and book stunning chalets for
                your next vacation. Whether you're looking for a peaceful
                retreat or an adventure-filled getaway, we provide a seamless
                booking experience with detailed listings and easy reservations.
              </p>
            </div>
            <div
              data-aos="zoom-in"
              className="md:w-1/2 w-full flex justify-center mb-6 md:mt-6"
            >
              <img
                src="https://img.freepik.com/free-photo/beautiful-view-blue-sea-water-near-shore_23-2148022406.jpg?ga=GA1.1.908539965.1736962294&semt=ais_authors_boost"
                alt="Chalet View"
                className="rounded-lg max-w-lg md:max-w-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 flex justify-center mt-20 items-center">
        <div className="container flex justify-center items-center px-5">
          <div className="lg:mx-[100px] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                data-aos="zoom-in"
                src="https://img.freepik.com/free-photo/photorealistic-wooden-house-with-timber-structure_23-2151302632.jpg?ga=GA1.1.908539965.1736962294&semt=ais_authors_boost"
                alt="Our Vision"
                className="rounded-lg w-[400px] h-[300px] object-cover"
              />
            </div>
            <div data-aos="fade-up">
              <h2 className="text-4xl font-bold text-[#256d1b] mb-4">
                Who We Are
              </h2>
              <p className="font-medium text-2xl leading-relaxed">
                We are dedicated to helping property owners showcase their
                beautiful chalets to guests looking for unique and comfortable
                stays. Our goal is to connect hosts and travelers effortlessly,
                ensuring a memorable experience for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 my-20">
        <div>
          <h2
            data-aos="fade-left"
            className="text-center text-4xl font-bold text-[#256d1b] mb-10"
          >
            Our Team
          </h2>
          <div className="flex justify-center gap-10 flex-col items-center flex-wrap">
            <div className="w-full gap-5 flex justify-evenly items-center flex-wrap">
              <div data-aos="flip-right" className=" text-center">
                <img
                  src="https://i.pinimg.com/474x/08/98/75/0898758a12f00a6390903194cd7588e6.jpg"
                  alt="Team Member"
                  className="w-40 h-40 rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold text-lg text-[#256d1b]">
                  Raghad kamal
                </h3>
                <p className="text-gray-600">quality assurance</p>
              </div>
              <div data-aos="flip-right" className=" text-center">
                <img
                  src="https://i.pinimg.com/474x/08/98/75/0898758a12f00a6390903194cd7588e6.jpg"
                  alt="Team Member"
                  className="w-40 h-40 rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold text-lg text-[#256d1b]">
                  Jenan Faraj
                </h3>
                <p className="text-gray-600">Developer</p>
              </div>
              <div data-aos="flip-right" className=" text-center">
                <img
                  src="https://i.pinimg.com/474x/bd/42/8e/bd428e6bb156d90045700dbf3e967c3e.jpg"
                  alt="Team Member"
                  className="w-40 h-40 rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold text-lg text-[#256d1b]">
                  Mustafa Obiedat
                </h3>
                <p className="text-gray-600">Developer</p>
              </div>
              <div data-aos="flip-right" className=" text-center">
                <img
                  src="https://i.pinimg.com/474x/bd/42/8e/bd428e6bb156d90045700dbf3e967c3e.jpg"
                  alt="Team Member"
                  className="w-40 h-40 rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold text-lg text-[#256d1b]">Ala' Sa'di</h3>
                <p className="text-gray-600">scrum master</p>
              </div>
              <div data-aos="flip-right" className=" text-center">
                <img
                  src="https://i.pinimg.com/474x/bd/42/8e/bd428e6bb156d90045700dbf3e967c3e.jpg"
                  alt="Team Member"
                  className="w-40 h-40 rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold text-lg text-[#256d1b]">
                  faisal jadallah
                </h3>
                <p className="text-gray-600">product owner</p>
              </div>
              <div data-aos="flip-right" className=" text-center">
                <img
                  src="https://i.pinimg.com/474x/bd/42/8e/bd428e6bb156d90045700dbf3e967c3e.jpg"
                  alt="Team Member"
                  className="w-40 h-40 rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold text-lg text-[#256d1b]">
                  Ahmad Tarawneh
                </h3>
                <p className="text-gray-600">Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        data-aos="fade-left"
        className="py-12 px-4 bg-[#d4edda] text-center"
      >
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-[#256d1b] mb-4">
            We're Here to Help!
          </h2>
          <p className="text-gray-700 mb-6">
            Have a question or need assistance? Our team is always available to
            help. Feel free to reach out anytime, and we'll make sure to provide
            you with the support you need.
          </p>
          <Link
            to="/contact"
            className="bg-[#256d1b] text-white px-6 py-3 rounded-lg shadow-md text-lg font-semibold hover:bg-[#1e5a16] transition-all"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />

      <Button />
    </main>
  );
}

export default About;