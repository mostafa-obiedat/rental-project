import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser, signInUser, signInWithGoogle, resetStatus } from "../../Redux/authSlice";
import { FaGoogle, FaExclamationCircle, FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state) => state.auth);
  const [isSignUp, setIsSignUp] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errorsSignUp, setErrorsSignUp] = useState({});
  const [errorsSignIn, setErrorsSignIn] = useState({});

  useEffect(() => {
    if (status === "succeeded" && isSignUp) {
      toast.success("Registration successful!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate("/");
        dispatch(resetStatus());
      }, 2000);
    }
  }, [status, isSignUp, navigate, dispatch]);

  useEffect(() => {
    if (status === "succeeded" && !isSignUp) {
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        if (user?.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
        dispatch(resetStatus());
      }, 2000);
    }
  }, [status, isSignUp, navigate, dispatch, user]);

  const handleToggleForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      if (isSignUp) {
        setErrorsSignUp({});
      } else {
        setErrorsSignIn({});
      }
      dispatch(resetStatus());
      setIsAnimating(false);
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email?.value.trim() || "";
    const password = form.password?.value.trim() || "";
    const firstname = form.firstname?.value.trim() || "";
    const lastname = form.lastname?.value.trim() || "";
    const phoneNumber = form.phoneNumber?.value.trim() || "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const phoneNumberPattern = /^07\d{8}$/;

    if (isSignUp) {
      let validationErrors = {};

      if (!emailPattern.test(email)) {
        validationErrors.email = "Please enter a valid email.";
      }

      if (!passwordPattern.test(password)) {
        validationErrors.password = "Please enter a strong password (must be at least 8 characters long and contain at least one number, one uppercase and one lowercase letter).";
      }

      if (!phoneNumberPattern.test(phoneNumber)) {
        validationErrors.phoneNumber = "Please enter a valid phone number (must be 10 digits and start with 07).";
      }

      if (!firstname) {
        validationErrors.firstname = "Please enter your first name.";
      }

      if (!lastname) {
        validationErrors.lastname = "Please enter your last name.";
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrorsSignUp(validationErrors);
        return;
      }
      setErrorsSignUp({});

      try {
        await dispatch(signUpUser({ email, password, firstname, lastname, phoneNumber }));
      } catch (error) {
        console.log("Error caught during sign-up:", error);

        if (error.code === 'auth/email-already-in-use') {
          setErrorsSignUp(prevErrors => ({
            ...prevErrors,
            email: "This email is already registered. Please use another one."
          }));
        } else if (error.code === 'auth/invalid-email') {
          setErrorsSignUp(prevErrors => ({
            ...prevErrors,
            email: "Please enter a valid email address."
          }));
        } else {
          setErrorsSignUp(prevErrors => ({
            ...prevErrors,
            general: "An error occurred. Please try again later."
          }));
        }
      }
    } else {
      let validationErrors = {};

      if (!emailPattern.test(email)) {
        validationErrors.email = "Please enter a valid email.";
      }

      if (!password) {
        validationErrors.password = "Password is required.";
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrorsSignIn(validationErrors);
        return;
      }

      try {
        await dispatch(signInUser({ email, password }));
      } catch (error) {
        console.log("Error caught during sign-in:", error);

        if (error.code === 'auth/user-not-found') {
          setErrorsSignIn(prevErrors => ({
            ...prevErrors,
            email: "No user found with this email. Please check and try again."
          }));
        } else if (error.code === 'auth/wrong-password') {
          setErrorsSignIn(prevErrors => ({
            ...prevErrors,
            password: "Incorrect password. Please try again."
          }));
        } else if (error.code === 'auth/invalid-email') {
          setErrorsSignIn(prevErrors => ({
            ...prevErrors,
            email: "Invalid email address. Please check and try again."
          }));
        } else {
          setErrorsSignIn(prevErrors => ({
            ...prevErrors,
            general: "An error occurred. Please try again later."
          }));
        }
      }
    }
  };

  const handleGoogleSignIn = async () => {
    await dispatch(signInWithGoogle());
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-gray-50">
      {/* Toast Container مع تعديل الموقع */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        toastClassName="md:w-auto w-full"
      />

      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className={`w-full max-w-md transform transition-all duration-500 ease-in-out ${
            isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {isSignUp ? (
            <SignupForm
              handleSubmit={handleSubmit}
              handleGoogleSignUp={handleGoogleSignIn}
              error={error}
              status={status}
              errors={errorsSignUp}
              setErrorsSignUp={setErrorsSignUp}
            />
          ) : (
            <SigninForm
              handleSubmit={handleSubmit}
              handleGoogleSignIn={handleGoogleSignIn}
              error={error}
              status={status}
              errors={errorsSignIn}
              setErrorsSignIn={setErrorsSignIn}
            />
          )}

          {/* زر التبديل بين الفورمات (يظهر فقط في الأجهزة المتوسطة والصغيرة) */}
          <div className="mt-6 text-center block md:hidden">
            <p className="text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </p>
            <button
              onClick={handleToggleForm}
              className="mt-2 text-[#1A5319] font-semibold hover:underline focus:outline-none"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>

      {/* إخفاء الصورة في الأجهزة المتوسطة والصغيرة */}
      <div className="flex-1 relative overflow-hidden hidden md:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://mir-s3-cdn-cf.behance.net/project_modules/1400/4ce5aa143408545.627a3e505b0a4.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <div className="relative h-full flex flex-col items-center justify-center text-white p-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              {isSignUp ? "Already have an account?" : "New here?"}
            </h2>
            <p className="text-lg mb-8 max-w-md">
              {isSignUp
                ? "Welcome back! Sign in to enjoy exclusive offers and a unique stay experience."
                : "Join us today and explore the best rental experiences in our farms and chalets."}
            </p>
            <button
              className="px-8 py-3 border-2 border-white rounded-full text-lg font-semibold
                         hover:bg-white hover:text-[#1A5319] transition-all duration-300
                         cursor-pointer"
              onClick={handleToggleForm}
            >
              {isSignUp ? "SIGN IN" : "SIGN UP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ... (باقي الكود)
const SignupForm = ({ handleSubmit, handleGoogleSignUp, error, status, errors, setErrorsSignUp }) => (
  <div className="bg-white p-8 rounded-2xl shadow-xl">
    <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Create Account</h2>

    {error && (
      <div className="mb-6 p-4 bg-red-50 rounded-lg text-red-500 text-center">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <InputField
          name="firstname"
          type="text"
          placeholder="First Name"
          icon={<FaUser className="text-gray-400" />}
          error={errors.firstname}
          setErrors={setErrorsSignUp}
          showIcon={false}
        />
        <InputField
          name="lastname"
          type="text"
          placeholder="Last Name"
          icon={<FaUser className="text-gray-400" />}
          error={errors.lastname}
          setErrors={setErrorsSignUp}
          showIcon={false}
        />
      </div>

      <InputField
        name="email"
        type="email"
        placeholder="Email"
        icon={<FaEnvelope className="text-gray-400" />}
        error={errors.email}
        setErrors={setErrorsSignUp}
        showIcon={false}
      />

      <InputField
        name="password"
        type="password"
        placeholder="Password"
        icon={<FaLock className="text-gray-400" />}
        error={errors.password}
        setErrors={setErrorsSignUp}
        showIcon={false}
      />

      <InputField
        name="phoneNumber"
        type="text"
        placeholder="Phone Number"
        icon={<FaPhone className="text-gray-400" />}
        error={errors.phoneNumber}
        setErrors={setErrorsSignUp}
        showIcon={false}
      />

      <button
        type="submit"
        className="w-full bg-[#1A5319] text-white py-4 rounded-xl text-lg font-semibold
                   hover:bg-[#7DA87B] transition-all duration-300 transform hover:scale-105 cursor-pointer"
      >
        Create Account
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-300
                   rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer"
      >
        <FaGoogle className="text-xl" />
        <span className="font-semibold">Google</span>
      </button>
    </form>
  </div>
);

const SigninForm = ({ handleSubmit, handleGoogleSignIn, error, status, errors, setErrorsSignIn }) => (
  <div className="bg-white p-8 rounded-2xl shadow-xl">
    <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Welcome Back</h2>

    {error && (
      <div className="mb-6 p-4 bg-red-50 rounded-lg text-red-500 text-center">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        name="email"
        type="email"
        placeholder="Email"
        icon={<FaEnvelope className="text-gray-400" />}
        error={errors.email}
        setErrors={setErrorsSignIn}
        showIcon={true}
      />

      <InputField
        name="password"
        type="password"
        placeholder="Password"
        icon={<FaLock className="text-gray-400" />}
        error={errors.password}
        setErrors={setErrorsSignIn}
        showIcon={true}
      />

      <button
        type="submit"
        className="w-full bg-[#1A5319] text-white py-4 rounded-xl text-lg font-semibold
                   hover:bg-[#7DA87B] transition-all duration-300 transform hover:scale-105 cursor-pointer"
      >
        Sign In
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-300
                   rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer"
      >
        <FaGoogle className="text-xl" />
        <span className="font-semibold">Google</span>
      </button>
    </form>
  </div>
);

const InputField = ({ name, type, placeholder, icon, error, setErrors, className = "", showIcon = false }) => {
  const handleChange = (e) => {
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300
                     focus:ring-2 focus:ring-[#1A5319] focus:border-transparent
                     ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
          onChange={handleChange}
        />
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm pl-4">
          {showIcon && <FaExclamationCircle />}
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Register;