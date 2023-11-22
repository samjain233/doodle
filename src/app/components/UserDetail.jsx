import React, { useContext, useRef, useEffect, useState } from "react";
import globalStateContext from "../States/GlobalStateManager";
import randomstring from "randomstring";
import { socket } from "../test/socketConn";
import { useRouter, useSearchParams } from "next/navigation";
import { joinLobbyAudio } from "../audioController";
import toast from "react-hot-toast";
import { GrLinkPrevious } from "react-icons/gr";

const UserDetail = () => {
  const [roomId, setRoomId] = useState("");
  const [displayRoomId, setDisplayRoomId] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    userName,
    setUserName,
    setAdmin,
    setLobby,
    setRemainingHints,
    setRound,
    setLoading,
    loading,
    setChat,
  } = useContext(globalStateContext);

  const userNameBoxRef = useRef(null);
  const roomIdInputBoxRef = useRef(null);

  const handlePlayClick = async () => {
    if (userName === "") {
      userNameBoxRef.current.focus();
      toast.error("Please Enter username first");
      return;
    }
    //checking for available rooms
    const findGameApiUrl = process.env.NEXT_PUBLIC_SERVER + "/api/findgame";
    const response = await fetch(findGameApiUrl);
    const { room, msg } = await response.json();
    if (room !== null) {
      socket.emit("socketConn", { roomId: room, userName: userName });
      toast.success("Room find Successful : " + room);
    } else {
      toast.error(msg);
    }
  };

  const handleCreateRoom = async () => {
    if (userName === "") {
      userNameBoxRef.current.focus();
      toast.error("Please Enter username first");
      return;
    }
    //creating new room
    const randomRoomId = randomstring.generate(7);
    socket.emit("socketConn", { roomId: randomRoomId, userName: userName });
    toast.success("Successfull Created Room : " + randomRoomId);
  };

  const handleJoinLobbyClick = async () => {
    if (userName === "") {
      userNameBoxRef.current.focus();
      toast.error("Please Enter username first");
      return;
    }
    if (userName !== "") setDisplayRoomId(true);
    if (roomId === "") {
      setDisplayRoomId(true);
      // roomIdInputBoxRef.current.focus();
      toast("Enter Room Id");
      return;
    }
    //checking for requested room
    const findSpecificGameApiUrl =
      process.env.NEXT_PUBLIC_SERVER + "/api/findgame/" + roomId;
    const response = await fetch(findSpecificGameApiUrl);
    const { room, msg } = await response.json();
    if (room !== null) {
      socket.emit("socketConn", { roomId: room, userName: userName });
      toast.success("Room find Successful : " + room);
    } else {
      toast.error(msg);
    }
  };

  useEffect(() => {
    socket.on("statusSocketConn", (data) => {
      const { success, roomId, username } = data;
      if (success) {
        const senddata = {
          roomId: roomId,
          userName: username,
        };
        socket.emit("joinLobby", senddata);
        toast.loading("Joining lobby ....");
        setLoading(true);
        router.push("/lobby/" + roomId);
      }
    });
    socket.on("setAdmin", (data) => {
      if (data.setAdmin === true) {
        setAdmin(true);
        toast("You are the Admin");
      } else setAdmin(false);
    });

    socket.on("lobby", (lobbyUsers) => {
      setLobby(lobbyUsers);
      joinLobbyAudio();
    });

    socket.on("remainingHints", (data) => {
      console.log(data);
      setRemainingHints(data);
    });

    socket.on("roundNo", (data) => {
      setRound(data);
    });

    socket.on("recievedChatData", (data) => {
      const { userName, chatMsg } = data;
      setChat((prevChat) => {
        return [...prevChat, { userName, chatMsg }];
      });
    });

    socket.on("disconnect", () => {
      if (socket.connected === false) {
        toast.error("disconnected from the server");
        socket.removeAllListeners();
        console.log(socket.connected);
        router.push("/");
      }
    });

    const searchRoom = searchParams.get("room");
    if (searchRoom === null) setRoomId("");
    else setRoomId(searchRoom);

    return () => {
      socket.removeAllListeners("statusSocketConn");
    };
  }, []);

  useEffect(() => {
    if (loading === false) toast.dismiss();
  }, [loading]);

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="username"
          className={`text-black h-full w-full text-2xl py-2 px-8 rounded-2xl border border-black text-center ${
            displayRoomId === true ? "hidden" : "block"
          }`}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          spellCheck="false"
          ref={userNameBoxRef}
        />
      </div>
      {displayRoomId && (
        <div className="flex flex-row justify-center items-center">
          <input
            type="text"
            placeholder="roomId"
            className={`text-black h-full w-full text-2xl py-2 px-8 rounded-2xl border border-black text-center ${
              displayRoomId === false ? "hidden" : "block"
            }`}
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            spellCheck="false"
            ref={roomIdInputBoxRef}
          />
          <div
            className="text-2xl p-4 mx-2 bg-white border border-black rounded-full cursor-pointer hover:px-8 transition-all"
            onClick={() => {
              setDisplayRoomId(false);
            }}
          >
            <GrLinkPrevious />
          </div>
        </div>
      )}
      <div className="w-full h-full flex flex-row justify-center items-center text-lg mt-8">
        <button
          onClick={handleCreateRoom}
          className={`bg-black px-8 py-2 rounded-2xl text-white mx-2 hover:px-12 transition-all ${
            roomId !== "" ? "opacity-50" : "opacity-100"
          }`}
        >
          Create Room
        </button>
        <button
          onClick={handlePlayClick}
          className={`bg-black px-8 py-2 rounded-2xl text-white mx-2 hover:px-12 transition-all ${
            roomId !== "" ? "opacity-50" : "opacity-100"
          }`}
        >
          Play As Guest
        </button>

        <button
          onClick={handleJoinLobbyClick}
          className="bg-black px-8 py-2 rounded-2xl text-white mx-2 hover:px-12 transition-all"
        >
          Join Room
        </button>
      </div>
    </>
  );
};

export default UserDetail;
