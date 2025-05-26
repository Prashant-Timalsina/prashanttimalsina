import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title.jsx";
import { ShopContext } from "../context/ShopContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { token, backendUrl, currency } = useContext(ShopContext);
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

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: resultPerPage,
      });

      // Add status filter if selected
      if (filters.status) {
        params.append("status", filters.status.toLowerCase());
      }
      // Add payment status filter if selected
      if (filters.paymentStatus) {
        params.append("paymentStatus", filters.paymentStatus);
      }

      const response = await axios.get(
        `${backendUrl}/api/order/myorder?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(response.data.currentPage || 1);
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
  }, [backendUrl, token, currentPage, filters.status, filters.paymentStatus]);

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
    setCurrentPage(1); // Reset to first page when filter changes
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
        fetchOrders(currentPage);
      }
    } catch (err) {
      toast.error("Failed to cancel order");
    }
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
                  onClick={() => handleFilterChange("status", "")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.status === ""
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Orders
                </button>
                <button
                  onClick={() => handleFilterChange("status", "pending")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.status === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleFilterChange("status", "approved")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.status === "approved"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => handleFilterChange("status", "processing")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.status === "processing"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Processing
                </button>
                <button
                  onClick={() => handleFilterChange("status", "delivered")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.status === "delivered"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Delivered
                </button>
                <button
                  onClick={() => handleFilterChange("status", "cancelled")}
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
                  onClick={() => handleFilterChange("paymentStatus", "")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.paymentStatus === ""
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Payments
                </button>
                <button
                  onClick={() => handleFilterChange("paymentStatus", "Pending")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.paymentStatus === "Pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Pending Payment
                </button>
                <button
                  onClick={() => handleFilterChange("paymentStatus", "Partial")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.paymentStatus === "Partial"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Partial Payment
                </button>
                <button
                  onClick={() => handleFilterChange("paymentStatus", "Paid")}
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
                      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 space-y-4"
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
                          {(order.status === "approved" ||
                            order.status === "processing") &&
                            (order.paymentStatus === "Pending" ||
                              order.paymentStatus === "Partial") && (
                              <button
                                onClick={() => {
                                  const paymentData = {
                                    amount: remaining,
                                    totalAmount: order.amount,
                                    orderId: order._id,
                                  };
                                  navigate("/payment", { state: paymentData });
                                }}
                                className="bg-green-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-600"
                              >
                                Pay Now
                              </button>
                            )}
                          {order.status !== "delivered" &&
                            order.status !== "cancelled" && (
                              <button
                                onClick={() => cancelOrder(order._id)}
                                className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600"
                              >
                                Cancel Order
                              </button>
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

                      {/* Order Items */}
                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">
                          Order Items
                        </h3>
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="border rounded-lg p-4 space-y-2"
                          >
                            <div className="flex justify-between">
                              <div className="flex gap-4">
                                {item.isCustom &&
                                item.image &&
                                Array.isArray(item.image) &&
                                item.image.length > 0 ? (
                                  <img
                                    src={item.image[0]}
                                    alt={`${
                                      item.name || "Custom Item"
                                    } - Image 1`}
                                    className="w-24 h-24 object-cover rounded-lg shadow-sm"
                                  />
                                ) : !item.isCustom && item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name || "Product"}
                                    className="w-24 h-24 object-cover rounded-lg shadow-sm"
                                  />
                                ) : (
                                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400">
                                      No image
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium">
                                    {item.name || "Custom Item"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Category: {item.category}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Wood Type: {item.wood}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  {currency} {item.price}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>

                            {/* Custom Order Details */}
                            {item.isCustom && (
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-sm font-medium text-gray-700">
                                  Custom Details:
                                </p>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                  {item.length !== 0 &&
                                    item.breadth !== 0 &&
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
                                  {item.numberOfDrawers !== 0 && (
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Drawers:
                                      </p>
                                      <p className="text-sm">
                                        {item.numberOfDrawers}
                                      </p>
                                    </div>
                                  )}
                                  {item.numberOfCabinets !== 0 && (
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Cabinets:
                                      </p>
                                      <p className="text-sm">
                                        {item.numberOfCabinets}
                                      </p>
                                    </div>
                                  )}
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
                                </div>
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
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
