import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Product from "./pages/Product";
import CustomOrder from "./pages/CustomOrder";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Searchbar from "./components/Searchbar";
import Error from "./components/Error";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import Chatbot from "./components/Chatbot";
import PrivacyPolicy from "./pages/PrivacyPolicy";

import { FaCommentDots, FaTimes } from "react-icons/fa"; // Import icons
import VerifyEmailPage from "./pages/VerifyEmailPage";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="relative flex flex-col min-h-screen">
      <ToastContainer />

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="animate-spin w-16 h-16 text-primary" />
        </div>
      ) : (
        <>
          <div className="flex-1 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20">
            <Navbar />
            <Searchbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />

              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />

              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<PlaceOrder />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/custom-order" element={<CustomOrder />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failure" element={<PaymentFailure />} />

              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />

              <Route path="/*" element={<Error />} />
            </Routes>
          </div>
          <div>
            <button
              onClick={() => setIsChatbotOpen((prev) => !prev)}
              className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-xl flex items-center justify-center"
            >
              {isChatbotOpen ? <FaTimes /> : <FaCommentDots />}
            </button>

            {isChatbotOpen && (
              <div className="fixed bottom-16 right-4">
                <Chatbot onClose={() => setIsChatbotOpen(false)} />
              </div>
            )}
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
