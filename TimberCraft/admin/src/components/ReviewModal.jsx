import React from "react";

const ReviewModal = ({ data, onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Review Product</h2>
        <div className="mb-4">
          <p>
            <strong>Name:</strong> {data.name}
          </p>
          <p>
            <strong>Description:</strong> {data.description}
          </p>
          <p>
            <strong>Price:</strong> ${data.price}
          </p>
          <p>
            <strong>Category:</strong> {data.category}
          </p>
          <p>
            <strong>Wood Name:</strong> {data.woodName}
          </p>
          <p>
            <strong>Dimensions:</strong> L: {data.length}, B: {data.breadth}, H:{" "}
            {data.height}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Edit
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
