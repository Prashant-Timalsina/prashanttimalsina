import React, { useState } from "react";
import ProductListTable from "../components/ProductListTable";
import CategoryListTable from "../components/CategoryListTable";
import WoodListTable from "../components/WoodListTable";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const List = () => {
  const [expandedSections, setExpandedSections] = useState({
    products: false,
    categories: false,
    woods: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Product List Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("products")}
              className="w-full flex items-center justify-between text-xl font-bold p-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <span>Product List</span>
              {expandedSections.products ? (
                <FaChevronUp className="w-5 h-5" />
              ) : (
                <FaChevronDown className="w-5 h-5" />
              )}
            </button>
            {expandedSections.products && (
              <div className="p-4 border-t">
                <ProductListTable />
              </div>
            )}
          </div>

          {/* Category and Wood List Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection("categories")}
                className="w-full flex items-center justify-between text-xl font-bold p-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <span>Category List</span>
                {expandedSections.categories ? (
                  <FaChevronUp className="w-5 h-5" />
                ) : (
                  <FaChevronDown className="w-5 h-5" />
                )}
              </button>
              {expandedSections.categories && (
                <div className="p-4 border-t">
                  <CategoryListTable />
                </div>
              )}
            </div>

            {/* Wood Name List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection("woods")}
                className="w-full flex items-center justify-between text-xl font-bold p-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <span>Wood Name List</span>
                {expandedSections.woods ? (
                  <FaChevronUp className="w-5 h-5" />
                ) : (
                  <FaChevronDown className="w-5 h-5" />
                )}
              </button>
              {expandedSections.woods && (
                <div className="p-4 border-t">
                  <WoodListTable />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
