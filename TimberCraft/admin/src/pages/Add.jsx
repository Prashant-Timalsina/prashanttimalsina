import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";

const AddProduct = () => {
  const { backendUrl, navigate, token } = useContext(AdminContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [category, setCategory] = useState("");
  const [wood, setWood] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [categories, setCategories] = useState([]);
  const [woods, setWoods] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log(token);

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
  }, []);

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
  }, []);

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (!file) return;

    // If the target image slot is empty, set it directly
    if (!setImage) {
      // Find the first empty image slot
      if (!image1) {
        setImage1(file);
      } else if (!image2) {
        setImage2(file);
      } else if (!image3) {
        setImage3(file);
      } else if (!image4) {
        setImage4(file);
      }
    } else {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
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

    image1 && formData.append("image1", image1);
    image2 && formData.append("image2", image2);
    image3 && formData.append("image3", image3);
    image4 && formData.append("image4", image4);

    // Debugging: Log form data before sending the request
    console.log("Form Data Submitted:");
    console.log({
      description,
      category,
      wood,
      length,
      breadth,
      height,
      price,
      images: [image1, image2, image3, image4].filter(Boolean), // Only include non-null images
    });

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setCategory("");
        setWood("");
        setLength("");
        setBreadth("");
        setHeight("");
        navigate("/add");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error in form submission: ",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full items-start gap-6"
        >
          <h1 className="text-2xl font-bold mb-6">Add Product</h1>
          <div className="w-full">
            <p className="mb-3 text-base font-medium">Upload Images</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <label htmlFor="image1" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors w-full aspect-square">
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={
                      !image1 ? assets.upload_area : URL.createObjectURL(image1)
                    }
                    alt="Upload"
                  />
                  <input
                    onChange={(e) => handleImageChange(e, setImage1)}
                    type="file"
                    id="image1"
                    hidden
                  />
                </div>
              </label>
              <label htmlFor="image2" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors w-full aspect-square">
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={
                      !image2 ? assets.upload_area : URL.createObjectURL(image2)
                    }
                    alt="Upload"
                  />
                  <input
                    onChange={(e) => handleImageChange(e, setImage2)}
                    type="file"
                    id="image2"
                    hidden
                  />
                </div>
              </label>
              <label htmlFor="image3" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors w-full aspect-square">
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={
                      !image3 ? assets.upload_area : URL.createObjectURL(image3)
                    }
                    alt="Upload"
                  />
                  <input
                    onChange={(e) => handleImageChange(e, setImage3)}
                    type="file"
                    id="image3"
                    hidden
                  />
                </div>
              </label>
              <label htmlFor="image4" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors w-full aspect-square">
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={
                      !image4 ? assets.upload_area : URL.createObjectURL(image4)
                    }
                    alt="Upload"
                  />
                  <input
                    onChange={(e) => handleImageChange(e, setImage4)}
                    type="file"
                    id="image4"
                    hidden
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="w-full">
            <p className="mb-2 text-base font-medium">Product Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
              type="text"
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="w-full">
            <p className="mb-2 text-base font-medium">Product Description</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 min-h-[100px]"
              placeholder="Enter product description"
              required
            />
          </div>

          <div className="w-full">
            <p className="mb-2 text-base font-medium">Price</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full max-w-[200px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
              type="number"
              placeholder="1"
              min="1"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="flex flex-col w-full">
              <p className="mb-2 text-base font-medium">Category</p>
              <div className="flex gap-4 items-center">
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}:{cat.price}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => navigate("/addCategory")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap text-sm"
                >
                  Add Category
                </button>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <p className="mb-2 text-base font-medium">Wood Name</p>
              <div className="flex gap-4 items-center">
                <select
                  onChange={(e) => setWood(e.target.value)}
                  value={wood}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="" disabled>
                    Select wood
                  </option>
                  {woods.map((w) => (
                    <option key={w._id} value={w._id}>
                      {w.name}:{w.price}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => navigate("/addWood")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap text-sm"
                >
                  Add Wood
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="flex flex-col">
              <p className="mb-2 text-base font-medium">Length</p>
              <input
                onChange={(e) => setLength(e.target.value)}
                value={length}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                type="number"
                placeholder="1"
                min="1"
                required
              />
            </div>
            <div className="flex flex-col">
              <p className="mb-2 text-base font-medium">Breadth</p>
              <input
                onChange={(e) => setBreadth(e.target.value)}
                value={breadth}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                type="number"
                placeholder="1"
                min="1"
                required
              />
            </div>
            <div className="flex flex-col">
              <p className="mb-2 text-base font-medium">Height</p>
              <input
                onChange={(e) => setHeight(e.target.value)}
                value={height}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                type="number"
                placeholder="1"
                min="1"
                required
              />
            </div>
          </div>

          <div className="w-full mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-base font-medium"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
