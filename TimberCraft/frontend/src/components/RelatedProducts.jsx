import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ currentProductId }) => {
  const { backendUrl, currency } = useContext(ShopContext);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // First, fetch the current product details
        const currentProductResponse = await axios.get(
          `${backendUrl}/api/product/single/${currentProductId}`
        );

        if (!currentProductResponse.data.success) {
          throw new Error("Failed to fetch current product");
        }

        const currentProduct = currentProductResponse.data.product;
        const { category, wood } = currentProduct;

        // Fetch all products
        const allProductsResponse = await axios.get(
          `${backendUrl}/api/product/list`
        );
        if (!allProductsResponse.data.success) {
          throw new Error("Failed to fetch all products");
        }

        let allProducts = allProductsResponse.data.products.filter(
          (product) => product._id !== currentProductId
        );

        // Filter products by same category and wood
        let filteredProducts = allProducts.filter(
          (product) =>
            String(product.category) === String(category) &&
            String(product.wood) === String(wood)
        );

        // If we have less than 5 matching products, we need to fill the remaining slots
        if (filteredProducts.length < 5) {
          // Get products that match either category or wood
          const partialMatches = allProducts.filter(
            (product) =>
              (String(product.category) === String(category) ||
                String(product.wood) === String(wood)) &&
              !filteredProducts.some((fp) => fp._id === product._id)
          );

          // Shuffle the partial matches
          const shuffledPartialMatches = partialMatches.sort(
            () => Math.random() - 0.5
          );

          // Add partial matches until we have 5 products
          filteredProducts = [
            ...filteredProducts,
            ...shuffledPartialMatches.slice(0, 5 - filteredProducts.length),
          ];

          // If we still don't have 5 products, add random products
          if (filteredProducts.length < 5) {
            const remainingProducts = allProducts.filter(
              (product) =>
                !filteredProducts.some((fp) => fp._id === product._id)
            );
            const shuffledRemaining = remainingProducts.sort(
              () => Math.random() - 0.5
            );
            filteredProducts = [
              ...filteredProducts,
              ...shuffledRemaining.slice(0, 5 - filteredProducts.length),
            ];
          }
        }

        // Ensure we only show 5 products
        setRelatedProducts(filteredProducts.slice(0, 5));
      } catch (error) {
        console.error("Error fetching related products:", error);
        toast.error("Failed to load related products");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, backendUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {relatedProducts.map((product) => (
          <div key={product._id} className="w-full">
            <ProductItem
              id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              description={product.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
