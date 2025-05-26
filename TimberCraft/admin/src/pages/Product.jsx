import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const Product = () => {
  const { backendUrl, currency, token } = useContext(AdminContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [category, setCategory] = useState("");
  const [wood, setWood] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Fetch product data from the backend
  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${backendUrl}/api/product/single/${id}`
      );
      if (response.data.success) {
        const product = response.data.product;
        setProductData(product);
        setImage(product.image[0]);

        if (product.category) {
          fetchCategory(product.category);
        }
        if (product.wood) {
          fetchWood(product.wood);
        }
        fetchReviews(product._id);
      } else {
        setError("Failed to fetch product data");
        toast.error("Failed to fetch product data");
      }
    } catch (error) {
      setError("Error fetching product data");
      toast.error("Error fetching product data");
      console.error("Error fetching product data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      setLoadingReviews(true);
      const response = await axios.get(
        `${backendUrl}/api/feedback/product/${productId}`
      );
      if (response.data.success) {
        setReviews(response.data.feedback);
      } else {
        toast.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Error fetching reviews");
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchCategory = async (categoryId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/category/single/${categoryId}`
      );
      if (response.data.success) {
        setCategory(response.data.category.name);
      } else {
        console.error("Error fetching category:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const fetchWood = async (woodId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/wood/single/${woodId}`
      );
      if (response.data.success) {
        setWood(response.data.wood.name);
      } else {
        console.error("Error fetching wood:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching wood:", error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const handleUpdate = (id) => {
    navigate(`/updateProduct/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return productData ? (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Product Data */}
          <div className="flex gap-12 flex-col lg:flex-row">
            {/* Product Images */}
            <div className="flex-1">
              <div className="flex flex-col-reverse gap-4 lg:flex-row">
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:w-24">
                  {productData.image.map((item, index) => (
                    <img
                      key={index}
                      onClick={() => setImage(item)}
                      src={item}
                      alt={`Product image ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all duration-300 ${
                        image === item
                          ? "ring-2 ring-blue-500"
                          : "hover:opacity-75"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <img
                    src={image}
                    alt={productData.name}
                    className="w-full h-[400px] object-cover rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {productData.name}
                </h1>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-500">Category:</span>
                  <span className="text-sm font-medium">
                    {category || "Loading..."}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-gray-500">Wood Type:</span>
                  <span className="text-sm font-medium">
                    {wood || "Loading..."}
                  </span>
                </div>
                {reviews.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Overall Rating:
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={`text-lg ${
                            index <
                            Math.round(
                              reviews.reduce(
                                (acc, review) => acc + review.rating,
                                0
                              ) / reviews.length
                            )
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-sm text-gray-600">
                        ({reviews.length}{" "}
                        {reviews.length === 1 ? "review" : "reviews"})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-b py-4">
                <p className="text-3xl font-bold text-gray-900">
                  {currency} {productData.price}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Dimensions
                </h3>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Length</p>
                    <p className="font-medium">
                      {productData.length || "-"} cm
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Breadth</p>
                    <p className="font-medium">
                      {productData.breadth || "-"} cm
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-medium">
                      {productData.height || "-"} cm
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Description
                </h3>
                <p className="mt-2 text-gray-600">{productData.description}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleUpdate(productData._id)}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                >
                  Update Product
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Product Reviews
            </h2>
            {loadingReviews ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">
                            {review.userId.name}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, index) => (
                            <span
                              key={index}
                              className={`text-lg ${
                                index < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="mt-2 text-gray-600">{review.review}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No reviews yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Product;
