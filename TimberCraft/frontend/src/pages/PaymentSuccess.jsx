import React, { useEffect, useState, useContext, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [search] = useSearchParams();
  const dataQuery = search.get("data");
  const [data, setData] = useState({});
  const [orderDetails, setOrderDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();
  const { backendUrl } = useContext(ShopContext);
  const receiptRef = useRef();

  useEffect(() => {
    const processPayment = async () => {
      if (!dataQuery) {
        toast.error("Invalid payment data. Please try again.");
        navigate("/orders");
        return;
      }

      // Get token from localStorage
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      try {
        setIsProcessing(true);
        const resData = atob(dataQuery);
        const resObject = JSON.parse(resData);
        console.log("Payment Response:", resObject);

        // Extract orderId from transaction_uuid
        // Current format: "d186cea7-b655-43b1-8fa7-f2af8e1a34a6682c2dffbe181b7a2aad4b8c"
        // Order ID is the last 24 characters
        const transactionUuid = resObject.transaction_uuid;
        const orderId = transactionUuid.slice(-24); // Get the last 24 characters which is the order ID

        if (!orderId) {
          console.error("Invalid order ID in transaction");
          navigate("/orders");
          return;
        }

        setData({
          ...resObject,
          orderId,
        });

        // First fetch the current order data
        const orderResponse = await axios.get(
          `${backendUrl}/api/order/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!orderResponse.data.success) {
          throw new Error("Failed to fetch order data");
        }

        const currentOrder = orderResponse.data.order;
        console.log("Current Order:", currentOrder);

        const currentPayment = currentOrder.payment || 0;
        const newPaymentAmount = parseFloat(resObject.total_amount);
        const newTotalPayment = currentPayment + newPaymentAmount;

        console.log("Payment Details:", {
          currentPayment,
          newPaymentAmount,
          newTotalPayment,
        });

        // Now update with the new total payment
        const updateResponse = await axios.put(
          `${backendUrl}/api/order/payment`,
          {
            orderId,
            payment: newTotalPayment,
          },
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Update Response:", updateResponse.data);

        if (!updateResponse.data.success) {
          throw new Error(
            updateResponse.data.message || "Failed to update payment"
          );
        }

        // Fetch the updated order details
        const updatedOrderResponse = await axios.get(
          `${backendUrl}/api/order/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (updatedOrderResponse.data.success) {
          console.log("Updated Order:", updatedOrderResponse.data.order);
          setOrderDetails(updatedOrderResponse.data.order);
          toast.success("Payment processed successfully!");
        } else {
          throw new Error("Failed to fetch updated order");
        }
      } catch (error) {
        console.error("Error updating payment:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
          if (error.response.status === 403) {
            toast.error("Session expired. Please login again.");
            // Clear token and redirect to login
            localStorage.removeItem("token");
            navigate("/login");
          } else {
            toast.error(
              error.response.data.message || "Failed to process payment"
            );
          }
        } else {
          toast.error(
            error.message || "Failed to process payment. Please try again."
          );
        }
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [dataQuery, backendUrl, navigate]);

  const handleDownloadPdf = () => {
    if (!orderDetails) return;

    const input = receiptRef.current;
    const visibleWidth = input.offsetWidth;
    const visibleHeight = input.offsetHeight;
    const scaleFactor = 0.5;

    html2canvas(input, {
      scale: 2,
      useCORS: true,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdfWidth = visibleWidth * scaleFactor;
        const pdfHeight = visibleHeight * scaleFactor;

        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
          unit: "px",
          format: [pdfWidth, pdfHeight],
        });

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        pdf.save(`TimberCraft-${timestamp}.pdf`);
      })
      .catch((err) => {
        console.error("Error generating PDF:", err);
        toast.error("Failed to generate PDF receipt");
      });
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full space-y-8">
        <div ref={receiptRef} className="p-6 border rounded-lg bg-slate-50">
          <div className="text-center mb-6">
            <FaCheckCircle
              className="w-20 h-20 mx-auto mb-4 text-green-500 print:text-green-500"
              id="success-checkmark"
            />
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Payment Successful
            </h1>
            <p className="text-gray-700">Thank you for your purchase!</p>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Transaction Details
              </h2>
              <p className="text-gray-700">
                <span className="font-medium">Order ID:</span> {data.orderId}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">
                  Amount Paid (This Transaction):
                </span>{" "}
                Rs. {data.total_amount}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Transaction ID:</span>{" "}
                {data.transaction_uuid}
              </p>
            </div>

            {orderDetails && (
              <div className="bg-gray-100 p-4 rounded-md shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Order Summary
                </h2>
                <p className="text-gray-700">
                  <span className="font-medium">Total Order Amount:</span> Rs.{" "}
                  {orderDetails.amount.toFixed(2)}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">
                    Total Paid (All Transactions):
                  </span>{" "}
                  Rs. {orderDetails.payment.toFixed(2)}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Remaining Amount:</span> Rs.{" "}
                  {(orderDetails.amount - orderDetails.payment).toFixed(2)}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Payment Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      orderDetails.paymentStatus === "Paid"
                        ? "text-green-600"
                        : orderDetails.paymentStatus === "Partial"
                        ? "text-orange-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {orderDetails.paymentStatus}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-col space-y-3">
          {orderDetails && (
            <button
              onClick={handleDownloadPdf}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md transition duration-200 ease-in-out shadow-md flex items-center justify-center gap-2"
            >
              <FaCheckCircle className="inline-block mr-2 text-white text-lg" />
              Download Receipt (PDF)
            </button>
          )}
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition duration-200 ease-in-out shadow-md"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

// Add to the style section or global CSS if needed:
// #success-checkmark { color: #22c55e !important; }
