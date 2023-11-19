import React, { useContext, useRef, useEffect } from "react";
import globalStateContext from "../States/GlobalStateManager";
import randomstring from "randomstring";
import { socket } from "../test/socketConn";
import { useRouter } from "next/navigation";

const UserDetail = () => {
  const router = useRouter();
  const {
    userName,
    setUserName,
    setAdmin,
    setLobby,
    setRemainingHints,
    setRound,
  } = useContext(globalStateContext);

  const userNameBoxRef = useRef(null);

  const handlePlayClick = async () => {
    if (userName === "") {
      userNameBoxRef.current.focus();
      return;
    }
    //checking for available rooms
    console.log(process.env.NEXT_PUBLIC_SERVER);
    const findGameApiUrl = process.env.NEXT_PUBLIC_SERVER + "/api/findgame";
    const response = await fetch(findGameApiUrl);
    const { room, msg } = await response.json();
    if (room !== null) {
      socket.emit("socketConn", { roomId: room });
    }
  };

  const handleCreateRoom = async () => {
    if (userName === "") {
      userNameBoxRef.current.focus();
      return;
    }
    //creating new room
    const randomRoomId = randomstring.generate(7);
    console.log(randomRoomId);
    socket.emit("socketConn", { roomId: randomRoomId, userName: userName });
  };

  useEffect(() => {
    socket.on("statusSocketConn", (data) => {
      console.log(data);
      const { success, roomId, username } = data;
      if (success) {
        const data = {
          roomId: roomId,
          userName: username,
        };
        console.log(data);
        socket.emit("joinLobby", data);
        router.push("/lobby/" + roomId);
      }
    });
    socket.on("setAdmin", (data) => {
      if (data.setAdmin === true) setAdmin(true);
      else setAdmin(false);
    });

    socket.on("lobby", (lobbyUsers) => {
      setLobby(lobbyUsers);
    });

    socket.on("remainingHints", (data) => {
      console.log(data);
      setRemainingHints(data);
    });

    socket.on("roundNo", (data) => {
      setRound(data);
    });

    socket.on("disconnect", () => {
      console.log(socket.connected);
    });
    return () => {
      socket.removeAllListeners("statusSocketConn");
    };
  }, []);

  return (
    <>
      <div>
        <input
          type="text"
          className="text-black h-full w-full text-2xl py-2 px-8 rounded-2xl border border-black text-center"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          spellCheck="false"
          ref={userNameBoxRef}
        />
      </div>
      <div className="w-full h-full flex flex-row justify-center items-center text-lg mt-8">
        <button
          onClick={handleCreateRoom}
          className="bg-black px-8 py-2 rounded-2xl text-white mx-2 hover:px-12 transition-all"
        >
          Create Room
        </button>
        <button
          onClick={handlePlayClick}
          className="bg-black px-8 py-2 rounded-2xl text-white mx-2 hover:px-12 transition-all"
        >
          Play As Guest
        </button>
      </div>
    </>
  );
};

export default UserDetail;
