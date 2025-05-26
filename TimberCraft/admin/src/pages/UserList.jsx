import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { assets } from "../assets/assets.js";

const UserList = () => {
  const { backendUrl, token } = useContext(AdminContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removeDialog, setRemoveDialog] = useState({
    open: false,
    userId: null,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.users);
        toast.success("Users fetched successfully!"); // Success toast
      } catch (err) {
        console.error("Error fetching users:", err); // Log the error
        toast.error("Failed to fetch users. Please try again later."); // Error toast
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [backendUrl, token]);

  // Handler for promote/demote
  const handleRoleChange = async (userId, action) => {
    const actingRole = localStorage.getItem("role");
    let newRole = null;
    if (action === "promote") newRole = "admin";
    if (action === "demote") newRole = "user";
    if (!newRole) return;
    try {
      const response = await axios.put(
        `${backendUrl}/api/user/updaterole/${userId}`,
        { actingRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user role.");
    }
  };

  const handleRemoveUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this user? This action cannot be undone."
      )
    )
      return;
    try {
      const response = await axios.delete(
        `${backendUrl}/api/user/remove/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message || "User removed successfully.");
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        toast.error(response.data.message || "Failed to remove user.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove user.");
    }
  };

  if (loading) return <p className="text-center">Loading users...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User List</h2>
      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="border p-4 rounded-lg shadow-md flex flex-col md:flex-row md:items-center bg-white hover:shadow-lg transition"
          >
            <img
              src={user.avatar ? user.avatar : assets.defaultImage}
              alt={user.name}
              className="w-16 h-16 rounded-full mx-auto md:mx-0 md:mr-4 mb-2 md:mb-0"
            />
            <div className="flex-1 flex flex-col items-center md:items-start">
              <div className="flex flex-col items-center md:items-start">
                <p className="font-semibold flex items-center gap-2">
                  {user.name}
                  {user.role && (
                    <span
                      className={`border px-2 py-0.5 rounded text-xs font-bold ml-2 ${
                        user.role === "admin"
                          ? "border-yellow-400 text-yellow-600 bg-yellow-50"
                          : "border-red-500 text-red-600 bg-red-50"
                      }`}
                    >
                      {user.role}
                    </span>
                  )}
                </p>

                {/* Email: show on md+ screens only */}
                <p className="text-gray-500 text-xs mt-1 hidden md:block lg:block">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3 md:mt-0 md:ml-auto md:items-center justify-center md:justify-end w-full md:w-auto">
              {/* Promote/Demote buttons */}
              {user.role === "user" && (
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                  onClick={() => handleRoleChange(user._id, "promote")}
                >
                  Promote
                </button>
              )}
              {user.role === "admin" &&
                localStorage.getItem("role") === "superadmin" && (
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    onClick={() => handleRoleChange(user._id, "demote")}
                  >
                    Demote
                  </button>
                )}
              {/* Remove user button (show for all except self) */}
              {user._id !== localStorage.getItem("userId") && (
                <button
                  className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800 text-xs"
                  onClick={() =>
                    setRemoveDialog({ open: true, userId: user._id })
                  }
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Remove User Dialog */}
      {removeDialog.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 flex flex-col items-center">
            <p className="mb-4 text-center text-lg font-semibold text-red-700">
              Are you sure you want to remove this user? This action cannot be
              undone.
            </p>
            <div className="flex gap-4 w-full justify-center">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold"
                onClick={() => {
                  handleRemoveUser(removeDialog.userId);
                  setRemoveDialog({ open: false, userId: null });
                }}
              >
                Remove Account
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 font-bold"
                onClick={() => setRemoveDialog({ open: false, userId: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
