import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // إضافة useNavigate
import { useSelector, useDispatch } from "react-redux";  // إضافة useDispatch
import { FaUser, FaSignOutAlt, FaHeart } from "react-icons/fa";  // إضافة أيقونة الخروج

import { logout } from "../Redux/authSlice"; // استيراد الدالة logout من الـ Redux

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // لاستخدام التوجيه
  const dispatch = useDispatch(); // استخدام الديسباتش
  const { user } = useSelector((state) => state.auth);  // استخدام useSelector للحصول على بيانات المستخدم

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Property', path: '/property' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => {
    return location.pathname === path ? 'bg-[#a4cfa7]' : '';
  };

  const handleLogout = () => {
    dispatch(logout());  // مسح بيانات المستخدم من الـ Redux
    localStorage.removeItem("user");  // مسح بيانات المستخدم من localStorage
    navigate("/");  // إعادة توجيه المستخدم إلى صفحة الهوم
  };

  return (
    <nav className="shadow-lg bg-[#D6EFD8]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 logo-swing">
            <svg
              className="w-10 h-10"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 2L4 15H8V34H32V15H36L20 2Z"
                fill="#80AF81"
                stroke="#4A5568"
                strokeWidth="2"
              />
              <path d="M16 20H24V34H16V20Z" fill="#4A5568" />
              <path d="M13 12L20 6L27 12H13Z" fill="#4A5568" />
            </svg>
            <span className="text-2xl font-bold text-gray-800">Rivana</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-[#508D4E] p-2 rounded-lg hover:bg-[#a4cfa7] hover:text-[#1A5319] transition-colors duration-300 ${isActive(item.path)}`}
              >
                {item.name}
              </Link>
            ))}

            {/* عرض اسم المستخدم أو أيقونة الخروج */}
            {user ? (
              <div className="text-[#508D4E] flex items-center space-x-2">
                <button className="ml-4 text-[#508D4E] hover:text-[#1A5319] flex items-center space-x-2 duration-300 cursor-pointer">
                <FaUser
                  onClick={() => navigate("/profile")}
                />{/* أيقونة المستخدم */}
                <span>{user.firstname} {user.lastname}</span>{/* عرض اسم المستخدم */}
                </button>
                <button
            className="ml-3 text-[#508D4E] hover:text-[#1A5319] flex items-center duration-300 cursor-pointer"
            onClick={() => navigate("/Landlords")}
          >
            Add Property  {/* أيقونة المفضلة */}
          </button> 

                {/* أيقونة الـ Wishlist */}
          <button
            className="ml-3 text-[#508D4E] hover:text-[#1A5319] flex items-center duration-300 cursor-pointer"
            onClick={() => navigate("/wishlist")}
          >
            <FaHeart className="text-xl" /> {/* أيقونة المفضلة */}
          </button> 
                <button
                  onClick={handleLogout}
                  className="ml-5 text-[#508D4E] hover:text-[#1A5319] flex items-center space-x-2 duration-300 cursor-pointer"
                >
                  <FaSignOutAlt /> {/* أيقونة الخروج */}
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/register"
                className="bg-[#508D4E] hover:bg-[#1A5319] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 ml-4 cursor-pointer"
              >
                Login
              </Link>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden text-gray-700 focus:outline-none">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white py-2 mobile-menu">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-4 py-2 text-[#508D4E] hover:bg-[#1A5319] hover:text-white transition-colors duration-300 ${isActive(item.path)}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-4 py-2">
              {user ? (
                <div className="block w-full bg-[#508D4E] hover:bg-[#1A5319] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 cursor-pointer text-center">
                  {user.username}
                </div>
              ) : (
                <Link
                  to="/register"
                  className="block w-full bg-[#508D4E] hover:bg-[#1A5319] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 cursor-pointer text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;