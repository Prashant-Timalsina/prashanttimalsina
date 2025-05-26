import React, { useContext } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

const UserCustom = () => {
  const { navigate } = useContext(ShopContext);

  const toCustomOrder = () => {
    navigate("/custom-order");
  };

  return (
    <div className="relative md:flex md:flex-row my-12 shadow-2xl rounded-lg overflow-hidden">
      {/* Text Section */}
      <div
        className="absolute inset-0 flex justify-center items-center bg-yellow-800 bg-opacity-60 text-white text-base sm:text-2xl z-10 md:relative md:bg-transparent md:text-black md:w-1/2 transition-all duration-300 hover:bg-opacity-70 cursor-pointer"
        onClick={toCustomOrder}
      >
        <div className="flex justify-center items-center h-[20%] w-[60%] min-w-[200px] bg-white text-black text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
          <Title text1={"CUSTOM"} text2={"ORDER"} />
        </div>
      </div>

      {/* Image Section */}
      <div className="relative h-[500px] md:h-auto md:w-1/2">
        <img
          onClick={toCustomOrder}
          src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Brown wooden table with chairs in a well-lit room"
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>
  );
};

export default UserCustom;
