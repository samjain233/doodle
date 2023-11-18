import globalStateContext from "@/app/States/GlobalStateManager";
import React, { useContext } from "react";
import { Hourglass } from "react-loader-spinner";

const Waiting = (props) => {
  const { presenterDetails } = useContext(globalStateContext);
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
            {presenterDetails !== null
              ? `${presenterDetails} is choosing a word...`
              : "Joining Whiteboard..."}
          </div>
        </div>
      </div>
    </>
  );
};

export default Waiting;
