import React, { useEffect, useContext, useState } from "react";
import { BsPlayCircleFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { socket } from "@/app/test/socketConn";
import globalStateContext from "@/app/States/GlobalStateManager";
import { AiFillBulb } from "react-icons/ai";
import { IoCopy } from "react-icons/io5";
import toast from "react-hot-toast";

const BottomNavMenu = ({ roomId }) => {
  const {
    setGameStarted,
    isAdmin,
    gameStarted,
    guessWord,
    presenter,
    displayHint,
    setDisplayHint,
    remainingHints,
    round,
  } = useContext(globalStateContext);

  const router = useRouter();

  useEffect(() => {
    socket.on("StartGame", (gameLink) => {
      setGameStarted(true);
      router.push(gameLink);
    });
  }, []);

  const handleStartClick = () => {
    if (isAdmin === false || gameStarted === true) return;
    socket.emit("controlStartGame", roomId);
  };

  const handleUseHintClick = () => {
    if (
      gameStarted === false ||
      displayHint === false ||
      presenter === true ||
      typeof remainingHints !== "number" ||
      remainingHints === 0
    )
      return;
    const data = {
      roomId: roomId,
      userWord: guessWord,
    };
    socket.emit("useHint", data);
  };

  const checkForMissingWord = async () => {
    let count = 0;
    Array.from(guessWord).forEach((elem) => {
      console.log(elem);
      if (elem === "*") {
        count++;
      }
    });
    if (count > 0) setDisplayHint(true);
    else setDisplayHint(false);
  };

  const handleCopyRoomIdClick = () => {
    const link = process.env.NEXT_PUBLIC_CLIENT + "?room=" + roomId;
    navigator.clipboard.writeText(link);
    toast.success("Copied to ClipBoard");
  };

  useEffect(() => {
    checkForMissingWord();
  }, [guessWord]);

  return (
    <>
      <div className="h-full w-full flex items-center text-2xl">
        <div
          className={`cursor-pointer px-1 mx-1  transition-all ${
            isAdmin && !gameStarted
              ? "opacity-100 hover:text-green-700"
              : "opacity-30"
          }`}
          onClick={() => handleStartClick()}
        >
          <BsPlayCircleFill />
        </div>
        <div className="h-[80%] border-r border-white border-solid"></div>
        <div
          className={`cursor-pointer px-1 mx-1 xl:mx-2 transition-all ${
            gameStarted &&
            !presenter &&
            displayHint &&
            typeof remainingHints === "number" &&
            remainingHints > 0
              ? "opacity-100 hover:text-yellow-500"
              : "opacity-30"
          }`}
          onClick={() => handleUseHintClick()}
        >
          <AiFillBulb />
        </div>
        <div className="p-1 mr-1 text-sm bg-gray-500 text-white rounded-full">
          {remainingHints}
        </div>
        <div className="h-[80%] border-r border-white border-solid"></div>
        <div className="text-xs mx-1 xl:mx-2 bg-gray-500 p-1 px-2 rounded">
          Round : {round}
        </div>
        <div className="h-[80%] border-r border-white border-solid"></div>
        <div className="text-xs mx-1 xl:mx-2 bg-gray-500 p-1 px-2 rounded flex justify-center items-center">
          Lobby : {roomId}
          <div className="ml-2 cursor-pointer" onClick={handleCopyRoomIdClick}>
            <IoCopy />
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNavMenu;
