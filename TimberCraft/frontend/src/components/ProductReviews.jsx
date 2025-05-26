import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const ProductReviews = ({ productId }) => {
  const { backendUrl, token } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (token) {
      fetchUserReview();
    }
  }, [productId, token]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/feedback/product/${productId}`
      );
      if (response.data.success) {
        setReviews(response.data.feedback);
        setAverageRating(response.data.averageRating);
        setTotalReviews(response.data.totalRatings);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    }
  };

  const fetchUserReview = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/feedback/user/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success && response.data.feedback) {
        setUserReview(response.data.feedback);
        setRating(response.data.feedback.rating);
        setReviewText(response.data.feedback.review);
      }
    } catch (error) {
      console.error("Error fetching user review:", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!rating || !reviewText) {
      toast.error("Please provide both rating and review");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/feedback/add`,
        {
          productId,
          rating,
          review: reviewText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Review submitted successfully");
        fetchReviews();
        fetchUserReview();
        setReviewText("");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to update your review");
      return;
    }

    if (!rating || !reviewText) {
      toast.error("Please provide both rating and review");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `${backendUrl}/api/feedback/update/${userReview._id}`,
        {
          rating,
          review: reviewText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Review updated successfully");
        fetchReviews();
        fetchUserReview();
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!token) {
      toast.error("Please login to delete your review");
      return;
    }

    if (!userReview) {
      toast.error("No review to delete");
      return;
    }

    try {
      console.log("Attempting to delete review:", userReview._id);
      const response = await axios.delete(
        `${backendUrl}/api/feedback/delete/${userReview._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Delete response:", response.data);

      if (response.data.success) {
        toast.success("Review deleted successfully");
        setUserReview(null);
        setRating(0);
        setReviewText("");
        fetchReviews();
      } else {
        toast.error(response.data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete review. Please try again."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Average Rating and Total Reviews */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-5 h-5 ${
                index < Math.round(averageRating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-gray-600">
          {averageRating.toFixed(1)} ({totalReviews} reviews)
        </span>
      </div>

      {/* Review Form */}
      {token && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">
            {userReview ? "Update Your Review" : "Write a Review"}
          </h3>
          <form
            onSubmit={userReview ? handleUpdateReview : handleSubmitReview}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Rating:</span>
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRating(index + 1)}
                    className={`w-6 h-6 ${
                      index < rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isSubmitting
                  ? "Submitting..."
                  : userReview
                  ? "Update"
                  : "Submit"}
              </button>
              {userReview && (
                <button
                  type="button"
                  onClick={handleDeleteReview}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete Review
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                {review.userId?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-medium">
                  {review.userId?.name || "Anonymous"}
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`w-4 h-4 ${
                        index < review.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600">{review.review}</p>
            <p className="text-sm text-gray-400 mt-2">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
