import React from "react";
import Image from "../../src/assets/error/404.png";
import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div className="h-screen w-full flex items-center justify-center flex flex-col">
      <img className="max-w-full max-h-full" src={Image} alt="404 Error" />

      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Return to Home Page
      </Link>
    </div>
  );
}
