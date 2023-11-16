import { socket } from "@/app/test/socketConn";
import React, { useEffect, useState } from "react";

const GuessWord = () => {
  const [guessWord, setGuessWord] = useState("");

  useEffect(()=>{
    socket.on("guessWord",(data)=>{
      setGuessWord(data);
    })
  },[])
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
