import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaList,
  FaUsers,
  FaComments,
  FaHistory,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-16 md:w-60 min-h-full bg-white border-r-2 rounded-2xl shadow-lg flex flex-col py-8 px-2 md:px-4 gap-4 sticky top-0 transition-all duration-300">
      <div className="flex flex-col gap-2 text-[15px]">
        {/* Home */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-lg transition-colors duration-200 font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-900 ${
              isActive ? "bg-amber-100 text-amber-900" : ""
            }`
          }
          to="/home"
          title="Home"
        >
          <FaHome className="w-5 h-5" />
          <span className="hidden md:block">Home</span>
        </NavLink>

        {/* Add Items */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-lg transition-colors duration-200 font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-900 ${
              isActive ? "bg-amber-100 text-amber-900" : ""
            }`
          }
          to="/add"
          title="Add Items"
        >
          <FaPlus className="w-5 h-5" />
          <span className="hidden md:block">Add Items</span>
        </NavLink>

        {/* List Items */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-lg transition-colors duration-200 font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-900 ${
              isActive ? "bg-amber-100 text-amber-900" : ""
            }`
          }
          to="/list"
          title="List Items"
        >
          <FaList className="w-5 h-5" />
          <span className="hidden md:block">List Items</span>
        </NavLink>

        {/* List Users */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-lg transition-colors duration-200 font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-900 ${
              isActive ? "bg-amber-100 text-amber-900" : ""
            }`
          }
          to="/listuser"
          title="List Users"
        >
          <FaUsers className="w-5 h-5" />
          <span className="hidden md:block">List Users</span>
        </NavLink>

        {/* Chat Box */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-lg transition-colors duration-200 font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-900 ${
              isActive ? "bg-amber-100 text-amber-900" : ""
            }`
          }
          to="/chatbox"
          title="Chat Box"
        >
          <FaComments className="w-5 h-5" />
          <span className="hidden md:block">Chat Box</span>
        </NavLink>

        {/* Order History */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-lg transition-colors duration-200 font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-900 ${
              isActive ? "bg-amber-100 text-amber-900" : ""
            }`
          }
          to="/orders"
          title="Order History"
        >
          <FaHistory className="w-5 h-5" />
          <span className="hidden md:block">Order History</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
