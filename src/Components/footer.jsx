import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="w-full bg-[#358853] text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-8 py-10 max-sm:max-w-sm max-sm:mx-auto gap-y-8">
                    {/* Logo Section */}
                    <div className="col-span-full mb-10 lg:col-span-2 lg:mb-0">
                        <Link to="/" className="flex justify-center lg:justify-start">
                            <h1 className="text-3xl font-bold logo-hover">Rivana</h1>
                        </Link>
                        <p className="py-8 text-sm text-gray-300 lg:max-w-xs text-center lg:text-left">
                            Experience luxury in nature. Your perfect mountain getaway awaits at Rivana Chalets.
                        </p>
                        <Link to="/property" className="py-2.5 px-5 h-9 block w-fit bg-[#D6EFD8] text-[#1A5319] rounded-full shadow-sm text-xs mx-auto transition-all duration-500 hover:bg-white lg:mx-0 font-medium">
                            Book Now
                        </Link>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:mx-auto text-left">
                        <h4 className="text-lg font-medium mb-7">Explore</h4>
                        <ul className="text-sm transition-all duration-500">
                            <li className="mb-6"><Link to="/" className="text-[#D6EFD8] hover:text-white transition-colors">Home</Link></li>
                            <li className="mb-6"><Link to="/property" className="text-[#D6EFD8] hover:text-white transition-colors">Our Chalets</Link></li>
                            <li className="mb-6"><Link to="/amenities" className="text-[#D6EFD8] hover:text-white transition-colors">Amenities</Link></li>
                            <li><Link to="/location" className="text-[#D6EFD8] hover:text-white transition-colors">Location</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="lg:mx-auto text-left">
                        <h4 className="text-lg font-medium mb-7">Services</h4>
                        <ul className="text-sm transition-all duration-500">
                            <li className="mb-6"><Link to="/booking" className="text-[#D6EFD8] hover:text-white transition-colors">Booking</Link></li>
                            <li className="mb-6"><Link to="/activities" className="text-[#D6EFD8] hover:text-white transition-colors">Activities</Link></li>
                            <li className="mb-6"><Link to="/dining" className="text-[#D6EFD8] hover:text-white transition-colors">Dining</Link></li>
                            <li><Link to="/spa" className="text-[#D6EFD8] hover:text-white transition-colors">Spa</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="lg:mx-auto text-left">
                        <h4 className="text-lg font-medium mb-7">Support</h4>
                        <ul className="text-sm transition-all duration-500">
                            <li className="mb-6"><Link to="/faqs" className="text-[#D6EFD8] hover:text-white transition-colors">FAQs</Link></li>
                            <li className="mb-6"><Link to="/contact" className="text-[#D6EFD8] hover:text-white transition-colors">Contact</Link></li>
                            <li className="mb-6"><Link to="/policies" className="text-[#D6EFD8] hover:text-white transition-colors">Policies</Link></li>
                            <li><Link to="/help" className="text-[#D6EFD8] hover:text-white transition-colors">Help</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="lg:mx-auto text-left">
                        <h4 className="text-lg font-medium mb-7">Contact Us</h4>
                        <ul className="text-sm transition-all duration-500">
                            <li className="mb-6"><a href="tel:+962793939352" className="text-[#D6EFD8] hover:text-white transition-colors">+962793939352</a></li>
                            <li className="mb-6"><a href="mailto:GROUPE1@rivana.com" className="text-[#D6EFD8] hover:text-white transition-colors">GROUPE1@rivana.com</a></li>
                            <li className="text-[#D6EFD8]">GROUPE 1,<br />ORANGE, ZARQA</li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="py-7 border-t border-[#D6EFD8]/20">
                    <div className="flex items-center justify-center flex-col lg:justify-between lg:flex-row">
                        <span className="text-sm text-[#D6EFD8]">Â© 2025 Rivana Chalets. All rights reserved.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;