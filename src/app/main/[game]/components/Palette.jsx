import { BiRectangle } from "react-icons/bi";
import { BiSquare } from "react-icons/bi";
import { BiPencil } from "react-icons/bi";
import { BiCircle } from "react-icons/bi";
import { PiPaintBucketFill } from "react-icons/pi";
import { IoIosUndo } from "react-icons/io";
import { IoIosRedo } from "react-icons/io";
import { GoHorizontalRule } from "react-icons/go";
import { PiCircleFill } from "react-icons/pi";
import { BiEraser } from "react-icons/bi";
import { AiOutlineClear } from "react-icons/ai";
import { CgColorPicker } from "react-icons/cg";
import { useEffect, useRef, useState } from "react";

const Palette = ({
  setStrokeWidth,
  color,
  setColor,
  tool,
  setTool,
  setElements,
  canvasRef,
  elements,
  setHistory,
  history,
  strokeWidth,
  fill,
  setFill,
  presenter,
  setPresenter,
}) => {
  const [isClient, setIsClient] = useState(false);
  const colorRef = useRef(null);

  const handleColorClick = (e) => {
    colorRef.current.click();
  };

  const handleClear = () => {
    setElements([]);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillRect = "white";
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleUndoClick = () => {
    if (elements.length === 0) return;
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);

    if (elements.length === 1) handleClear();
    setElements((prevElements) =>
      prevElements.slice(0, prevElements.length - 1)
    );
  };

  const handleRedoClick = () => {
    if (history.length === 0) return;
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);

    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className=" w-full h-full bg-gray-400 flex flex-row items-center text-3xl p-2 shadow-md rounded-md">
        <div
          onClick={() => setTool("pencil")}
          className={`p-2 mx-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
            tool === "pencil" ? " bg-gray-600" : ""
          }`}
        >
          <BiPencil />
        </div>
        <div
          onClick={() => setTool("line")}
          className={`p-2 mx-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
            tool === "line" ? " bg-gray-600" : ""
          }`}
        >
          <GoHorizontalRule />
        </div>
        <div
          onClick={() => setTool("rectangle")}
          className={`p-2 mx-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
            tool === "rectangle" ? " bg-gray-600" : ""
          }`}
        >
          <BiRectangle />
        </div>
        <div
          onClick={() => setTool("square")}
          className={`p-2 mx-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
            tool === "square" ? " bg-gray-600" : ""
          }`}
        >
          <BiSquare />
        </div>
        <div
          onClick={() => setTool("circle")}
          className={`p-2 mx-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
            tool === "circle" ? " bg-gray-600" : ""
          }`}
        >
          <BiCircle />
        </div>
        <div
          onClick={() => setTool("eraser")}
          className={`p-2 mx-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
            tool === "eraser" ? " bg-gray-600" : ""
          }`}
        >
          <BiEraser />
        </div>
        <div
          onClick={() => setFill((prevFill) => !prevFill)}
          className={`p-2 mx-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
            fill === true ? " bg-gray-600" : ""
          }`}
        >
          <PiPaintBucketFill />
        </div>
        <div
          onClick={() => setPresenter((prevPresenter) => !prevPresenter)}
          className={`p-2 mx-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
            presenter === true ? " bg-gray-600" : ""
          }`}
        >
          <CgColorPicker />
        </div>
        <div
          className="p-2 mx-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all"
          onClick={handleClear}
        >
          <AiOutlineClear />
        </div>

        <div
          className="p-2 mx-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all"
          onClick={handleUndoClick}
        >
          <IoIosUndo
            className={`${
              elements.length === 0 ? "opacity-50" : "opacity-100"
            }`}
          />
        </div>
        <div
          className="p-2 mx-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all"
          onClick={handleRedoClick}
        >
          <IoIosRedo
            className={`${history.length === 0 ? "opacity-50" : "opacity-100"}`}
          />
        </div>
        <div className="p-2 ">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            ref={colorRef}
            className="hidden"
          />
          <div className="h-full w-full flex flex-row justify center">
            <div
              className="h-[50px] w-[70px] rounded-md cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={(e) => handleColorClick(e)}
            ></div>
            <div className="h-full w-full flex flex-col ml-2">
              <div className="h-full w-full flex flex-row">
                <div
                  className="bg-black  w-[25px] h-[25px] rounded-md m-[1px] cursor-pointer"
                  onClick={() => setColor("#000000")}
                ></div>
                <div
                  className="bg-pink-600 w-[25px] h-[25px] rounded-md m-[1px] cursor-pointer"
                  onClick={() => setColor("#DB2777")}
                ></div>
                <div
                  className="bg-red-600 w-[25px] h-[25px] rounded-md m-[1px] cursor-pointer"
                  onClick={() => setColor("#DC2626")}
                ></div>
                <div
                  className="bg-green-600 w-[25px] h-[25px] rounded-md m-[1px] cursor-pointer"
                  onClick={() => setColor("#16A34A")}
                ></div>
              </div>
              <div className="h-full w-full flex flex-row">
                <div
                  className="bg-yellow-500 w-[25px] h-[25px] rounded-md m-[1px] cursor-pointer"
                  onClick={() => setColor("#EAB308")}
                ></div>
                <div
                  className="bg-blue-600 w-[25px] h-[25px] rounded-md m-[1px] cursor-pointer"
                  onClick={() => setColor("#2563EB")}
                ></div>
                <div
                  className="bg-orange-600 w-[25px] h-[25px] rounded-md m-[1px] cursor-pointer"
                  onClick={() => setColor("#EA580C")}
                ></div>
                <div
                  className="bg-gray-600 w-[25px] h-[25px] rounded-md m-[1px] cursor-pointer"
                  onClick={() => setColor("#4B5563")}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center">
          <div
            className={`text-xs p-2 mx-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
              strokeWidth === 1 ? "bg-gray-600" : ""
            }`}
            onClick={() => setStrokeWidth(1)}
          >
            <PiCircleFill />
          </div>
          <div
            className={`text-lg p-2 mx-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
              strokeWidth === 8 ? "bg-gray-600" : ""
            }`}
            onClick={() => setStrokeWidth(8)}
          >
            <PiCircleFill />
          </div>
          <div
            className={`text-2xl p-2 mx-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
              strokeWidth === 15 ? "bg-gray-600" : ""
            }`}
            onClick={() => setStrokeWidth(15)}
          >
            <PiCircleFill />
          </div>
          <div
            className={`text-3xl p-2 mx-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
              strokeWidth === 25 ? "bg-gray-600" : ""
            }`}
            onClick={() => setStrokeWidth(25)}
          >
            <PiCircleFill />
          </div>
        </div>
      </div>
    </>
  );
};

export default Palette;
