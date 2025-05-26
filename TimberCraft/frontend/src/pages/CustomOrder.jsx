import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets.js";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import DeliveryInformation from "../components/DeliveryInformation";
import uploadImage from "../utils/uploadImage.js";

const CustomProduct = () => {
  const { backendUrl, navigate, token, delivery_fee } = useContext(ShopContext);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [wood, setwood] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState([]);
  const [woods, setWoods] = useState([]);
  const [images, setImages] = useState([]);

  // Show guest visit toast when no token
  useEffect(() => {
    if (!token) {
      toast.info("Guest Visit ");
    }
  }, [token]);

  // New state variables for custom options
  const [color, setColor] = useState("");
  const [coating, setCoating] = useState("");
  const [numberOfDrawers, setNumberOfDrawers] = useState("");
  const [numberOfCabinets, setNumberOfCabinets] = useState("");
  const [handleType, setHandleType] = useState("");
  const [legStyle, setLegStyle] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    province: "",
    zipcode: "",
    phone: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prevImages) => {
        const newImages = [...prevImages];
        // Find the first empty slot
        const emptySlotIndex = newImages.findIndex((img) => !img);
        if (emptySlotIndex !== -1) {
          newImages[emptySlotIndex] = file;
        } else if (newImages.length < 4) {
          newImages.push(file);
        }
        return newImages;
      });
    }
  };

  const removeImage = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = null;
      // Shift remaining images to fill the gap
      const filteredImages = newImages.filter((img) => img);
      while (filteredImages.length < newImages.length) {
        filteredImages.push(null);
      }
      return filteredImages;
    });
  };

  const onChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
  }, [backendUrl, token]);

  useEffect(() => {
    const fetchWoods = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/wood/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
  }, [backendUrl, token]);

  const calculatePrice = () => {
    const selectedCategory = categories.find((c) => c._id === category);
    const selectedWood = woods.find((w) => w._id === wood);

    if (!selectedCategory || !selectedWood || !length || !breadth || !height) {
      toast.warning("Please select category, wood and enter dimensions");
      return;
    }

    // Calculate base price without quantity
    const basePrice =
      selectedCategory.price * selectedWood.price * length * breadth * height;
    setPrice(basePrice.toFixed(2));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!description || !category || !wood || !length || !breadth || !height) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!price) {
      toast.error("Please calculate price before submitting");
      return;
    }

    // Validate delivery information
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.street ||
      !formData.city ||
      !formData.province ||
      !formData.zipcode ||
      !formData.phone
    ) {
      toast.error("Please fill all delivery information fields");
      return;
    }

    try {
      const selectedCategory = categories.find((c) => c._id === category);
      const selectedWood = woods.find((w) => w._id === wood);

      const uploadedImages = [];
      for (const imageFile of images) {
        if (imageFile) {
          const url = await uploadImage(imageFile);
          if (url && typeof url === "string") uploadedImages.push(url);
        }
      }

      // Log uploaded images
      console.log("Uploaded Images:", uploadedImages);

      // Ensure all required fields are present and valid
      if (
        !description ||
        !selectedCategory ||
        !selectedWood ||
        !length ||
        !breadth ||
        !height ||
        !price
      ) {
        throw new Error("Missing required fields");
      }

      const orderItem = {
        name: description,
        category: selectedCategory.name,
        wood: selectedWood.name,
        length: Number(length),
        breadth: Number(breadth),
        height: Number(height),
        images: uploadedImages, // Send all images as an array
        quantity: Number(quantity),
        price: Number(price),
        isCustom: true,
      };

      // Only add optional fields if they have values
      if (color) orderItem.color = color;
      if (coating) orderItem.coating = coating;
      if (numberOfDrawers) orderItem.numberOfDrawers = Number(numberOfDrawers);
      if (numberOfCabinets)
        orderItem.numberOfCabinets = Number(numberOfCabinets);
      if (handleType) orderItem.handleType = handleType;
      if (legStyle) orderItem.legStyle = legStyle;

      const orderItems = [orderItem];

      console.log(orderItems);

      // Calculate total amount without delivery fee
      const totalAmount = Number(price) * Number(quantity);

      // Validate the final data structure
      const orderData = {
        items: orderItems,
        address: formData,
        amount: totalAmount,
      };

      // Log the exact data being sent
      console.log("Order Data being sent:", JSON.stringify(orderData, null, 2));

      const response = await axios.post(
        `${backendUrl}/api/order/custom`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setDescription("");
        setImages([]);
        setCategory("");
        setwood("");
        setLength("");
        setBreadth("");
        setHeight("");
        setPrice("");
        setQuantity(1);
        setColor("");
        setCoating("");
        setNumberOfDrawers("");
        setNumberOfCabinets("");
        setHandleType("");
        setLegStyle("");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          street: "",
          city: "",
          province: "",
          zipcode: "",
          phone: "",
        });
        navigate("/orders");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Full error response:", error.response);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col lg:flex-row gap-10"
    >
      {/* Left Side - Custom Product Details */}
      <div className="flex-1 space-y-6">
        {/* Product Details */}
        <div className="w-full border border-gray-300 p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-bold mb-4">Custom Product Details</h2>

          {/* Image Upload */}
          <div className="mb-4">
            <p className="mb-2">Upload Images (Design Reference only)</p>
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex flex-col items-center">
                  <label htmlFor={`image${index}`} className="cursor-pointer">
                    <img
                      className="w-[150px] h-[150px] object-cover border rounded-lg"
                      src={
                        images[index]
                          ? URL.createObjectURL(images[index])
                          : assets.upload_area
                      }
                      alt={`Image ${index + 1}`}
                    />
                    <input
                      onChange={handleImageChange}
                      type="file"
                      id={`image${index}`}
                      hidden
                      accept="image/*"
                    />
                  </label>
                  {images[index] && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="mt-2 px-2 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <p className="mb-2">Product Description</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter product description"
              required
            />
          </div>

          {/* New Customization Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color (Wood Finish/Paint)
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="E.g., Walnut, White"
                className="mt-1 block w-full p-2 border rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Coating
              </label>
              <input
                type="text"
                value={coating}
                onChange={(e) => setCoating(e.target.value)}
                placeholder="E.g., Matte, Glossy, Waterproof"
                className="mt-1 block w-full p-2 border rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Drawers
              </label>
              <input
                type="number"
                value={numberOfDrawers}
                onChange={(e) => setNumberOfDrawers(e.target.value)}
                placeholder="E.g., 2"
                className="mt-1 block w-full p-2 border rounded-md shadow-sm"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Cabinets
              </label>
              <input
                type="number"
                value={numberOfCabinets}
                onChange={(e) => setNumberOfCabinets(e.target.value)}
                placeholder="E.g., 1"
                className="mt-1 block w-full p-2 border rounded-md shadow-sm"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Handle Type
              </label>
              <input
                type="text"
                value={handleType}
                onChange={(e) => setHandleType(e.target.value)}
                placeholder="E.g., Brass, Steel, None"
                className="mt-1 block w-full p-2 border rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Leg Style
              </label>
              <input
                type="text"
                value={legStyle}
                onChange={(e) => setLegStyle(e.target.value)}
                placeholder="E.g., Tapered, Turned, Block"
                className="mt-1 block w-full p-2 border rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Category & Wood Selection */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="mb-2">Category</p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}: {cat.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2">Wood Name</p>
              <select
                onChange={(e) => setwood(e.target.value)}
                value={wood}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="" disabled>
                  Select wood
                </option>
                {woods.map((wood) => (
                  <option key={wood._id} value={wood._id}>
                    {wood.name}: {wood.price}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              ["Length", setLength],
              ["Breadth", setBreadth],
              ["Height", setHeight],
            ].map(([label, setter]) => (
              <div key={label}>
                <p className="mb-2">{label}</p>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border rounded-md"
                  onChange={(e) => setter(e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Price Calculation */}
          <div className="flex items-center gap-4 mb-4">
            <button
              className="border px-3 py-2"
              type="button"
              onClick={calculatePrice}
            >
              Calculate Price
            </button>
            <span className="text-lg font-semibold">
              Price: <span className="underline font-bold px-3">{price}</span>
            </span>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <p className="mb-2">
              Quantity{"  "}
              <span className="text-red-500 text-sm">
                (Quantity is not calculated in price)
              </span>
            </p>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="w-full text-end mt-8">
          <p className="text-base font-semibold text-blue-600">
            Note: COD requires pre payment of 20%
          </p>
          <button
            type="submit"
            className="bg-black text-white px-16 py-3 text-sm"
          >
            PLACE ORDER
          </button>
        </div>
      </div>

      {/* Right Side - Delivery Information */}
      <DeliveryInformation
        formData={formData}
        onChangeHandler={onChangeHandler}
      />
    </form>
  );
};

export default CustomProduct;
