import React, { useContext, useState, useEffect, useRef } from "react";
import StateContext from "../States/StateManager";
import { GrFormNextLink } from "react-icons/gr";
import { socket } from "@/app/test/socketConn";

const chatArea = ({ roomId }) => {
  const { chat, setChat } = useContext(StateContext);
  const [inputChat, setInputChat] = useState("");
  const endMessageRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) handleInputChat();
  };

  const handleInputChat = () => {
    if (inputChat === "") return;
    const data = {
      roomId: roomId,
      socketId: socket.id,
      chatMsg: inputChat,
    };
    socket.emit("chatData", data);
    const socketId = socket.id;
    setChat((prevChat) => {
      return [...prevChat, { socketId, chatMsg: inputChat }];
    });
    setInputChat("");
  };

  useEffect(() => {
    socket.on("recievedChatData", (data) => {
      console.log(data);
      const { socketId, chatMsg } = data;
      setChat((prevChat) => {
        return [...prevChat, { socketId, chatMsg }];
      });
    });
  }, []);

  useEffect(() => {
    endMessageRef.current.scrollTop = endMessageRef.current.scrollHeight;
  }, [chat]);

  return (
    <>
      <div className="w-full h-full bg-gray-300 shadow-md p-1">
        <div
          className="w-full h-[60vh] overflow-y-auto py-1 [&>*:nth-child(odd)]:bg-gray-200"
          ref={endMessageRef}
        >
          {chat.map((c, index) => {
            return (
              <div
                key={index}
                className="text-sm text-black px-1 py-1 rounded-xs"
              >
                <span className="font-semibold text-xs">{c.socketId}:</span>{" "}
                {c.chatMsg}
              </div>
            );
          })}
        </div>
        <div className="w-full relative my-1">
          <input
            type="text"
            className="w-full p-2 pr-8 rounded text-black text-sm  border border-1 border-solid border-black"
            value={inputChat}
            onChange={(e) => setInputChat(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
          />
          <div
            className="absolute right-0 top-0 p-1 text-3xl hover:cursor-pointer"
            onClick={handleInputChat}
          >
            <GrFormNextLink />
          </div>
        </div>
      </div>
    </>
  );
};

export default chatArea;
