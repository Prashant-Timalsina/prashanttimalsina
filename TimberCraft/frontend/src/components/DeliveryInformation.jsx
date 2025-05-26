import React from "react";
import Title from "./Title";

const DeliveryInformation = ({ formData, onChangeHandler }) => {
  return (
    <div className="flex-1 space-y-6">
      <div>
        <Title text1={"DELIVERY"} text2={"INFORMATION"} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          className="px-3 py-2 border border-gray-300 rounded-lg w-full"
          type="text"
          onChange={onChangeHandler}
          name="firstName"
          value={formData.firstName}
          placeholder="First Name"
          required
        />
        <input
          className="px-3 py-2 border border-gray-300 rounded-lg w-full"
          type="text"
          onChange={onChangeHandler}
          name="lastName"
          value={formData.lastName}
          placeholder="Last Name"
          required
        />
      </div>

      <input
        className="px-3 py-2 border border-gray-300 rounded-lg w-full"
        type="email"
        onChange={onChangeHandler}
        name="email"
        value={formData.email}
        placeholder="E-mail"
        required
      />
      <input
        className="px-3 py-2 border border-gray-300 rounded-lg w-full"
        type="text"
        onChange={onChangeHandler}
        name="phone"
        value={formData.phone}
        placeholder="Phone Number"
        required
      />

      <input
        className="px-3 py-2 border border-gray-300 rounded-lg w-full"
        type="text"
        onChange={onChangeHandler}
        name="street"
        value={formData.street}
        placeholder="Street Address"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          className="px-3 py-2 border border-gray-300 rounded-lg w-full"
          type="text"
          onChange={onChangeHandler}
          name="city"
          value={formData.city}
          placeholder="City"
          required
        />
        <input
          className="px-3 py-2 border border-gray-300 rounded-lg w-full"
          type="text"
          onChange={onChangeHandler}
          name="province"
          value={formData.province}
          placeholder="Province"
          required
        />
      </div>

      <input
        className="px-3 py-2 border border-gray-300 rounded-lg w-full"
        type="text"
        onChange={onChangeHandler}
        name="zipcode"
        value={formData.zipcode}
        placeholder="Zip Code"
        required
      />
    </div>
  );
};

export default DeliveryInformation;
