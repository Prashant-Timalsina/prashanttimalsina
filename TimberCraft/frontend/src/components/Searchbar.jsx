import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
// import api from "../api";

const Searchbar = () => {
  const { search, setSearch, showSearch, setShowSearch, fetchallProducts } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const isCollectionPage = location.pathname === "/collection";

  useEffect(() => {
    if (showSearch && isCollectionPage) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [showSearch, isCollectionPage]);

  // Add debounced search effect
  useEffect(() => {
    if (!isCollectionPage) return;

    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      fetchallProducts(search).finally(() => setLoading(false));
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [search, isCollectionPage]);

  const handleSearch = async () => {
    if (isCollectionPage) {
      setLoading(true);
      await fetchallProducts(search);
      setLoading(false);
      setShowSearch(false);
    }
  };

  const handleClose = async () => {
    setSearch(""); // Clear the search input
    setLoading(true);
    await fetchallProducts(""); // Fetch all products
    setLoading(false);
    setShowSearch(false);
  };

  // Handle "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isCollectionPage) {
      handleSearch();
    }
  };

  return showSearch && visible && isCollectionPage ? (
    <motion.div
      className="border-t border-b bg-gray-50 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 outline-none bg-inherit text-sm"
          placeholder="Search"
          type="text"
        />
        <img
          className="w-4 cursor-pointer"
          src={assets.search}
          alt="Search icon"
          onClick={handleSearch}
        />
      </div>
      {loading && (
        <div className="flex justify-center items-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <X className="inline w-10 cursor-pointer" onClick={handleClose} />
    </motion.div>
  ) : null;
};

export default Searchbar;
