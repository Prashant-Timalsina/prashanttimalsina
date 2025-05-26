import React, { useContext } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

const CartTotal = () => {
  const { getTotalPrice, partialPayment, delivery_fee, currency } =
    useContext(ShopContext);

  const totalAmount = getTotalPrice() + delivery_fee;

  return (
    <div className="w-full border border-gray-300 p-6 rounded-lg shadow-md bg-white">
      <div className="text-2xl font-bold text-center mb-4">
        <Title text1={"CART"} text2={"TOTAL"} />
      </div>

      <div className="space-y-3">
        <div className="flex flex-row justify-between font-medium">
          <p>Minimum Deposit:</p>
          <p>
            {currency} {partialPayment}
          </p>
        </div>
        <hr />
        <div className="flex flex-row justify-between">
          <p>SubTotal:</p>
          <p>
            {currency} {getTotalPrice()}
          </p>
        </div>

        <div className="flex flex-row justify-between">
          <p>Delivery Charge:</p>
          <p>
            {currency} {delivery_fee}
          </p>
        </div>
        <hr />
        <div className="flex flex-row justify-between text-lg font-bold">
          <p>Total Cost:</p>
          <p>
            {currency} {totalAmount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
