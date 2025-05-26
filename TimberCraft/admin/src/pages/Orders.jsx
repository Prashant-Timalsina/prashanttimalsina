import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title.jsx";
import { AdminContext } from "../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { token, backendUrl, currency } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
  });

  const resultPerPage = 5;
  const navigate = useNavigate();

  // Add new state for image carousel
  const [activeImageIndex, setActiveImageIndex] = useState({});

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: resultPerPage,
      });

      // Add status filter if selected
      if (filters.status) {
        params.append("status", filters.status);
      }
      // Add payment status filter if selected
      if (filters.paymentStatus) {
        params.append("paymentStatus", filters.paymentStatus);
      }

      const response = await axios.get(
        `${backendUrl}/api/order/all?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [filters, currentPage, backendUrl, token]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const updateOrderLocally = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
    );
  };

  const statusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Order status updated successfully");
        updateOrderLocally(response.data.order);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update order status";
      toast.error(errorMsg);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      // Get the order details first
      const orderResponse = await axios.get(
        `${backendUrl}/api/order/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!orderResponse.data.success) {
        throw new Error("Failed to fetch order details");
      }

      const order = orderResponse.data.order;

      // Show warning for processing orders
      if (order.status === "processing") {
        const nonRefundableAmount = Number((order.amount * 0.2).toFixed(2));
        const confirmMessage = `Warning: This order is in processing status. If cancelled, 20% of the total amount (${currency} ${nonRefundableAmount}) will not be refunded. Do you want to proceed with cancellation?`;

        if (!window.confirm(confirmMessage)) {
          return; // User cancelled the confirmation
        }
      }

      const response = await axios.put(
        `${backendUrl}/api/order/cancel`,
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully");
        updateOrderLocally(response.data.order);
      }
    } catch (err) {
      toast.error("Failed to cancel order");
    }
  };

  const updatePayment = async (orderId, newPayment) => {
    try {
      // First fetch the current order data
      const orderResponse = await axios.get(
        `${backendUrl}/api/order/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!orderResponse.data.success) {
        throw new Error("Failed to fetch order data");
      }

      const currentOrder = orderResponse.data.order;
      const currentPayment = currentOrder.payment || 0;
      const totalPayment = currentPayment + newPayment;

      // Now update with the new total payment
      const updateResponse = await axios.put(
        `${backendUrl}/api/order/payment`,
        {
          orderId,
          payment: totalPayment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (updateResponse.data.success) {
        toast.success("Payment updated successfully.");
        updateOrderLocally(updateResponse.data.order);
      }
      // If update fails but doesn't throw, handle it here
      else {
        throw new Error("Failed to update payment");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update payment.";
      toast.error(msg);
    }
  };

  // Function to handle next image
  const handleNextImage = (itemId) => {
    setActiveImageIndex((prev) => {
      const currentIndex = prev[itemId] || 0;
      const item = orders
        .find((order) => order.items.find((item) => item._id === itemId))
        ?.items.find((item) => item._id === itemId);

      const totalImages = Array.isArray(item?.image) ? item.image.length : 1;
      return {
        ...prev,
        [itemId]: (currentIndex + 1) % totalImages,
      };
    });
  };

  // Function to handle previous image
  const handlePrevImage = (itemId) => {
    setActiveImageIndex((prev) => {
      const currentIndex = prev[itemId] || 0;
      const item = orders
        .find((order) => order.items.find((item) => item._id === itemId))
        ?.items.find((item) => item._id === itemId);

      const totalImages = Array.isArray(item?.image) ? item.image.length : 1;
      return {
        ...prev,
        [itemId]: (currentIndex - 1 + totalImages) % totalImages,
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Title text1={"YOUR"} text2={"ORDERS"} />
            <div className="flex flex-col gap-4">
              {/* Order Status Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleFilterChange({
                      target: { name: "status", value: "" },
                    })
                  }
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.status === ""
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Orders
                </button>
                <button
                  onClick={() =>
                    handleFilterChange({
                      target: { name: "status", value: "pending" },
                    })
                  }
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.status === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() =>
                    handleFilterChange({
                      target: { name: "status", value: "processing" },
                    })
                  }
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.status === "processing"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Processing
                </button>
                <button
                  onClick={() =>
                    handleFilterChange({
                      target: { name: "status", value: "delivered" },
                    })
                  }
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.status === "delivered"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Delivered
                </button>
                <button
                  onClick={() =>
                    handleFilterChange({
                      target: { name: "status", value: "cancelled" },
                    })
                  }
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.status === "cancelled"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Cancelled
                </button>
              </div>

              {/* Payment Status Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleFilterChange({
                      target: { name: "paymentStatus", value: "" },
                    })
                  }
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.paymentStatus === ""
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Payments
                </button>
                <button
                  onClick={() =>
                    handleFilterChange({
                      target: { name: "paymentStatus", value: "Pending" },
                    })
                  }
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.paymentStatus === "Pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Pending Payment
                </button>
                <button
                  onClick={() =>
                    handleFilterChange({
                      target: { name: "paymentStatus", value: "Partial" },
                    })
                  }
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.paymentStatus === "Partial"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Partial Payment
                </button>
                <button
                  onClick={() =>
                    handleFilterChange({
                      target: { name: "paymentStatus", value: "Paid" },
                    })
                  }
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.paymentStatus === "Paid"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Paid
                </button>
              </div>
            </div>
          </div>
          <p className="text-base font-semibold text-blue-600">
            Note: COD requires pre payment of 20%
          </p>

          {loading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders found{" "}
              {filters.status || filters.paymentStatus
                ? `with ${filters.status ? `status "${filters.status}"` : ""} ${
                    filters.status && filters.paymentStatus ? "and" : ""
                  } ${
                    filters.paymentStatus
                      ? `payment status "${filters.paymentStatus}"`
                      : ""
                  }`
                : ""}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {orders.map((order) => {
                  const isPaid = order.payment === order.amount;
                  const remaining = order.amount - (order.payment || 0);

                  return (
                    <div
                      key={order._id}
                      className="bg-white rounded-lg shadow-sm p-6 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            Order ID: {order._id}
                          </p>
                          <p className="text-sm text-gray-500">
                            Date: {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {order.status !== "cancelled" &&
                            order.status !== "delivered" && (
                              <>
                                {/* Dynamic Status Update Button */}
                                <div className="relative group">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      let nextStatus = "";
                                      if (order.status === "pending") {
                                        nextStatus = "approved";
                                      } else if (
                                        order.status === "approved" &&
                                        (order.paymentStatus.toLowerCase() ===
                                          "paid" ||
                                          order.paymentStatus.toLowerCase() ===
                                            "partial")
                                      ) {
                                        nextStatus = "processing";
                                      } else if (
                                        order.status === "processing" &&
                                        order.paymentStatus.toLowerCase() ===
                                          "paid"
                                      ) {
                                        nextStatus = "delivered";
                                      }

                                      if (nextStatus) {
                                        statusUpdate(order._id, nextStatus);
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-md text-sm text-white ${
                                      (order.status === "approved" &&
                                        order.paymentStatus.toLowerCase() ===
                                          "pending") ||
                                      (order.status === "processing" &&
                                        order.paymentStatus.toLowerCase() !==
                                          "paid")
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-500 hover:bg-blue-600"
                                    }
                                    `}
                                    disabled={
                                      (order.status === "approved" &&
                                        order.paymentStatus.toLowerCase() ===
                                          "pending") ||
                                      (order.status === "processing" &&
                                        order.paymentStatus.toLowerCase() !==
                                          "paid")
                                    }
                                  >
                                    {order.status === "pending"
                                      ? "Accept Order"
                                      : order.status === "approved" &&
                                        (order.paymentStatus.toLowerCase() ===
                                          "paid" ||
                                          order.paymentStatus.toLowerCase() ===
                                            "partial")
                                      ? "Mark as Processing"
                                      : order.status === "processing" &&
                                        order.paymentStatus.toLowerCase() ===
                                          "paid"
                                      ? "Mark as Delivered"
                                      : ""}
                                  </button>

                                  {order.status === "approved" &&
                                    order.paymentStatus.toLowerCase() ===
                                      "pending" && (
                                      <div className="absolute top-full left-0 mt-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded shadow-md z-10 whitespace-nowrap">
                                        Payment is pending for
                                        processing/delivery.
                                      </div>
                                    )}
                                  {order.status === "processing" &&
                                    order.paymentStatus.toLowerCase() !==
                                      "paid" && (
                                      <div className="absolute top-full left-0 mt-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded shadow-md z-10 whitespace-nowrap">
                                        Full payment required for delivery.
                                      </div>
                                    )}
                                </div>

                                {/* Reject Order Button */}
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    cancelOrder(order._id);
                                  }}
                                  className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600"
                                >
                                  Reject Order
                                </button>
                              </>
                            )}
                        </div>
                      </div>

                      {/* Order Status and Payment Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Status
                          </p>
                          <p
                            className={`text-sm font-semibold ${
                              order.status === "pending"
                                ? "text-yellow-600"
                                : order.status === "approved"
                                ? "text-blue-600"
                                : order.status === "processing"
                                ? "text-purple-600"
                                : order.status === "delivered"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Payment Status
                          </p>
                          <p
                            className={`text-sm font-semibold ${
                              order.paymentStatus === "Pending"
                                ? "text-yellow-600"
                                : order.paymentStatus === "Partial"
                                ? "text-orange-600"
                                : "text-green-600"
                            }`}
                          >
                            {order.paymentStatus}
                          </p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="flex overflow-x-auto gap-4 pt-4">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="min-w-[300px] flex-shrink-0 border rounded-lg p-4 shadow-sm space-y-2"
                          >
                            {/* Image display - handles single image or array */}
                            <div className="flex justify-center mb-4 relative">
                              {(() => {
                                console.log("Item:", item);
                                console.log("Image:", item.image);
                                console.log(
                                  "Is Array:",
                                  Array.isArray(item.image)
                                );
                                console.log(
                                  "Active Index:",
                                  activeImageIndex[item._id]
                                );

                                return item.image ? (
                                  <div className="relative w-full">
                                    <img
                                      src={
                                        Array.isArray(item.image)
                                          ? item.image[
                                              activeImageIndex[item._id] || 0
                                            ]
                                          : item.image
                                      }
                                      alt={`${
                                        item.name || "Custom Item"
                                      } - Image ${
                                        (activeImageIndex[item._id] || 0) + 1
                                      }`}
                                      className="w-full h-40 object-cover rounded"
                                    />
                                    {Array.isArray(item.image) &&
                                      item.image.length > 1 && (
                                        <>
                                          <button
                                            onClick={() =>
                                              handlePrevImage(item._id)
                                            }
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75"
                                          >
                                            ←
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleNextImage(item._id)
                                            }
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75"
                                          >
                                            →
                                          </button>
                                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                            {item.image.map((_, index) => (
                                              <div
                                                key={index}
                                                className={`w-2 h-2 rounded-full ${
                                                  index ===
                                                  (activeImageIndex[item._id] ||
                                                    0)
                                                    ? "bg-white"
                                                    : "bg-white bg-opacity-50"
                                                }`}
                                              />
                                            ))}
                                          </div>
                                        </>
                                      )}
                                  </div>
                                ) : null;
                              })()}
                            </div>

                            {/* Basic and Custom Details in Inline Flex */}
                            <div className="flex flex-wrap gap-4">
                              {/* Basic Item Details */}
                              <div className="flex-1 min-w-[150px]">
                                <p className="font-semibold">
                                  {item.name || "Custom Item"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Category: {item.category}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Wood: {item.wood}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Price: ${Number(item.price || 0).toFixed(2)}
                                </p>
                              </div>

                              {/* Custom Order Details */}
                              {item.isCustom && (
                                <div className="flex-1 min-w-[200px] border-l pl-4 space-y-1">
                                  <p className="text-sm font-medium text-gray-700">
                                    Custom Details:
                                  </p>
                                  {/* Dimensions */}
                                  {item.length !== undefined &&
                                    item.length !== null &&
                                    item.length !== 0 &&
                                    item.breadth !== undefined &&
                                    item.breadth !== null &&
                                    item.breadth !== 0 &&
                                    item.height !== undefined &&
                                    item.height !== null &&
                                    item.height !== 0 && (
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Dimensions:
                                        </p>
                                        <p className="text-sm">
                                          {item.length} x {item.breadth} x{" "}
                                          {item.height}
                                        </p>
                                      </div>
                                    )}
                                  {/* Color */}
                                  {item.color &&
                                    item.color.trim() !== "" &&
                                    item.color !== "0" && (
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Color:
                                        </p>
                                        <p className="text-sm">{item.color}</p>
                                      </div>
                                    )}
                                  {/* Coating */}
                                  {item.coating &&
                                    item.coating.trim() !== "" &&
                                    item.coating !== "0" && (
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Coating:
                                        </p>
                                        <p className="text-sm">
                                          {item.coating}
                                        </p>
                                      </div>
                                    )}
                                  {/* Drawers */}
                                  {item.numberOfDrawers !== undefined &&
                                    item.numberOfDrawers !== null &&
                                    item.numberOfDrawers !== 0 && (
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Drawers:
                                        </p>
                                        <p className="text-sm">
                                          {item.numberOfDrawers}
                                        </p>
                                      </div>
                                    )}
                                  {/* Cabinets */}
                                  {item.numberOfCabinets !== undefined &&
                                    item.numberOfCabinets !== null &&
                                    item.numberOfCabinets !== 0 && (
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Cabinets:
                                        </p>
                                        <p className="text-sm">
                                          {item.numberOfCabinets}
                                        </p>
                                      </div>
                                    )}
                                  {/* Handle Type */}
                                  {item.handleType &&
                                    item.handleType.trim() !== "" &&
                                    item.handleType !== "0" && (
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Handle Type:
                                        </p>
                                        <p className="text-sm">
                                          {item.handleType}
                                        </p>
                                      </div>
                                    )}
                                  {/* Leg Style */}
                                  {item.legStyle &&
                                    item.legStyle.trim() !== "" &&
                                    item.legStyle !== "0" && (
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Leg Style:
                                        </p>
                                        <p className="text-sm">
                                          {item.legStyle}
                                        </p>
                                      </div>
                                    )}
                                  {/* Description */}
                                  {item.description &&
                                    item.description.trim() !== "" && (
                                      <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                          Description:
                                        </p>
                                        <p className="text-sm">
                                          {item.description}
                                        </p>
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Total Amount
                            </p>
                            <p className="text-lg font-semibold">
                              {currency} {Number(order.amount).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Payment Made
                            </p>
                            <p className="text-lg font-semibold">
                              {currency} {Number(order.payment || 0).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Remaining
                            </p>
                            <p className="text-lg font-semibold">
                              {currency}{" "}
                              {Number(
                                order.amount - (order.payment || 0)
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-500">
                          Delivery Address
                        </p>
                        <p className="text-sm">
                          {order.address.street}, {order.address.city},{" "}
                          {order.address.zipcode}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(Math.max(currentPage - 1, 1));
                  }}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(Math.min(currentPage + 1, totalPages));
                  }}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
