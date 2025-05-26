import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const VerifyEmailPage = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const { backendUrl, navigate, setToken } = useContext(ShopContext);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/user/verify-email?token=${token}`
        );

        if (response.data.success) {
          toast.success("Email verified successfully!");
          localStorage.setItem("token", response.data.token); // optional
          setToken(response.data.token); // optional
          setTimeout(() => navigate("/"), 2000); // redirect after delay
        } else {
          toast.error(response.data.message || "Invalid or expired token.");
        }
      } catch (error) {
        toast.error("Verification failed. Please try again.");
        console.error("Email Verification Error:", error);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      toast.error("Invalid verification link.");
    }
  }, [token, backendUrl, navigate, setToken]);

  return (
    <div className="flex items-center justify-center h-screen text-gray-800">
      <p className="text-xl font-medium">
        Verifying your email, please wait...
      </p>
    </div>
  );
};

export default VerifyEmailPage;
