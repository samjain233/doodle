import { socket } from "@/app/test/socketConn";
import React, { useEffect } from "react";

const words = ["apple", "banana", "cat", "dragon fruit"];

const ChooseWord = ({roomId}) => {
  const handleWordClick = (index) => {
    // console.log(index);
    socket.emit("wordChoosed", { choosedWordIndex: index , roomId : roomId });
  };
  return (
    <>
      <div className="w-full h-full bg-gray-200/20 backdrop-blur-md">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="text-4xl m-4 text-gray-600 font-semibold">
            Choose a word ...
          </div>
          <div className="flex justify-center">
            {words.map((word, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    handleWordClick(index);
                  }}
                  className="bg-gray-500 text-white text-4xl px-4 py-2 m-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-600 transition-all"
                >
                  {word}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChooseWord;
