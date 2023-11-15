import React from "react";
import { Hourglass } from "react-loader-spinner";

const Waiting = () => {
  return (
    <>
      <div className="w-full h-full bg-gray-200/20 backdrop-blur-md">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Hourglass
            visible={true}
            height="120"
            width="120"
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            wrapperClass=""
            colors={["#306cce", "#72a1ed"]}
          />
          <div className="text-4xl text-gray-500 mt-8">
            Joining WhiteBoard ...
          </div>
        </div>
      </div>
    </>
  );
};

export default Waiting;
