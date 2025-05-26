import React, { useEffect, useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { assets } from "../assets/assets"; // Import assets for fallback image

const ProductListTable = () => {
  const { backendUrl, navigate, token, fetchCategory, fetchWood } =
    useContext(AdminContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryNames, setCategoryNames] = useState({});
  const [woodNames, setWoodNames] = useState({});
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []); // Only run once

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`);
      let productsData = response.data.products;

      // Sort products alphabetically by name
      productsData = productsData.sort((a, b) => a.name.localeCompare(b.name));

      // Log all products with their images and IDs
      console.log("All Products with Images:");
      productsData.forEach((product) => {
        console.log({
          id: product._id,
          name: product.name,
          image: product.image,
          imageType: typeof product.image,
          isArray: Array.isArray(product.image),
          firstImage: Array.isArray(product.image)
            ? product.image[0]
            : product.image,
        });
      });

      setProducts(productsData);

      // Fetch category and wood names for each product
      const categoryPromises = productsData.map((product) =>
        fetchCategory(product.category)
      );
      const woodPromises = productsData.map((product) =>
        fetchWood(product.wood)
      );

      const categoryResults = await Promise.all(categoryPromises);
      const woodResults = await Promise.all(woodPromises);

      const categoryMap = {};
      const woodMap = {};

      productsData.forEach((product, index) => {
        categoryMap[product.category] = categoryResults[index];
        woodMap[product.wood] = woodResults[index];
      });

      setCategoryNames(categoryMap);
      setWoodNames(woodMap);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleShowProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const handleUpdateProduct = (id) => {
    navigate(`/updateProduct/${id}`);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/product/remove/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          toast.success("Product deleted successfully");
          // Remove the deleted product from the list without refetching all
          setProducts((prev) => prev.filter((p) => p._id !== id));
        } else {
          toast.error("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const handleImageError = (productId) => {
    console.log("Image load error for product:", productId);
    setImageErrors((prev) => ({
      ...prev,
      [productId]: true,
    }));
  };

  const getImageUrl = (product) => {
    console.log("Getting image URL for product:", product.name, {
      image: product.image,
      isArray: Array.isArray(product.image),
      firstImage: Array.isArray(product.image)
        ? product.image[0]
        : product.image,
    });

    if (!product.image) {
      console.log("No image found for product:", product.name);
      return assets.upload_area;
    }

    if (Array.isArray(product.image)) {
      if (product.image.length === 0) {
        console.log("Empty image array for product:", product.name);
        return assets.upload_area;
      }
      console.log(
        "Using first image from array for product:",
        product.name,
        product.image[0]
      );
      return product.image[0];
    }

    console.log("Using single image for product:", product.name, product.image);
    return product.image;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Table with scrollable body */}
      <div className="overflow-x-auto">
        <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Wood Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const imageUrl = getImageUrl(product);
                  console.log(
                    "Rendering product:",
                    product.name,
                    "with image URL:",
                    imageUrl
                  );

                  return (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={
                                imageErrors[product._id]
                                  ? assets.upload_area
                                  : imageUrl
                              }
                              alt={product.name}
                              onError={() => handleImageError(product._id)}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 sm:hidden">
                              {categoryNames[product.category]}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-900">
                          {categoryNames[product.category]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-sm text-gray-900">
                          {woodNames[product.wood]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-sm text-gray-900">
                          ${product.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleShowProduct(product._id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleUpdateProduct(product._id)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductListTable;
