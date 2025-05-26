import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets"; // For static assets like image placeholders
import { AdminContext } from "../context/AdminContext";

const UpdateWood = ({ token }) => {
  const { backendUrl, navigate } = useContext(AdminContext);
  const { id } = useParams();
  const [woodData, setWoodData] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [advantages, setAdvantages] = useState([""]);
  const [image1, setImage1] = useState(null);

  // Fetch the wood details
  useEffect(() => {
    const fetchWoodDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/wood/single/${id}`);
        if (response.data.success) {
          const wood = response.data.wood;
          setWoodData(wood);
          setName(wood.name);
          setDescription(wood.description);
          setPrice(wood.price);
          setAdvantages(wood.advantages || [""]);
          setImage1(wood.images[0] || null);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching wood details:", error);
        toast.error("Error fetching wood details");
      }
    };

    fetchWoodDetails();
  }, [id]);

  const handleImageChange = (e, setImage) => {
    setImage(e.target.files[0]);
  };

  const handleAdvantageChange = (index, value) => {
    const newAdvantages = [...advantages];
    newAdvantages[index] = value;
    setAdvantages(newAdvantages);
  };

  const handleAddAdvantage = () => {
    setAdvantages([...advantages, ""]);
  };

  const handleRemoveAdvantage = () => {
    if (advantages.length > 1) {
      setAdvantages(advantages.slice(0, -1));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("advantages", JSON.stringify(advantages));

    if (image1 instanceof File) formData.append("image1", image1);

    try {
      const response = await axios.put(
        `${backendUrl}/api/wood/update/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/list`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error updating wood:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return woodData ? (
    <form
      onSubmit={handleUpdate}
      className="flex flex-col w-full items-start gap-3 p-6 bg-white shadow-md rounded-md"
    >
      <h1 className="text-2xl font-bold mb-4">Update Wood</h1>

      {/* Wood Image */}
      <div>
        <p className="mb-2">Wood Image</p>
        <label htmlFor="woodImage1">
          <img
            className="w-20"
            src={
              image1 instanceof File
                ? URL.createObjectURL(image1)
                : image1 || assets.upload_area
            }
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

      {/* Wood Name */}
      <div className="w-full">
        <p className="mb-2">Wood Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 border rounded-md"
          type="text"
          placeholder="Enter wood name"
          required
        />
      </div>

      {/* Wood Description */}
      <div className="w-full">
        <p className="mb-2">Wood Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2 border rounded-md"
          placeholder="Enter wood description"
          required
        />
      </div>

      {/* Wood Price */}
      <div className="w-full">
        <p className="mb-2">Wood Price</p>
        <input
          onChange={(e) => setPrice(e.target.value)}
          value={price}
          className="w-full max-w-[500px] px-3 py-2 border rounded-md"
          type="number"
          min="1"
          placeholder="Enter wood price"
          required
        />
      </div>

      {/* Advantages */}
      <div className="w-full">
        <p className="mb-2">Characteristics</p>
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

      <div className="w-full flex justify-center">
        <button
          type="submit"
          className="w-36 py-3 mt-4 bg-black text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Update Wood
        </button>
      </div>
    </form>
  ) : (
    <div>Loading...</div>
  );
};

export default UpdateWood;
