import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 w-full mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr] gap-10 text-sm">
          {/* Logo and Description */}
          <div>
            <Link to="/">
              <img
                src={assets.logo}
                className="mb-4 w-32"
                alt="TimberCraft Logo"
              />
            </Link>
            <p className="max-w-sm">
              TimberCraft offers high-quality, customizable wooden furniture.
              Our pieces are crafted with precision and care, ensuring each item
              meets our exceptional standards of quality and design.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">COMPANY</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/collection"
                  className="hover:text-white transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              GET IN TOUCH
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <HiOutlinePhone className="h-5 w-5 text-gray-400" />
                <span>+977-980323232</span>
              </li>
              <li className="flex items-center gap-2">
                <HiOutlineMail className="h-5 w-5 text-gray-400" />
                <a
                  href="mailto:support@timbercraft.com"
                  className="hover:text-white transition-colors"
                >
                  support@timbercraft.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <HiOutlineLocationMarker className="h-5 w-5 text-gray-400" />
                <span>Kathmandu, Nepal</span>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="mt-5">
              <h4 className="text-sm font-medium mb-2 text-white">FOLLOW US</h4>
              <div className="flex space-x-4">
                {[
                  {
                    href: "https://facebook.com",
                    icon: <FaFacebookF className="h-5 w-5" />,
                  },
                  {
                    href: "https://instagram.com",
                    icon: <FaInstagram className="h-5 w-5" />,
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          <p>© {new Date().getFullYear()} TimberCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
