import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

const Payment = () => {
  const location = useLocation();
  const { amount, totalAmount, orderId } = location.state || {};
  const [paymentAmount, setPaymentAmount] = useState(amount || "");
  const [error, setError] = useState("");

  // Add signed fields
  const signedFields = "total_amount,transaction_uuid,product_code";

  const [formData, setFormData] = useState({
    amount: amount || "",
    tax_amount: "0",
    total_amount: amount || "",
    transaction_uuid: "",
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: "http://localhost:5173/payment-success",
    failure_url: "http://localhost:5173/payment-failure",
    signed_field_names: signedFields,
    signature: "",
    secret: "8gBm/:&EnhH.1/q",
  });

  const generateSignature = (data) => {
    const { total_amount, transaction_uuid, product_code, secret } = data;
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    return CryptoJS.enc.Base64.stringify(hash);
  };

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    const eightyPercentOfTotal = totalAmount * 0.8; // 80% of total amount
    const remainingAfterPayment = amount - value;

    if (value < 0.01) {
      setError(`Minimum payment must be at least Rs. 0.01`);
      setPaymentAmount(value);
    } else if (value > amount) {
      setError(`Payment cannot exceed remaining amount of Rs. ${amount}`);
      setPaymentAmount(value);
    } else if (remainingAfterPayment > eightyPercentOfTotal) {
      const minimumPayment = amount - eightyPercentOfTotal;
      setError(
        `Payment must be at least Rs. ${minimumPayment.toFixed(
          2
        )} to ensure remaining amount is not more than 80% of total`
      );
      setPaymentAmount(value);
    } else {
      setError("");
      setPaymentAmount(value);
    }
  };

  useEffect(() => {
    if (!amount || !orderId) return;

    // Combine uuidv4() with orderId to generate transaction_uuid
    const transactionUuid = `${uuidv4()}-${orderId}`;

    const updatedFormData = {
      ...formData,
      amount: paymentAmount || amount,
      total_amount: paymentAmount || amount,
      transaction_uuid: transactionUuid,
    };

    const signature = generateSignature(updatedFormData);

    setFormData({
      ...updatedFormData,
      signature,
    });
  }, [amount, orderId, paymentAmount]);

  return (
    <form
      action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      method="POST"
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-4 mt-10"
    >
      <h1 className="text-center text-xl font-semibold text-gray-700">
        Confirm Your Payment
      </h1>

      <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700">
        <p>
          <strong>Order ID:</strong> {orderId}
        </p>
        <p>
          <strong>Total Amount:</strong> Rs. {totalAmount}
        </p>
        <p>
          <strong>Remaining Amount:</strong> Rs. {amount}
        </p>
        <p className="text-sm text-blue-600 mt-1">
          Note: Payment must ensure remaining amount is not more than 80% of
          total (Rs. {(totalAmount * 0.8).toFixed(2)})
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Payment Amount
        </label>
        <input
          type="number"
          value={paymentAmount}
          onChange={handleAmountChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter payment amount"
          min={0.01}
          max={amount}
          step="0.01"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-sm text-gray-500">
          Allowed range: Rs.{" "}
          {Math.max(0.01, amount - totalAmount * 0.8).toFixed(2)} to Rs.{" "}
          {amount}
        </p>
      </div>

      <input type="hidden" name="amount" value={formData.amount} />
      <input type="hidden" name="tax_amount" value={formData.tax_amount} />
      <input type="hidden" name="total_amount" value={formData.total_amount} />
      <input
        type="hidden"
        name="transaction_uuid"
        value={formData.transaction_uuid}
      />
      <input type="hidden" name="product_code" value={formData.product_code} />
      <input
        type="hidden"
        name="product_service_charge"
        value={formData.product_service_charge}
      />
      <input
        type="hidden"
        name="product_delivery_charge"
        value={formData.product_delivery_charge}
      />
      <input type="hidden" name="success_url" value={formData.success_url} />
      <input type="hidden" name="failure_url" value={formData.failure_url} />
      <input
        type="hidden"
        name="signed_field_names"
        value={formData.signed_field_names}
      />
      <input type="hidden" name="signature" value={formData.signature} />

      <button
        type="submit"
        disabled={!!error || !paymentAmount}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Pay via E-Sewa
      </button>
    </form>
  );
};

export default Payment;
