import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets"; // For static assets like image placeholders
import { AdminContext } from "../context/AdminContext";

const UpdateCategory = () => {
  const { backendUrl, navigate, token } = useContext(AdminContext);
  const { id } = useParams();
  // const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryImage, setCategoryImage] = useState(null); // New state for category image
  const [loading, setLoading] = useState(true);

  // Fetch the category details
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/category/single/${id}`
        );
        if (response.data.success) {
          const category = response.data.category;
          setCategoryData(category);
          setName(category.name);
          setDescription(category.description);
          setPrice(category.price);
          setCategoryImage(category.image || null); // Set the category image if available
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
        toast.error("Error fetching category details");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [id, backendUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Authentication required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);

    if (categoryImage instanceof File) {
      formData.append("image", categoryImage); // Append the new image if it's a file
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/category/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Category updated successfully");
        navigate("/list");
      } else {
        toast.error(response.data.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.message || "Error updating category");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return categoryData ? (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleUpdate}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Update Category
          </h1>

          {/* Category Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>
            <div className="flex items-center gap-4">
              <img
                className="w-24 h-24 object-cover rounded-lg border"
                src={
                  categoryImage instanceof File
                    ? URL.createObjectURL(categoryImage)
                    : categoryImage || assets.upload_area
                }
                alt="Category"
              />
              <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                Change Image
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* Category Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter category name"
              required
            />
          </div>

          {/* Category Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter category description"
              rows="4"
              required
            />
          </div>

          {/* Category Price */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter price"
              min="1"
              step="0.1"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
            >
              Update Category
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default UpdateCategory;
