import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
// import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";

const AddCategory = () => {
  const { backendUrl, navigate, token } = useContext(AdminContext);
  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  // const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);

    image && formData.append("image", image);

    try {
      const response = await axios.post(
        `${backendUrl}/api/category/add`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setImage(false);
        setDescription("");
        setPrice(0);
        navigate("/add");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category");
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
      <h2 className="text-2xl font-bold mb-4">Add Category</h2>
      <div className="mb-4">
        <label className="block mb-2">Category Image</label>
        <label htmlFor="categoryImage">
          <img
            className="w-20"
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt="Upload"
          />
          <input
            onChange={handleImageChange}
            type="file"
            id="categoryImage"
            hidden
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter category name"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Category Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter category description"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Category Price</label>
        <input
          type="number"
          value={price}
          min={1}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter category price"
        />
      </div>
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

export default AddCategory;
