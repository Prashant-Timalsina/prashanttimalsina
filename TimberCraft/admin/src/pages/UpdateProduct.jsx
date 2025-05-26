import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets"; // For static assets like image placeholders
import { AdminContext } from "../context/AdminContext";

const UpdateProduct = () => {
  const { backendUrl, navigate, token } = useContext(AdminContext);
  const { id } = useParams();
  const [productData, setProductData] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [wood, setWood] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [categories, setCategories] = useState([]);
  const [woods, setWoods] = useState([]);

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/category/all`);
        if (response.data.success) {
          setCategories(response.data.categories);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Error fetching categories");
      }
    };

    fetchCategories();
  }, [backendUrl]);

  useEffect(() => {
    const fetchWoods = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/wood/all`);
        if (response.data.success) {
          setWoods(response.data.woods);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching woods:", error);
        toast.error("Error fetching woods");
      }
    };

    fetchWoods();
  }, [backendUrl]);

  // Fetch the product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/product/single/${id}`
        );
        if (response.data.success) {
          const product = response.data.product;
          setProductData(product);
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price);
          setCategory(
            product.category || (categories[0] && categories[0]._id) || ""
          ); // Ensure category ID is set
          setWood(product.wood || (woods[0] && woods[0]._id) || ""); // Ensure wood ID is set
          setLength(product.length);
          setBreadth(product.breadth);
          setHeight(product.height);

          if (product.image) {
            setImage1(product.image[0] || null);
            setImage2(product.image[1] || null);
            setImage3(product.image[2] || null);
            setImage4(product.image[3] || null);
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Error fetching product details");
      }
    };

    fetchProductDetails();
  }, [id, backendUrl, categories, woods]);

  const handleImageChange = (e, setImage) => {
    setImage(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("wood", wood);
    formData.append("length", length);
    formData.append("breadth", breadth);
    formData.append("height", height);

    if (image1 instanceof File) formData.append("image1", image1);
    if (image2 instanceof File) formData.append("image2", image2);
    if (image3 instanceof File) formData.append("image3", image3);
    if (image4 instanceof File) formData.append("image4", image4);

    try {
      const response = await axios.put(
        `${backendUrl}/api/product/update/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/product/${id}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error updating product:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return productData ? (
    <form
      onSubmit={handleUpdate}
      className="flex flex-col w-full items-start gap-3 p-6 bg-white shadow-md rounded-md"
    >
      <h1 className="text-2xl font-bold mb-4">Update Product</h1>
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[image1, image2, image3, image4].map((image, index) => (
            <label key={index} htmlFor={`image${index + 1}`}>
              <img
                className="w-20"
                src={
                  image instanceof File
                    ? URL.createObjectURL(image)
                    : image || assets.upload_area
                }
                alt="Upload"
              />
              <input
                onChange={(e) =>
                  handleImageChange(
                    e,
                    [setImage1, setImage2, setImage3, setImage4][index]
                  )
                }
                type="file"
                id={`image${index + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 border rounded-md"
          type="text"
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2 border rounded-md"
          placeholder="Enter product description"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Price</p>
        <input
          onChange={(e) => setPrice(e.target.value)}
          value={price}
          className="w-full max-w-[100px] px-3 py-2 border rounded-md"
          type="number"
          placeholder="1"
          min="1"
          required
        />
      </div>

      <div className="flex flex-col w-full gap-4 mb-4">
        <div className="flex flex-col w-full">
          <p className="mb-2">Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-[40%] max-w-[250px] px-3 py-2 border rounded-md"
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col w-full gap-4 mb-4">
        <div className="flex flex-col w-full">
          <p className="mb-2">Wood</p>
          <select
            onChange={(e) => setWood(e.target.value)}
            value={wood}
            className="w-[40%] max-w-[250px] px-3 py-2 border rounded-md"
            required
          >
            <option value="" disabled>
              Select wood
            </option>
            {woods.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 w-full">
        <div className="flex flex-col">
          <p className="mb-2">Length</p>
          <input
            onChange={(e) => setLength(e.target.value)}
            value={length}
            className="w-full max-w-[100px] px-3 py-2 border rounded-md"
            type="number"
            placeholder="0"
            min="1"
            required
          />
        </div>
        <div className="flex flex-col">
          <p className="mb-2">Breadth</p>
          <input
            onChange={(e) => setBreadth(e.target.value)}
            value={breadth}
            className="w-full max-w-[100px] px-3 py-2 border rounded-md"
            type="number"
            placeholder="0"
            min="1"
            required
          />
        </div>
        <div className="flex flex-col">
          <p className="mb-2">Height</p>
          <input
            onChange={(e) => setHeight(e.target.value)}
            value={height}
            className="w-full max-w-[100px] px-3 py-2 border rounded-md"
            type="number"
            placeholder="0"
            min="1"
            required
          />
        </div>
      </div>

      <div className="w-full flex justify-center">
        <button
          type="submit"
          className="w-36 py-3 mt-4 bg-black text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Update Product
        </button>
      </div>
    </form>
  ) : (
    <div>Loading...</div>
  );
};

export default UpdateProduct;
