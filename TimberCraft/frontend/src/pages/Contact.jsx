import React, { useContext } from "react";
import ChatWithSeller from "../components/ChatWithSeller";
import { ShopContext } from "../context/ShopContext";

const Contact = () => {
  const { token } = useContext(ShopContext);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Chat with Seller */}
        <div className="flex-1">
          {token ? (
            <ChatWithSeller />
          ) : (
            <div className="w-full flex flex-col bg-gray-50 h-[500px] rounded-lg shadow-lg">
              <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Chat with Seller
                  </h2>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-6">
                  <p className="text-gray-600 text-lg mb-4">
                    Please login to chat with our seller
                  </p>
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Login Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Info and Map */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Contact Info */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-4 text-center md:text-left">
              Contact Us
            </h1>
            <p className="text-gray-600 mb-4 text-center md:text-left">
              Have questions or need assistance? Get in touch with us!
            </p>
            <div className="text-gray-700">
              <p className="mb-2">
                <strong>Email: &nbsp; </strong>
                <u className="cursor-pointer hover:text-blue-700">
                  np03cs4a220102@heraldcollege.edu.np
                </u>
              </p>
              <p className="mb-2">
                <strong>Phone: &nbsp;</strong>{" "}
                <u className="cursor-pointer hover:text-blue-700">
                  +977 9800000000
                </u>
              </p>
              <p className="mb-2">
                <strong>Address:&nbsp; </strong>{" "}
                <u className="cursor-pointer hover:text-blue-700">
                  Bhagwati Marg, Kathmandu
                </u>
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1248.8114151136592!2d85.33088530718567!3d27.711972737157026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb196de5da5741%3A0x652792640c70ede9!2sHerald%20College%20Kathmandu!5e0!3m2!1sen!2snp!4v1738743402630!5m2!1sen!2snp"
              width="100%"
              height="300px"
              allowFullScreen=""
              loading="lazy"
              className="rounded-lg shadow-lg border"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
