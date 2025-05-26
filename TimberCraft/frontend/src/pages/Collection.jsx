import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { navigate, categories, woods, products } = useContext(ShopContext);

  const [sortType, setSortType] = useState("relevant");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedWoods, setSelectedWoods] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products || []);
  const location = useLocation();

  // Initialize filteredProducts when products change
  useEffect(() => {
    if (products && products.length > 0) {
      setFilteredProducts(products);
    }
  }, [products]);

  const filterAndSortProducts = () => {
    let filteredProducts = [...products];

    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const categoryName = categories.find(
          (cat) => cat._id === product.category
        )?.name;
        return categoryName && selectedCategories.includes(categoryName);
      });
    }

    if (selectedWoods.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const woodName = woods.find((wood) => wood._id === product.wood)?.name;
        return woodName && selectedWoods.includes(woodName);
      });
    }

    if (sortType === "low-high") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filteredProducts);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");
    if (category) {
      setSelectedCategories([category]);
    }
  }, [location]);

  useEffect(() => {
    if (products && products.length > 0) {
      filterAndSortProducts();
    }
  }, [products, selectedCategories, selectedWoods, sortType]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleWoodChange = (wood) => {
    setSelectedWoods((prev) =>
      prev.includes(wood) ? prev.filter((w) => w !== wood) : [...prev, wood]
    );
  };

  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row gap-4 pt-10 border-t"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Filter Options */}
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center gap-2">FILTERS</p>

        {/* Category Filter */}
        <div className="border border-gray-300 pl-5 py-3">
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm">
            {categories.map((category) => (
              <label key={category._id} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  className="w-3"
                  value={category.name}
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => handleCategoryChange(category.name)}
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>

        {/* Wood Type Filter */}
        <div className="border border-gray-300 pl-5 py-3 mt-4">
          <p className="mb-3 text-sm font-medium">WOOD TYPES</p>
          <div className="flex flex-col gap-2 text-sm">
            {woods.map((wood) => (
              <label key={wood._id} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  className="w-3"
                  value={wood.name}
                  checked={selectedWoods.includes(wood.name)}
                  onChange={() => handleWoodChange(wood.name)}
                />
                {wood.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <p className="text-sm text-gray-500">
            {filteredProducts.length} Products
          </p>

          {/* Product Sort for medium and larger screens */}
          <div className="hidden md:block">
            <select
              className="border-2 border-gray-300 text-sm px-2 max-w-[400px]"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] place-items-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductItem
                key={product._id}
                id={product._id}
                image={product.image}
                name={product.name}
                description={product.description}
                price={product.price}
              />
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-500 text-lg mb-2">No products found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Collection;
