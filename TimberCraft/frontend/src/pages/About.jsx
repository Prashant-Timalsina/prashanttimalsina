import React from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title.jsx";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row items-center gap-16 p-8 bg-white rounded-2xl shadow-lg">
        {/* Left Side - Text Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-8">
          <div className="space-y-6">
            <div className="text-3xl sm:text-4xl font-bold">
              <Title text1={"ABOUT"} text2={"US"} />
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 text-lg leading-relaxed">
                Welcome to TimberCraft, your trusted partner in high-quality
                handcrafted furniture. With years of experience in the industry,
                we take pride in designing and delivering premium furniture
                pieces tailored to your needs.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our journey started with a passion for woodworking, and today,
                we blend craftsmanship with innovation to bring you timeless
                designs. Whether you need custom modifications or stocked
                furniture, we've got you covered.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="text-2xl sm:text-3xl font-bold mb-4">
              <Title text1={"OUR"} text2={"MISSION"} />
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              To create functional, aesthetic, and durable furniture that
              enhances the beauty of every space while maintaining
              sustainability and quality craftsmanship.
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1597072689227-8882273e8f6a?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Brown Wooden Table with Chairs"
            className="rounded-xl shadow-xl w-full h-auto object-cover"
          />
        </div>
      </div>

      <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <div className="text-2xl sm:text-3xl font-bold">
            <Title text1={"Meet"} text2={"Developer"} />
          </div>
          <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-gray-200">
            <img
              src="https://plus.unsplash.com/premium_photo-1738590561029-33c9c5d64af2?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Developer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-800">
              Prashant Timalsina
            </p>
            <p className="text-gray-600">Full Stack Developer of TimberCraft</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
