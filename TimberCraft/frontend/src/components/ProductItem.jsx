import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, description }) => {
  const { currency } = useContext(ShopContext);

  return (
    <div className="border p-4 rounded-md shadow-md w-full max-w-[300px] cursor-pointer">
      <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
        <div className="overflow-hidden w-full h-48 relative">
          <img
            className="w-full h-full object-cover hover:scale-110 transition ease-in-out"
            src={image[0]}
            alt={name}
          />
        </div>
        <h2 className="text-lg font-bold pt-3 pb-1">{name}</h2>
        <p className="text-gray-500 text-sm">{description}</p>
        <p className="text-sm font-medium">
          {currency}
          {price}
        </p>
      </Link>
    </div>
  );
};

export default ProductItem;
