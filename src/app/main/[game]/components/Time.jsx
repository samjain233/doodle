import { socket } from "@/app/test/socketConn";
import React, { useState, useEffect } from "react";

const Time = () => {
  const [time, setTime] = useState(15);
  const [dangerText, setDangerText] = useState(false);

  const reduceTime = () => {
    setTime((prevTime) => {
      if (prevTime === 0) return prevTime;
      else return prevTime - 1;
    });
  };

  socket.on("setTime", (time) => {
    setTime(time);
  });

  useEffect(() => {
    setInterval(() => {
      reduceTime();
    }, 1000);
  }, []);

  useEffect(() => {
    if (time <= 10 && time % 2 !== 0) setDangerText(true);
    if (time <= 10 && time % 2 === 0) setDangerText(false);
    if (time > 10) setDangerText(false);
  }, [time]);
  return (
    <>
      <div
        className={`h-full w-full text-5xl flex justify-center items-center ${
          dangerText ? "text-red-700" : "text-white"
        } font-semibold`}
      >
        {time}
      </div>
    </>
  );
};

export default Time;
