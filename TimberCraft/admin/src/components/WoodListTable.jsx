import React, { useEffect, useState, useContext } from "react";
import { FaTrash } from "react-icons/fa";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const WoodListTable = () => {
  const { backendUrl, navigate, token } = useContext(AdminContext);
  const [woodNames, setWoodNames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [productsUsing, setProductsUsing] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    fetchWoodNames();
  }, []);

  const fetchWoodNames = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/wood/all`);
      setWoodNames(res.data.woods || []);
    } catch (error) {
      toast.error("Failed to fetch woods");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWood = (id) => {
    navigate(`/updateWood/${id}`);
  };

  const handleDeleteWood = async (id) => {
    // Check if any product uses this wood
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      const products = response.data.products || [];
      const usedProducts = products.filter((product) => product.wood === id);

      if (usedProducts.length > 0) {
        setProductsUsing(usedProducts);
        setModalTitle("Cannot delete wood. Products using this wood:");
        setShowModal(true);
        return;
      }
    } catch (error) {
      toast.error("Failed to check products for wood");
      return;
    }

    if (window.confirm("Are you sure you want to delete this wood?")) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/wood/remove/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setWoodNames((prev) => prev.filter((wood) => wood._id !== id));
        }
      } catch (error) {
        toast.error("Failed to delete wood");
      }
    }
  };

  if (loading) {
    return <div>Loading wood names...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              ></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {woodNames.length > 0 ? (
              woodNames.map((wood) => (
                <tr
                  key={wood._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="group relative">
                      <span className="cursor-pointer hover:underline">
                        {wood.name}
                      </span>
                      <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-white shadow-lg rounded-lg p-4 w-64 z-10">
                        <div className="flex gap-4">
                          <img
                            src={
                              Array.isArray(wood.images) &&
                              wood.images.length > 0
                                ? wood.images[0]
                                : wood.images || assets.defaultImage
                            }
                            alt={wood.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{wood.name}</p>
                            <p className="text-sm text-gray-600">
                              {wood.description}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Advantages:</span>{" "}
                              {wood.advantages}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleUpdateWood(wood._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleDeleteWood(wood._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        {/* <FaTrash className="w-4 h-4" /> */}
                        <img
                          className="w-3 h-3"
                          src={assets.close}
                          alt="trash"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                  No wood names found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-lg font-semibold mb-4">{modalTitle}</h2>
            <ul className="mb-4 max-h-60 overflow-y-auto">
              {productsUsing.map((product) => (
                <li key={product._id} className="mb-2">
                  <span className="font-medium">{product.name}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WoodListTable;
