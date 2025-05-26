import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";

const AddWood = () => {
  const { backendUrl, navigate, token } = useContext(AdminContext);
  const [image1, setImage1] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [advantages, setAdvantages] = useState([""]);

  // Handles file selection for each image input
  const handleImageChange = (e, setImage) => {
    setImage(e.target.files[0]);
  };

  // Handles changes to the advantages input
  const handleAdvantageChange = (index, value) => {
    const newAdvantages = [...advantages];
    newAdvantages[index] = value;
    setAdvantages(newAdvantages);
  };

  // Adds a new advantage input
  const handleAddAdvantage = () => {
    setAdvantages([...advantages, ""]);
  };

  // Removes the last advantage input
  const handleRemoveAdvantage = () => {
    if (advantages.length > 1) {
      setAdvantages(advantages.slice(0, -1));
    }
  };

  // Saves the wood item
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("advantages", JSON.stringify(advantages));

    // Append the image to the form data
    if (image1) formData.append("image1", image1);

    try {
      const response = await axios.post(
        `${backendUrl}/api/wood/add`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice(0);
        setAdvantages([""]);
        setImage1(null); // Reset image after successful save
        navigate("/add");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding wood:", error);
      toast.error("Error adding wood");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md w-full max-w-md mx-auto">
      <button
        onClick={() => navigate("/add")}
        className="mb-4 text-blue-500 hover:underline"
      >
        &larr; Back to Add Product
      </button>
      <h2 className="text-2xl font-bold mb-4">Add Wood Name</h2>

      {/* Image upload section */}
      <div className="mb-4">
        <label className="block mb-2">Wood Image</label>
        <label htmlFor="woodImage1">
          <img
            className="w-20"
            src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
            alt="Upload"
          />
          <input
            onChange={(e) => handleImageChange(e, setImage1)}
            type="file"
            id="woodImage1"
            hidden
          />
        </label>
      </div>

      {/* Wood name and description */}
      <div className="mb-4">
        <label className="block mb-2">Wood Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter wood name"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Wood Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter wood description"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Wood Price</label>
        <input
          type="number"
          value={price}
          min={1}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter wood price"
        />
      </div>

      {/* Advantages */}
      <div className="mb-4">
        <label className="block mb-2">Characteristics</label>
        <div className="max-h-40 overflow-y-auto">
          <ol className="list-decimal pl-5">
            {advantages.map((advantage, index) => (
              <li key={index} className="mb-2">
                <input
                  value={advantage}
                  onChange={(e) => handleAdvantageChange(index, e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter advantage"
                />
              </li>
            ))}
          </ol>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddAdvantage}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleRemoveAdvantage}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            -
          </button>
        </div>
      </div>

      {/* Save and Cancel buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => navigate("/add")}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddWood;
