import React from "react";
// import NewsLetterBox from "../components/NewsLetterBox";
import UserCustom from "../components/UserCustom";
import CategoryDisplay from "../components/CategoryDisplay";
import WoodDisplay from "../components/WoodDisplay";
// import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <UserCustom />
        <CategoryDisplay />
        <WoodDisplay />
        {/* <NewsLetterBox /> */}
      </main>
    </div>
  );
};

export default Home;
