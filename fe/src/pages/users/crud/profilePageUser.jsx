import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, Loader2, LogOut, Edit2, Mail, Camera } from "lucide-react";
import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.put("/auth/me", formData);
      updateUser(response.data);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      setError(err?.response?.data?.message || "Profile update failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your personal information and account settings.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="md:flex">
             {/* Sidebar User Info */}
            <div className="md:w-1/3 p-8 bg-gray-50 border-r border-gray-100 flex flex-col items-center text-center">
               <div className="relative mb-4">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                      {user.avatar ? (
                          <img 
                            src={`http://localhost:5000${user.avatar}`} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                          />
                      ) : (
                          <span className="text-3xl font-bold text-gray-400">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                          </span>
                      )}
                  </div>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors cursor-pointer">
                      <Camera size={14} />
                  </label>
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const formData = new FormData();
                            formData.append("avatar", file);
                            try {
                                setSuccess(null);
                                setError(null);
                                const res = await api.post("/auth/upload-avatar", formData, {
                                    headers: { "Content-Type": "multipart/form-data" }
                                });
                                // Update user context with new avatar
                                updateUser({ ...user, avatar: res.data.avatar });
                                setSuccess("Profile picture updated!");
                            } catch (err) {
                                setError("Failed to upload image");
                                console.error(err);
                            }
                        }
                    }}
                  />
               </div>
               <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
               <p className="text-sm text-gray-500 mb-6">
                 {user.role === 'superadmin' ? 'Super Administrator' : user.role === 'admin' ? 'Administrator' : 'Customer'}
               </p>
               
               <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
               >
                 <LogOut size={16} /> Sign Out
               </button>
            </div>

            {/* Main Content Form */}
            <div className="md:w-2/3 p-8">
                {/* Notifications */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                        {success}
                    </div>
                )}

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Personal Details</h3>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                        <Edit2 size={16} /> Edit
                    </button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={isEditing ? formData.name : user.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            isEditing 
                            ? "bg-white border-gray-300 text-gray-900 shadow-sm" 
                            : "bg-gray-50 border-transparent text-gray-500 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email Input (Always Disabled) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="block w-full pl-10 pr-3 py-2.5 sm:text-sm bg-gray-50 border border-transparent rounded-lg text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                     <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={isEditing ? formData.phone : showValue(user.phone)}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder={isEditing ? "Enter phone number" : "Not set"}
                        className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            isEditing 
                             ? "bg-white border-gray-300 text-gray-900 shadow-sm" 
                            : "bg-gray-50 border-transparent text-gray-500 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Address Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                     <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <MapPin size={18} />
                      </div>
                      <input
                        type="text"
                        name="address"
                        value={isEditing ? formData.address : showValue(user.address)}
                        onChange={handleChange}
                        disabled={!isEditing}
                         placeholder={isEditing ? "Enter your address" : "Not set"}
                         className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            isEditing 
                             ? "bg-white border-gray-300 text-gray-900 shadow-sm" 
                            : "bg-gray-50 border-transparent text-gray-500 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                    <div className="mt-8 flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for displaying empty values
const showValue = (val) => val || "";

export default ProfilePage;
