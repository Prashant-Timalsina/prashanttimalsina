import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const WoodDisplay = () => {
  const { woods, products } = useContext(ShopContext);
  const [selectedWoodIndex, setSelectedWoodIndex] = useState(0);

  useEffect(() => {
    if (woods.length > 0) {
      setSelectedWoodIndex(0);
    }
  }, [woods]);

  const productCount = (woodId) => {
    return products.filter((product) => product.wood === woodId).length;
  };

  const handleWoodClick = (index) => {
    setSelectedWoodIndex(index);
  };

  const handleImageNav = () => {
    const selectedWood = woods[selectedWoodIndex].name;
    Navigate(`/collection?wood=${selectedWood}`);
  };

  const NextClick = () => {
    setSelectedWoodIndex((prev) => (prev + 1) % woods.length);
  };

  const PrevClick = () => {
    setSelectedWoodIndex((prev) => (prev - 1 + woods.length) % woods.length);
  };

  const selectedWoodData = woods[selectedWoodIndex];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
      <p className="text-center text-3xl font-bold mb-8 text-yellow-800">
        DISCOVER OUR WOODS
      </p>
      <div className="flex flex-wrap gap-4 items-center justify-center pb-8">
        {woods.map((wood, index) => (
          <p
            key={wood._id}
            onClick={() => handleWoodClick(index)}
            className={`border-2 border-yellow-800 px-6 py-2 rounded-full cursor-pointer transition-all duration-300 ${
              selectedWoodIndex === index
                ? "bg-yellow-800 text-white text-xl font-bold"
                : "hover:bg-yellow-800 hover:text-white"
            }`}
          >
            {wood.name}
          </p>
        ))}
      </div>

      {selectedWoodData && (
        <div className="relative flex justify-center items-center max-w-[80%] h-[55vh] min-h-[30vh] mb-4 mx-auto rounded-lg overflow-hidden shadow-xl">
          <img
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onClick={handleImageNav}
            src={selectedWoodData.images[0]}
            alt={selectedWoodData.name}
          />
          <div className="absolute bottom-0 left-0 w-full h-[50%] flex flex-row justify-between items-center bg-black bg-opacity-70 text-white p-6 backdrop-blur-sm">
            <div className="flex-1 pr-4">
              <p className="text-3xl font-bold mb-2">{selectedWoodData.name}</p>
              <p className="text-lg mb-2">{selectedWoodData.description}</p>
              <p className="text-lg font-semibold">
                {productCount(selectedWoodData._id)} Products Available
              </p>
            </div>
            <div className="flex-1 pl-4 border-l border-white">
              <p className="text-2xl font-bold mb-3">Advantages</p>
              <ul className="list-disc list-inside space-y-1">
                {selectedWoodData.advantages.map((advantage, index) => (
                  <li key={index} className="text-lg">
                    {advantage}
                  </li>
                ))}
              </ul>
            </div>
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

export default WoodDisplay;
