import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiTrash } from "react-icons/fi";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const Cart = () => {
  const { cartItems, cartCount, getCart, updateCart, currency } =
    useContext(ShopContext);

  const navigate = useNavigate();

  useEffect(() => {
    getCart();
    console.log("Cart items:", cartItems);
  }, []);

  const handleQuantityChange = (item, quantity) => {
    if (quantity < 0) return;
    updateCart(item.itemId, item.length, item.breadth, item.height, quantity);
  };

  const handleRemoveItem = (item) => {
    updateCart(item.itemId, item.length, item.breadth, item.height, 0);
    toast.info("Item removed from cart");
  };

  const handleCheckout = () => {
    if (cartCount === 0) {
      toast.error("Your cart is empty. Add items to proceed.");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="max-w-6xl my-auto py-6 flex flex-col lg:flex-row gap-6">
      {/* Cart Items Section - Fixed to the left */}
      <div className=" left-0 flex-1 space-y-4">
        <div className="text-2xl font-bold mb-4">
          <Title text1={"YOUR"} text2={"CART"} />
        </div>

        {cartCount === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => {
              const key = `${item.itemId}-${item.length}-${item.breadth}-${item.height}`;

              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-md"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center overflow-hidden rounded-lg">
                    <img
                      src={
                        item.product?.image[0] ||
                        item.product?.image ||
                        assets.profile
                      }
                      alt={item.product?.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 px-4">
                    <h3 className="font-semibold text-lg">
                      {item.product?.name || "Unknown Product"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Category: {item.product?.category || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Wood Type: {item.product?.wood || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Size: {item.length}cm × {item.breadth}cm × {item.height}cm
                    </p>
                  </div>

                  <div className="flex flex-row space-x-4">
                    <div className="flex flex-col items-center">
                      {/* Price */}
                      <div className="text-lg font-bold">
                        {currency}
                        {item.product?.price * item.quantity}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <button
                          onClick={() => {
                            if (item.quantity > 1)
                              handleQuantityChange(item, item.quantity - 1); // Ensure minimum quantity is 1
                          }}
                          className="w-8 h-8 sm:w-10 sm:h-10 border rounded-lg flex items-center justify-center hover:bg-gray-300 transition"
                        >
                          -
                        </button>
                        <span className="w-10 h-8 sm:w-12 sm:h-10 flex items-center justify-center border rounded-lg bg-gray-100 font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item, item.quantity + 1)
                          }
                          className="w-8 h-8 sm:w-10 sm:h-10 border rounded-lg flex items-center justify-center hover:bg-gray-300 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove Item */}
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FiTrash size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Section - Cart Total at Bottom */}
      <div className="lg:w-[30%] flex flex-col">
        <div className="mt-auto">
          <CartTotal />
          <button
            onClick={handleCheckout}
            className="mt-4 w-full py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-700 transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
