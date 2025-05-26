import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const CategoryDisplay = () => {
  const { categories, products, navigate } = useContext(ShopContext);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategoryIndex(0);
    }
  }, [categories]);

  const productCount = (categoryId) => {
    return products.filter((product) => product.category === categoryId).length;
  };

  const handleCategoryClick = (index) => {
    setSelectedCategoryIndex(index);
  };

  const handleImageNav = () => {
    const selectedCategory = categories[selectedCategoryIndex].name;
    navigate(`/collection?category=${selectedCategory}`);
  };

  const NextClick = () => {
    setSelectedCategoryIndex((prev) => (prev + 1) % categories.length);
  };

  const PrevClick = () => {
    setSelectedCategoryIndex(
      (prev) => (prev - 1 + categories.length) % categories.length
    );
  };

  const selectedCategoryData = categories[selectedCategoryIndex];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <p className="text-center text-3xl font-bold mb-8 text-yellow-800">
        EXPLORE CATEGORIES
      </p>
      <div className="flex flex-wrap gap-4 items-center justify-center pb-8">
        {categories.map((category, index) => (
          <p
            key={category._id}
            onClick={() => handleCategoryClick(index)}
            className={`border-2 border-yellow-800 px-6 py-2 rounded-full cursor-pointer transition-all duration-300 ${
              selectedCategoryIndex === index
                ? "bg-yellow-800 text-white text-xl font-bold"
                : "hover:bg-yellow-800 hover:text-white"
            }`}
          >
            {category.name}
          </p>
        ))}
      </div>

      {selectedCategoryData && (
        <div className="relative flex justify-center items-center max-w-[80%] h-[55vh] min-h-[30vh] mb-4 mx-auto rounded-lg overflow-hidden shadow-xl">
          <img
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onClick={handleImageNav}
            src={selectedCategoryData.image}
            alt={selectedCategoryData.name}
          />
          <div className="absolute bottom-0 left-0 w-full h-[30%] flex flex-col justify-center items-center bg-black bg-opacity-70 text-white p-6 backdrop-blur-sm">
            <p className="text-3xl font-bold mb-2">
              {selectedCategoryData.name}
            </p>
            <p className="text-lg text-center mb-2">
              {selectedCategoryData.description}
            </p>
            <p className="text-lg font-semibold">
              {productCount(selectedCategoryData._id)} Products Available
            </p>
          </div>
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 bg-opacity-75 p-2 rounded-full"
            onClick={PrevClick}
          >
            <FaArrowLeft />
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 bg-opacity-75 p-2 rounded-full"
            onClick={NextClick}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryDisplay;
