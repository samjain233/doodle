import React, { useEffect, useContext } from "react";
import { BsPlayCircleFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { socket } from "@/app/test/socketConn";
import globalStateContext from "@/app/States/GlobalStateManager";
import { AiFillBulb } from "react-icons/ai";

const BottomNavMenu = ({ roomId }) => {
  const { setGameStarted, isAdmin, gameStarted, guessWord } =
    useContext(globalStateContext);
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
    const data = {
      roomId: roomId,
      userWord: guessWord,
    };
    socket.emit("useHint", data);
  };
  return (
    <>
      <div className="h-full w-full flex items-center text-2xl">
        {isAdmin && !gameStarted && (
          <div
            className="cursor-pointer px-1 mx-1 hover:text-green-700 transition-all"
            onClick={() => handleStartClick()}
          >
            <BsPlayCircleFill />
          </div>
        )}
        <div
          className="cursor-pointer px-1 mx-1 hover:text-yellow-500 transition-all"
          onClick={() => handleUseHintClick()}
        >
          <AiFillBulb />
        </div>
      </div>
    </>
  );
};

export default BottomNavMenu;
