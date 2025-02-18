// import React, { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../Redux/authSlice";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   const navItems = [
//     { name: "Home", path: "/" },
//     { name: "Property", path: "/property" },
//     { name: "About", path: "/about" },
//     { name: "Contact", path: "/contact" },
//   ];

//   const handleLogout = () => {
//     dispatch(logout());
//     localStorage.removeItem("user");
//     navigate("/");
//     setMenuOpen(false);
//   };

//   return (
//     <nav className="bg-gradient-to-r from-green-50 to-green-100 shadow-md">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <div className="w-10 h-10 relative">
//               <div className="absolute inset-0 bg-green-600 rounded-lg transform rotate-45"></div>
//               <div className="absolute inset-2 bg-white rounded-lg transform rotate-45"></div>
//               <div className="absolute inset-4 bg-green-600 rounded-lg transform rotate-45"></div>
//             </div>
//             <span className="text-2xl font-bold text-green-800">Rivana</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-6">
//             {navItems.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
//                   ${location.pathname === item.path
//                     ? 'bg-green-600 text-white'
//                     : 'text-green-700 hover:bg-green-500 hover:text-white'
//                   }`}
//               >
//                 {item.name}
//               </Link>
//             ))}

//             {user ? (
//               <div className="flex items-center space-x-4">
//                 <Link
//                   to="/Landlords"
//                   className="text-green-700 hover:text-green-900 transition-colors duration-200"
//                 >
//                   <span className="flex items-center space-x-1">
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//                     </svg>
//                     <span>Add Property</span>
//                   </span>
//                 </Link>
                
//                 <Link
//                   to="/wishlist"
//                   className="text-green-700 hover:text-green-900 transition-colors duration-200"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                   </svg>
//                 </Link>

//                 <div className="relative group">
//                   <button className="flex items-center space-x-1 text-green-700 hover:text-green-900">
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                   </button>
//                   <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl hidden group-hover:block">
//                     <Link
//                       to="/profile"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
//                       onClick={() => setMenuOpen(false)}
//                     >
//                       Profile
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <Link
//                 to="/register"
//                 className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
//               >
//                 Login
//               </Link>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={toggleMenu}
//             className="md:hidden p-2 rounded-md text-green-700 hover:text-green-900 hover:bg-green-100 focus:outline-none"
//           >
//             <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               {menuOpen ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//               )}
//             </svg>
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {menuOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   className={`block px-3 py-2 rounded-md text-base font-medium ${
//                     location.pathname === item.path
//                       ? 'bg-green-600 text-white'
//                       : 'text-green-700 hover:bg-green-500 hover:text-white'
//                   }`}
//                   onClick={() => setMenuOpen(false)}
//                 >
//                   {item.name}
//                 </Link>
//               ))}
              
//               {user ? (
//                 <>
//                   <Link
//                     to="/Landlords"
//                     className="block px-3 py-2 rounded-md text-base font-medium text-green-700 hover:bg-green-500 hover:text-white"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     Add Property
//                   </Link>
//                   <Link
//                     to="/wishlist"
//                     className="block px-3 py-2 rounded-md text-base font-medium text-green-700 hover:bg-green-500 hover:text-white"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     Wishlist
//                   </Link>
//                   <Link
//                     to="/profile"
//                     className="block px-3 py-2 rounded-md text-base font-medium text-green-700 hover:bg-green-500 hover:text-white"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     Profile
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-green-700 hover:bg-green-500 hover:text-white"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <Link
//                   to="/register"
//                   className="block px-3 py-2 rounded-md text-base font-medium bg-green-600 text-white hover:bg-green-700"
//                   onClick={() => setMenuOpen(false)}
//                 >
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/authSlice";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Property", path: "/property" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-green-50 to-green-100 shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 relative">
              <div className="absolute inset-0 bg-green-600 rounded-lg transform rotate-45"></div>
              <div className="absolute inset-2 bg-white rounded-lg transform rotate-45"></div>
              <div className="absolute inset-4 bg-green-600 rounded-lg transform rotate-45"></div>
            </div>
            <span className="text-2xl font-bold text-green-800">Rivana</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${location.pathname === item.path
                    ? 'bg-green-600 text-white'
                    : 'text-green-700 hover:bg-green-500 hover:text-white'
                  }`}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/Landlords"
                  className="text-green-700 hover:text-green-900 transition-colors duration-200"
                >
                  <span className="flex items-center space-x-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Property</span>
                  </span>
                </Link>
                
                <Link
                  to="/wishlist"
                  className="text-green-700 hover:text-green-900 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-1 text-green-700 hover:text-green-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/register"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-green-700 hover:text-green-900 hover:bg-green-100 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-40">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? 'bg-green-600 text-white'
                      : 'text-green-700 hover:bg-green-500 hover:text-white'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link
                    to="/Landlords"
                    className="block px-3 py-2 rounded-md text-base font-medium text-green-700 hover:bg-green-500 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    Add Property
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-3 py-2 rounded-md text-base font-medium text-green-700 hover:bg-green-500 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-green-700 hover:bg-green-500 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-green-700 hover:bg-green-500 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-green-600 text-white hover:bg-green-700"
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