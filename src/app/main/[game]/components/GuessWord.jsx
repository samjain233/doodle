import globalStateContext from "@/app/States/GlobalStateManager";
import { socket } from "@/app/test/socketConn";
import React, { useEffect, useState, useContext } from "react";

const GuessWord = () => {
  const {guessWord , setGuessWord} = useContext(globalStateContext);

  useEffect(() => {
    socket.on("guessWord", (data) => {
      // console.log(data);
      if (data === null || data === undefined) setGuessWord("");
      else setGuessWord(data);
    });
  }, []);
  const map = Array.prototype.map;
  return (
    <>
      <div className="w-full h-full flex justify-center items-center overflow-y-auto">
        {map.call(guessWord, (letter) => {
          if (letter === "*")
            return (
              <div className="h-[30%] w-[5%] border-b-2 border-black mr-1 box-border"></div>
            );
          else if (letter === " ")
            return <div className="h-[50%] w-[5%] box-border"></div>;
          else {
            return (
              <div className="h-[30%] w-[5%] border-b-2 border-black mr-1 box-border text-black">
                <div className="w-full h-full flex justify-center items-center font-semibold">
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
