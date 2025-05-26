import { useState, useEffect } from "react";
import api from "../api";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products?keyword=${searchTerm}`);
        setResults(response.data.products);
      } catch (error) {
        console.error("Error fetching search results", error);
      }
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="p-4 w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full p-2 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      <ul className="mt-2">
        {results.map((item) => (
          <li key={item._id} className="p-2 border-b">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
