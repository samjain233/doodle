import React, { useState } from "react";

const GuessWord = () => {
  const [guessWord, setGuessWord] = useState("**b***6***");
  const map = Array.prototype.map;
  return (
    <>
      <div className="w-full h-full flex justify-center items-center overflow-y-auto">
        {map.call(guessWord, (letter) => {
          if (letter === "*")
            return (
              <div className="h-[50%] w-[10%] rounded-md border border-black mr-1 box-border"></div>
            );
          else if (letter === " ")
            return <div className="h-[50%] w-[5%] box-border"></div>;
          else {
            return (
              <div className="h-[50%] w-[10%] rounded-md border border-black mr-1 box-border text-black">
                <div className="w-full h-full flex justify-center items-center">
                  {letter}
                </div>
              </div>
            );
          }
        })}
      </div>
    </>
  );
};

export default GuessWord;
