import WishlistPage from "./Pages/Wishlist/Wishlist";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home/Home";
import Property from "./Pages/property/Property";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import Register from "./Pages/Register/Register";
import PropertyDetails from "./Pages/Details/Details";
import Landlords from "./Pages/Landlords/Landlords";
import Admin from "./Pages/Admin/Admin";
import Dashboard from "./Components/Dashboard";
import Postsaproval from "./Components/Postsaproval";
import Payments from "./Components/Paymants";
import Usersadmin from "./Components/Users";
import CreditCard from './Pages/Payment/creditCard';
import BookingForm from './Pages/Booking/Booking';
import Profile from "./Pages/Profile/Profile"

function Layout() {
  const location = useLocation();
  const hideNavbarPages = ["/register","/admin","/admin/posts-approvals","/admin/payments","/admin/users-admin","/admin/dashboard"]; // إخفاء Navbar و Footer في صفحة Register

  return (
    <>
      {!hideNavbarPages.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/property" element={<Property />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Landlords" element={<Landlords />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/credit" element={<CreditCard />} />
        <Route path="/booking/:id" element={<BookingForm />} />
        <Route path="/profile" element={<Profile />} />
        {/* NESTED ADMIN ROUTES */}
        <Route path="/admin" element={<Admin />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users-admin" element={<Usersadmin />} />
          <Route path="payments" element={<Payments />} />
          <Route path="posts-approvals" element={<Postsaproval />} />
        </Route>
      </Routes>
      {!hideNavbarPages.includes(location.pathname) && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;


// import WishlistPage from "./Pages/Wishlist/Wishlist";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation,
// } from "react-router-dom";
// import Navbar from "./Components/Navbar";
// import Footer from "./Components/Footer";
// import Home from "./Pages/Home/Home";
// import Property from "./Pages/property/Property";
// import About from "./Pages/About/About";
// import Contact from "./Pages/Contact/Contact";
// import Register from "./Pages/Register/Register";
// import PropertyDetails from "./Pages/Details/Details";
// import Landlords from "./Pages/Landlords/Landlords";
// import Admin from "./Pages/Admin/Admin";
// import Dashboard from "./Components/Dashboard";
// import Postsaproval from "./Components/Postsaproval";
// import Payments from "./Components/Paymants";
// import Usersadmin from "./Components/Users";
// import CreditCard from './Pages/Payment/creditCard';
// import BookingForm from './Pages/Booking/Booking';

// function Layout() {
//   const location = useLocation();
//   const hideNavbarPages = ["/register", "/booking"]; // إخفاء Navbar و Footer في صفحة Register و Booking

//   return (
//     <>
//       {!hideNavbarPages.some(path => location.pathname.startsWith(path)) && <Navbar />}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/property" element={<Property />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/Landlords" element={<Landlords />} />
//         <Route path="/properties/:id" element={<PropertyDetails />} />
//         <Route path="/wishlist" element={<WishlistPage />} />
//         <Route path="/credit" element={<CreditCard />} />
//         <Route path="/booking/:id" element={<BookingForm />} />
//         {/* NESTED ADMIN ROUTES */}
//         <Route path="/admin" element={<Admin />}>
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="users-admin" element={<Usersadmin />} />
//           <Route path="payments" element={<Payments />} />
//           <Route path="posts-approvals" element={<Postsaproval />} />
//         </Route>
//       </Routes>
//       {!hideNavbarPages.some(path => location.pathname.startsWith(path)) && <Footer />}
//     </>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Layout />
//     </Router>
//   );
// }

// export default App;