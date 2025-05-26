import React, { useContext, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const { navigate, showSearch, setShowSearch, cartCount, token, setToken } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();
  const isCollectionPage = location.pathname === "/collection";

  const logOut = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  let tooltipTimeout;
  const handleMouseEnter = () => {
    if (!isCollectionPage) {
      tooltipTimeout = setTimeout(() => {
        setShowTooltip(true);
      }, 1000);
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(tooltipTimeout);
    setShowTooltip(false);
  };

  const handleSearchClick = () => {
    if (isCollectionPage) {
      setShowSearch(!showSearch);
    } else {
      navigate("/collection");
    }
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="Logo" />
      </Link>

      <ul className="hidden md:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <div className="relative">
          <img
            src={assets.search}
            className={`w-6 cursor-pointer ${
              !isCollectionPage ? "opacity-50" : ""
            }`}
            alt="Search icon"
            onClick={handleSearchClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          {showTooltip && !isCollectionPage && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Search works only on Collection page
            </div>
          )}
        </div>

        <div className="relative">
          {token ? (
            <>
              <img
                src={assets.profile}
                className="w-6 cursor-pointer"
                alt="Profile icon"
                onClick={() => setVisible(!visible)}
              />
              {visible && (
                <div className="absolute right-0 pt-3 z-50">
                  <div className="flex flex-col px-5 gap-2 w-32 bg-slate-200 rounded">
                    <p
                      onClick={() => {
                        navigate("/profile");
                        setVisible(false);
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      My Profile
                    </p>
                    <p
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        navigate("/orders");
                        setVisible(false);
                      }}
                    >
                      Orders
                    </p>
                    <p
                      onClick={() => {
                        logOut();
                        setVisible(false);
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      Log Out
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <img
              src={assets.profile}
              className="w-6 cursor-pointer"
              alt="Profile icon"
              onClick={() => navigate("/login")}
            />
          )}
        </div>

        <Link to="/cart" className="relative">
          <img
            src={assets.cart}
            className="w-6 cursor-pointer"
            alt="Cart icon"
          />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-xs">
            {cartCount}
          </p>
        </Link>

        <img
          className="w-5 cursor-pointer md:hidden"
          onClick={() => setMenuVisible(!menuVisible)}
          src={assets.menu}
          alt="Menu icon"
        />
      </div>

      {/* Sidebar for small screens */}
      <div
        className={`fixed top-0 right-0 bottom-0 bg-white transition-all duration-300 overflow-hidden z-50 md:hidden ${
          menuVisible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-800 h-full">
          <div
            className="flex items-center gap-4 p-3 cursor-pointer"
            onClick={() => setMenuVisible(false)}
          >
            <img className="h-5" src={assets.back} alt="Back button" />
            <p>Back</p>
          </div>

          <NavLink
            onClick={() => setMenuVisible(false)}
            className="py-2 px-6 border-t"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setMenuVisible(false)}
            className="py-2 px-6 border-t"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setMenuVisible(false)}
            className="py-2 px-6 border-t"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setMenuVisible(false)}
            className="py-2 px-6 border-t"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
