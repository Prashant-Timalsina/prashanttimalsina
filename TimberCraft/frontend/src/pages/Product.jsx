import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import RelatedProducts from "../components/RelatedProducts";
import ProductReviews from "../components/ProductReviews";

const Product = () => {
  const {
    addToCart,
    currency,
    product,
    category,
    wood,
    fetchProductData,
    token,
    favorites,
    addToFavorites,
    removeFromFavorites,
  } = useContext(ShopContext);

  const { id } = useParams();
  const productId = String(id);

  const [image, setImage] = useState("");
  const [activeTab, setActiveTab] = useState("related");

  useEffect(() => {
    if (productId) {
      fetchProductData(productId);
    }
  }, [favorites, productId]);

  useEffect(() => {
    if (product?.image?.length) {
      setImage(product.image[0]);
    }
  }, [product]);

  const isFavorite = favorites.some((fav) => fav._id === productId);

  const handleToggleFavorite = async () => {
    if (!token) {
      toast.error("Please login to add favorites");
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(productId, token);
        toast.success("Removed from favorites");
      } else {
        await addToFavorites(productId, token);
        toast.success("Added to favorites");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites");
    }
  };

  return product ? (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Product Data */}
          <div className="flex gap-12 flex-col lg:flex-row">
            {/* Product Images */}
            <div className="flex-1">
              <div className="flex flex-col-reverse gap-4 lg:flex-row">
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:w-24">
                  {product.image.map((item, index) => (
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
                    alt={product.name}
                    className="w-full h-[400px] object-cover rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
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
              </div>

              <div className="border-t border-b py-4">
                <p className="text-3xl font-bold text-gray-900">
                  {currency} {product.price}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Dimensions
                </h3>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Length</p>
                    <p className="font-medium">{product.length || "-"} cm</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Breadth</p>
                    <p className="font-medium">{product.breadth || "-"} cm</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-medium">{product.height || "-"} cm</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Description
                </h3>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() =>
                    addToCart(
                      product._id,
                      product.length,
                      product.breadth,
                      product.height
                    )
                  }
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
                    isFavorite
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {isFavorite ? "❤️ Remove" : "🤍 Add to Favorites"}
                </button>
              </div>

              <div className="text-sm text-gray-500 space-y-2">
                <p>✅ 100% Original Product</p>
                <p>💰 Cash on delivery available</p>
              </div>
            </div>
          </div>

          {/* Related Products & Reviews Section */}
          <div className="mt-12">
            <div className="flex border-b">
              <button
                className={`px-5 py-3 text-sm font-medium transition-colors duration-300 ${
                  activeTab === "related"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("related")}
              >
                Related Products
              </button>
              <button
                className={`px-5 py-3 text-sm font-medium transition-colors duration-300 ${
                  activeTab === "reviews"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
            </div>
            <div className="mt-6">
              {activeTab === "related" ? (
                <RelatedProducts
                  category={category}
                  wood={wood}
                  currentProductId={id}
                />
              ) : (
                <ProductReviews productId={productId} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default Product;
