import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import api from "../api";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, backendUrl, navigate } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault(); // Prevent page reload

    try {
      if (currentState === "Login") {
        // Login request
        const response = await api.post(`/user/login`, {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful!");
        } else {
          toast.error(
            response.data.message || "An error occurred. Please try again."
          );
        }
      } else {
        // SignUp request
        const response = await api.post(`/user/register`, {
          name,
          email,
          password,
        });
        if (response.data.success) {
          toast.success(
            "Account created successfully! Please verify your email."
          );
          setCurrentState("Login"); // Redirect to login after successful registration
        } else {
          toast.error(
            response.data.message || "An error occurred. Please try again."
          );
        }
      }
    } catch (error) {
      // Enhanced error handling
      if (error.response) {
        toast.error(
          error.response.data.message || "An error occurred. Please try again."
        );
        console.error("Error response:", error.response);
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
        console.error("Error request:", error.request);
      } else {
        toast.error(error.message || "Unexpected error.");
        console.error("General error:", error.message);
      }
    }
  };

  // 🔹 Forgot Password Handler
  const forgotPasswordHandler = async () => {
    const userEmail = prompt("Enter your email for password reset:");
    if (!userEmail) return;

    // Validate email format
    const isValidEmail = /\S+@\S+\.\S+/;
    if (!isValidEmail.test(userEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/forgot-password`,
        {
          email: userEmail,
        }
      );

      if (response.data.success) {
        toast.success("Password reset link sent to your email.");
      } else {
        toast.error(response.data.message || "Failed to send reset email.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again."
      );
      console.error("Forgot Password Error:", error);
    }
  };

  useEffect(() => {
    if (token) navigate("/"); // Redirect on successful login
  }, [token, navigate]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "SignUp" && (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Name"
          required
        />
      )}
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="E-mail"
        required
      />
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full px-3 py-2 border border-gray-800 pr-10" // Add padding-right to make space for the image
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xl" // Absolute position for the icon inside the field
        >
          {showPassword ? (
            <img className="h-4 w-4" src={assets.show} alt="Show password" />
          ) : (
            <img className="h-4 w-4" src={assets.hide} alt="Hide password" />
          )}
        </button>
      </div>

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        {currentState === "Login" ? (
          <p onClick={forgotPasswordHandler} className="cursor-pointer">
            Forgot Password?
          </p>
        ) : (
          "-->"
        )}
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("SignUp")}
            className="cursor-pointer"
          >
            Create Account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login Here
          </p>
        )}
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === "Login" ? "Login" : "SignUp"}
      </button>
    </form>
  );
};

export default Login;
