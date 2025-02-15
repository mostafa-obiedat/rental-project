import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../Redux/authSlice";
import { database, ref, set } from "../../firebaseConfig";
import WishlistPage from "../Wishlist/Wishlist";
import { User, Mail, Edit2, X, Camera } from "lucide-react";
import Swal from "sweetalert2";

const Profile = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [newFirstName, setNewFirstName] = useState(userData?.firstname || "");
  const [newLastName, setNewLastName] = useState(userData?.lastname || "");
  const [newPhone, setNewPhone] = useState(userData?.phoneNumber || "");
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(userData?.profileImage || "");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch(updateUser(storedUser));
    }
  }, [dispatch]);

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSaveChanges = async () => {
    // التحقق من صحة الاسم الأول
    if (!newFirstName || !/^[a-zA-Z ]+$/.test(newFirstName)) {
      Swal.fire({
        title: "Invalid First Name",
        text: "Please enter a valid first name!",
        icon: "error",
      });
      return;
    }
  
    // التحقق من صحة الاسم الأخير
    if (!newLastName || !/^[a-zA-Z ]+$/.test(newLastName)) {
      Swal.fire({
        title: "Invalid Last Name",
        text: "Please enter a valid last name!",
        icon: "error",
      });
      return;
    }
  
    // التحقق من صحة رقم الهاتف
    if (!newPhone || !/^07\d{8}$/.test(newPhone)) {
      Swal.fire({
        title: "Invalid Phone Number",
        text: "Phone number must be 10 digits and start with 07!",
        icon: "error",
      });
      return;
    }
  
    try {
      let imageBase64 = profileImageUrl;
      if (newProfileImage) {
        imageBase64 = await convertImageToBase64(newProfileImage);
        setProfileImageUrl(imageBase64);
      }
  
      const updatedUser = {
        ...userData,
        firstname: newFirstName,
        lastname: newLastName,
        phoneNumber: newPhone,
        profileImage: imageBase64,
      };
  
      // حفظ البيانات في localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch(updateUser(updatedUser));
  
      // حفظ البيانات في Firebase
      if (userData?.uid) {
        const userRef = ref(database, `users/${userData.uid}`);
        await set(userRef, {
          uid: userData.uid,
          firstname: newFirstName,
          lastname: newLastName,
          phoneNumber: newPhone,
          email: userData.email,
          profileImage: imageBase64,
        });
      }
  
      // عرض رسالة نجاح
      Swal.fire({
        title: "Profile Updated",
        text: "Your changes have been saved successfully.",
        icon: "success",
      }).then(() => {
        setIsEditing(false);
      });
    } catch (error) {
      // عرض رسالة خطأ
      Swal.fire({
        title: "Error",
        text: "Failed to update profile. Please try again later.",
        icon: "error",
      });
      console.error("Update Error:", error);
    }
  };

  if (!userData) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#358853] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="container my-20 mx-auto px-4">
      {/* Header Section with consistent width */}
      <div className="max-w-7xl mx-auto">
        <div className="w-full bg-gradient-to-r from-[#358853] via-[#45a868] to-[#D6EFD8] rounded-2xl shadow-xl mb-10 overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-[#358853] opacity-10" 
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                 }}
            />
            <div className="relative py-8 px-6 md:px-12">
              <div className="flex flex-col md:flex-row items-center justify-between">
                {/* Profile Image Section */}
                <div className="relative mb-6 md:mb-0">
                  <div className="relative w-32 h-32 group">
                    <img
                      src={profileImageUrl || "/api/placeholder/128/128"}
                      alt="User Profile"
                      className="w-32 h-32 rounded-full border-4 border-white shadow-xl transform group-hover:scale-105 transition-all duration-300"
                    />
                    <div
                      className="absolute -right-2 -bottom-2 bg-[#358853] p-2 rounded-full shadow-lg cursor-pointer hover:bg-[#2a6e42] transition-all duration-200"
                      onClick={() => setIsEditing(true)}
                    >
                      <Camera className="text-white" size={20} />
                    </div>
                  </div>
                </div>

                {/* User Info Section */}
                <div className="flex-grow px-8 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {userData.firstname} {userData.lastname}
                  </h2>
                  <p className="text-white opacity-90 text-lg mb-4">{userData.email}</p>
                </div>

                {/* Edit Button Section */}
                <div className="mt-6 md:mt-0">
                  <button
                    className="bg-white text-[#358853] hover:bg-gray-100 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 font-medium flex items-center cursor-pointer"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="mr-2" size={20} />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h5 className="text-xl font-bold mb-4 text-[#358853] border-b border-[#358853] pb-2 flex items-center">
              <User className="mr-2" size={20} />
              Personal Information
            </h5>
            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                  value={userData.firstname}
                  disabled
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                  value={userData.lastname}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h5 className="text-xl font-bold mb-4 text-[#358853] border-b border-[#358853] pb-2 flex items-center">
              <Mail className="mr-2" size={20} />
              Contact Information
            </h5>
            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                  value={userData.email}
                  disabled
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                  value={userData.phoneNumber}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Section */}
      <div className="max-w-7xl mx-auto my-10">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#358853] flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Your Wishlist
            </h2>
          </div>
          <div className="p-6">
            <WishlistPage hideTitle={true} />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-fadeIn">
            <div className="bg-[#358853] rounded-t-2xl p-6 relative">
              <h5 className="text-white text-2xl font-bold text-center">Edit Profile</h5>
              <button 
                onClick={() => setIsEditing(false)}
                className="absolute right-4 top-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#358853] focus:border-transparent"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#358853] focus:border-transparent"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#358853] focus:border-transparent"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <input
                  type="file"
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#358853] focus:border-transparent"
                  onChange={(e) => setNewProfileImage(e.target.files[0])}
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end space-x-4">
              <button
                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all duration-300 flex items-center cursor-pointer"
                onClick={() => setIsEditing(false)}
              >
                <X className="mr-2" size={18} />
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-[#358853] hover:bg-[#2a6e42] text-white font-medium transition-all duration-300 flex items-center cursor-pointer"
                onClick={handleSaveChanges}
              >
                <Edit2 className="mr-2" size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;