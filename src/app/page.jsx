"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import BrushImage from "./brushImage.png";
import { Poppins } from "next/font/google";
import Avatar from "./components/Avatar";
import UserDetail from "./components/UserDetail";

const poppins = Poppins({
  weight: "700",
  subsets: ["latin"],
});

const colorsArray = [
  "bg-yellow-500",
  "bg-orange-500",
  "bg-violet-600",
  "bg-gray-500",
  "bg-cyan-500",
  "bg-amber-500",
];

const beforeColorsArray = [
  "before:bg-green-500",
  "before:bg-blue-800",
  "before:bg-pink-400",
  "before:bg-lime-500",
  "before:bg-teal-800",
  "before:bg-rose-600",
];

const HomePage = () => {
  const [bgColor, setBgColor] = useState(0);
  const [bg2Color, setBg2Color] = useState(0);
  const [slideBar, setSlideBar] = useState(false);

  const changeColor1 = () => {
    setBgColor((prevBgColor) => (prevBgColor + 1) % colorsArray.length);
  };

  const changeColor2 = () => {
    setBg2Color((prevBgColor) => (prevBgColor + 1) % beforeColorsArray.length);
  };

  const setNextColor = () => {
    setSlideBar((prevSlideBar) => {
      if (prevSlideBar === false) {
        setTimeout(changeColor1, 1500);
      } else {
        setTimeout(changeColor2, 1500);
      }
      return !prevSlideBar;
    });
  };

  useEffect(() => {
    const fourSecondTimeInterval = setInterval(setNextColor, 4000);

    return () => {
      clearInterval(fourSecondTimeInterval);
    };
  }, []);
  return (
    <div
      className={`relative h-screen w-screen ${
        colorsArray[bgColor]
      } transition-all before:content-[''] before:h-full ${
        slideBar ? "before:w-full" : "before:w-0"
      } before:absolute before:top-0 before:left-0 ${
        beforeColorsArray[bg2Color]
      } before:transition-all before:duration-500`}
    >
      <div className="h-full w-full flex justify-center items-center">
        <div className="bg-white/30 backdrop-blur-sm w-[50%] rounded-2xl relative shadow-2xl">
          <div className="absolute top-[-10%] right-[-10%]">
            <Image src={BrushImage} height={100} width={200} alt="brushImage" />
          </div>
          <div
            className={`w-full text-6xl flex flex-col justify-center items-center text-white p-8 font-bold ${poppins.className}`}
          >
            MARS DOODLE
            <Avatar />
            <UserDetail />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HomePage;
