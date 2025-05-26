import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { assets } from "../assets/assets";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AdminContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/admin`, {
        email,
        password,
      });

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        toast.success("Login successful!");
        navigate("/home");
      } else {
        toast.error(res.data.message || "Login failed!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error logging in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-[500px] max-w-[90vw] transform transition-all duration-300 hover:shadow-2xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h2>
          <div className="w-20 h-1 bg-black rounded-full"></div>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-lg"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-lg pr-12"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <img
                  className="h-5 w-5"
                  src={showPassword ? assets.show : assets.hide}
                  alt={showPassword ? "Show password" : "Hide password"}
                />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full bg-black text-white font-medium px-4 py-3 rounded-lg text-lg transition-all duration-200 hover:bg-gray-800 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading || !email || !password}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
