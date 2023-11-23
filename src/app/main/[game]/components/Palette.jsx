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
import { useEffect, useRef, useState, useContext } from "react";
import StateContext from "../States/StateManager";
import { IoSave } from "react-icons/io5";
import toast from "react-hot-toast";

const Palette = () => {
  const {
    canvasRef,
    strokeWidth,
    setStrokeWidth,
    color,
    setColor,
    history,
    tool,
    setTool,
    elements,
    setElements,
    setHistory,
    fill,
    setFill,
  } = useContext(StateContext);
  const [isClient, setIsClient] = useState(false);
  const colorRef = useRef(null);

  const handleColorClick = (e) => {
    colorRef.current.click();
  };

  const handleClear = () => {
    setElements([]);
  };

  const handleUndoClick = () => {
    if (elements.length === 0) return;
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);

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

  const saveDrawingClick = () => {
    if (elements.length === 0) {
      return;
    }
    canvasRef.current.toBlob((imageBlob) => {
      navigator.clipboard.write([
        new ClipboardItem({ "image/png": imageBlob }),
      ]);
    });
    toast.success("Drawing copied !!!");
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className=" w-full h-full bg-gray-400 flex flex-col items-center text-2xl p-1 shadow-md">
        <div className="flex flex-row">
          <div
            onClick={() => setTool("pencil")}
            className={`p-2 m-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
              tool === "pencil" ? " bg-gray-600 text-yellow-500" : ""
            }`}
          >
            <BiPencil />
          </div>
          <div
            onClick={() => setTool("line")}
            className={`p-2 m-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
              tool === "line" ? " bg-gray-600 text-yellow-500" : ""
            }`}
          >
            <GoHorizontalRule />
          </div>
        </div>
        <div className="flex flex-row">
          <div
            onClick={() => setTool("rectangle")}
            className={`p-2 m-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
              tool === "rectangle" ? " bg-gray-600 text-yellow-500" : ""
            }`}
          >
            <BiRectangle />
          </div>
          <div
            onClick={() => setTool("square")}
            className={`p-2 m-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
              tool === "square" ? " bg-gray-600 text-yellow-500" : ""
            }`}
          >
            <BiSquare />
          </div>
        </div>
        <div className="flex flex-row">
          <div
            onClick={() => setTool("circle")}
            className={`p-2 m-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
              tool === "circle" ? " bg-gray-600 text-yellow-500" : ""
            }`}
          >
            <BiCircle />
          </div>
          <div
            onClick={() => setTool("eraser")}
            className={`p-2 m-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
              tool === "eraser" ? " bg-gray-600 text-yellow-500" : ""
            }`}
          >
            <BiEraser />
          </div>
        </div>
        <div className="flex flex-row">
          <div
            onClick={() => setFill((prevFill) => !prevFill)}
            className={`p-2 m-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
              fill === true ? " bg-gray-600 text-yellow-500" : ""
            }`}
          >
            <PiPaintBucketFill />
          </div>
          <div
            className="p-2 m-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all"
            onClick={handleClear}
          >
            <AiOutlineClear />
          </div>
        </div>

        <div className="flex flex-row">
          <div
            className="p-2 m-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all"
            onClick={handleUndoClick}
          >
            <IoIosUndo
              className={`${
                elements.length === 0 ? "opacity-50" : "opacity-100"
              }`}
            />
          </div>
          <div
            className="p-2 m-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all"
            onClick={handleRedoClick}
          >
            <IoIosRedo
              className={`${
                history.length === 0 ? "opacity-50" : "opacity-100"
              }`}
            />
          </div>
        </div>
        <div
          className="p-2 m-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all"
          onClick={saveDrawingClick}
        >
          <IoSave
            className={`${
              elements.length === 0 ? "opacity-50" : "opacity-100"
            }`}
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
          <div className="h-full w-full flex flex-col justify center">
            <div
              className="h-[60px] w-[60px] rounded-md cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={(e) => handleColorClick(e)}
            ></div>
            <div className="h-full w-full flex flex-row justify-between">
              <div className="h-full w-full flex flex-col justify-center items-center">
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
              <div className="h-full w-full flex flex-col justify-center items-center">
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
        <div className="flex flex-col justify-center items-center">
          <div
            className={`text-xs p-2 my-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
              strokeWidth === 1 ? "bg-gray-600" : ""
            }`}
            onClick={() => setStrokeWidth(1)}
          >
            <PiCircleFill />
          </div>
          <div
            className={`text-lg p-2 my-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
              strokeWidth === 8 ? "bg-gray-600" : ""
            }`}
            onClick={() => setStrokeWidth(8)}
          >
            <PiCircleFill />
          </div>
          <div
            className={`text-2xl p-2 my-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
              strokeWidth === 15 ? "bg-gray-600" : ""
            }`}
            onClick={() => setStrokeWidth(15)}
          >
            <PiCircleFill />
          </div>
          <div
            className={`text-3xl p-2 my-1 cursor-pointer hover:bg-gray-500 rounded-full transition-all ${
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
