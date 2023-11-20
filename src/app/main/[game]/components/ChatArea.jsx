import React, { useContext, useState, useEffect, useRef } from "react";
import StateContext from "../States/StateManager";
import { GrFormNextLink } from "react-icons/gr";
import { socket } from "@/app/test/socketConn";
import globalStateContext from "@/app/States/GlobalStateManager";

const ChatArea = ({ roomId }) => {
  const { chat, setChat, chatBlock , userName } = useContext(globalStateContext);
  const [inputChat, setInputChat] = useState("");
  const endMessageRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) handleInputChat();
  };

  const handleInputChat = () => {
    if (inputChat === "" || chatBlock === true) return;
    const data = {
      roomId: roomId,
      userName : userName,
      chatMsg: inputChat,
    };
    socket.emit("sendMessage", data);
    setInputChat("");
  };

  useEffect(() => {
    socket.on("recievedChatData", (data) => {
      console.log(data);
      const { userName, chatMsg } = data;
      setChat((prevChat) => {
        return [...prevChat, { userName, chatMsg }];
      });
    });
    return () => {
      socket.removeAllListeners("recievedChatData");
    };
  }, []);

  useEffect(() => {
    endMessageRef.current.scrollTop = endMessageRef.current.scrollHeight;
  }, [chat]);

  return (
    <>
      <div className="w-full h-full bg-gray-300 ">
        <div
          className={`w-full ${
            !chatBlock ? "h-[90%]" : "h-full"
          } transition-all overflow-y-auto py-1 [&>*:nth-child(odd)]:bg-gray-200`}
          ref={endMessageRef}
        >
          {chat.map((c, index) => {
            return (
              <div
                key={index}
                className="text-xs text-black px-1 py-1 rounded-xs"
              >
                <span className="font-semibold text-xs">{c.userName}:</span>{" "}
                {c.chatMsg}
              </div>
            );
          })}
        </div>
        {!chatBlock && (
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
        )}
      </div>
    </>
  );
};

export default ChatArea;
