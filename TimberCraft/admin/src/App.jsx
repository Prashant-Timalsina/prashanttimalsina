import React, { useContext } from "react";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import AddCategory from "./pages/AddCategory";
import AddWood from "./pages/AddWood";
import Product from "./pages/Product";
import UpdateProduct from "./pages/UpdateProduct";
import UpdateCategory from "./pages/UpdateCategory";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import UserList from "./pages/UserList";
import UpdateWood from "./pages/UpdateWood";
import ChatBox from "./pages/ChatBox";

export const currency = "NRs.";

const ProtectedRoute = () => {
  const { token } = useContext(AdminContext);
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return isLoginPage ? (
    // Login page: free, full screen, centered, no layout wrappers
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  ) : (
    // All other pages: keep current layout and CSS
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <ToastContainer />
      <Navbar />
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <Sidebar />
        <main className="flex-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[60vh]">
            <Routes>
              <Route path="/" element={<Login />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/add" element={<Add />} />
                <Route path="/updateProduct/:id" element={<UpdateProduct />} />
                <Route
                  path="/updateCategory/:id"
                  element={<UpdateCategory />}
                />
                <Route path="/updateWood/:id" element={<UpdateWood />} />
                <Route path="/addCategory" element={<AddCategory />} />
                <Route path="/addWood" element={<AddWood />} />
                <Route path="/list" element={<List />} />
                <Route path="/listuser" element={<UserList />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/chatbox" element={<ChatBox />} />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
