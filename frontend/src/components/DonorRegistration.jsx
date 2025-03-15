import React, { useState } from "react";
import axios from "axios";
const DonorRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/donorregister", formData);
      console.log("Registration Successful:", response.data);
      window.location.href = "/donorlogin"; // Redirect after registration
    } catch (err) {
      console.error("Registration Failed:", err.response?.data?.message || "Something went wrong");
      setErrors({ server: err.response?.data?.message || "Error during registration" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 via-teal-200 to-cyan-300">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        {/* Logo & Title */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 mb-2 rounded-full bg-gradient-to-r from-teal-300 to-cyan-400 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">TheEtherealGift</h2>
          <p className="mt-2 text-sm text-teal-600">Create your donor account</p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`appearance-none rounded-lg w-full px-3 py-3 border ${errors.name ? "border-red-300" : "border-gray-300"} placeholder-gray-500`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none rounded-lg w-full px-3 py-3 border ${errors.email ? "border-red-300" : "border-gray-300"} placeholder-gray-500`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none rounded-lg w-full px-3 py-3 border ${errors.password ? "border-red-300" : "border-gray-300"} placeholder-gray-500`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`appearance-none rounded-lg w-full px-3 py-3 border ${errors.confirmPassword ? "border-red-300" : "border-gray-300"} placeholder-gray-500`}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>

          {errors.server && <p className="text-red-500 text-sm">{errors.server}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 ease-in-out"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Register as Donor"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/donorlogin" className="font-medium text-teal-600 hover:text-teal-500">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonorRegister;