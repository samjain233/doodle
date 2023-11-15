import React,{useEffect} from "react";
import { BsPlayCircleFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { socket } from "@/app/test/socketConn";

const BottomNavMenu = ({ roomId }) => {
  const router = useRouter();
  useEffect(() => {
    socket.on("StartGame", (gameLink) => {
      router.push(gameLink);
    });
  }, []);
  const handleStartClick = () => {
    socket.emit("controlStartGame", roomId);
  };
  return (
    <>
      <div
        className="h-full flex items-center text-2xl cursor-pointer"
        onClick={() => handleStartClick()}
      >
        <BsPlayCircleFill />
      </div>
    </>
  );
};

export default BottomNavMenu;
