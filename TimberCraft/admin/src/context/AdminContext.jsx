import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [category, setCategory] = useState([]);
  const [wood, setWood] = useState([]);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = "NRs.";

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  const fetchCategory = async (categoryId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/category/single/${categoryId}`
      );
      setCategory(
        response.data.success ? response.data.category.name : "Unknown Category"
      );
      return response.data.success
        ? response.data.category.name
        : "Unknown Category";
    } catch (error) {
      // toast.error("Failed to fetch category data");
      console.error("Error fetching category:", error);
      return "Unknown Category";
    }
  };

  const fetchWood = async (woodId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/wood/single/${woodId}`
      );
      setWood(response.data.success ? response.data.wood.name : "Unknown Wood");
      return response.data.success ? response.data.wood.name : "Unknown Wood";
    } catch (error) {
      // toast.error("Failed to fetch wood data");
      console.error("Error fetching wood:", error);
      return "Unknown Wood";
    }
  };
  return (
    <AdminContext.Provider
      value={{
        token,
        setToken,
        navigate,
        backendUrl,
        category,
        wood,
        fetchCategory,
        fetchWood,
        currency,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
