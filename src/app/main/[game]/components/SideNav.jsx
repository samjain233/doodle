import React from "react";
import ChatArea from "./ChatArea";

const SideNav = ({ roomId }) => {
  return (
    <>
      <div className="w-full h-screen bg-gray-300 shadow-md p-1">
        <div className="w-full h-full grid grid-rows-16 grid-flow-col">
          <div className="w-full h-full row-span-2 border-b border-white border-solid"></div>
          <div className="w-full h-full row-span-2 border-b border-white border-solid"></div>
          <div className="w-full h-full border-b border-white border-solid"></div>
          <div className="w-full h-full row-[span_10_/_span_10] border-b border-white border-solid">
            <ChatArea roomId={roomId} />
          </div>
          <div className="w-full h-full "></div>
        </div>
      </div>
    </>
  );
};

export default SideNav;
