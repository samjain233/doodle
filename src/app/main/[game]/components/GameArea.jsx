import { useRef, useState, useEffect } from "react";
import WhiteBoard from "./WhiteBoard";
import Palette from "./Palette";

const GameArea = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [color, setColor] = useState("#000000");
  const [tool, setTool] = useState("pencil");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [fill, setFill] = useState(false);
  const [isShiftPressed, setShiftPressed] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === "+") {
      setStrokeWidth((prev) => {
        if (prev === 50) return prev;
        else return prev + 1;
      });
    }
    if (e.key === "-") {
      setStrokeWidth((prev) => {
        if (prev === 1) return prev;
        else return prev - 1;
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Shift") {
      setShiftPressed(true);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Shift") {
      setShiftPressed(false);
    }
  };

  useEffect(() => {
    console.log(elements);
  }, [elements]);

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <>
      <div className="relative">
        <div className="h-screen w-screen">
          <WhiteBoard
            canvasRef={canvasRef}
            ctxRef={ctxRef}
            strokeWidth={strokeWidth}
            color={color}
            tool={tool}
            elements={elements}
            setElements={setElements}
            setHistory={setHistory}
            fill={fill}
            isShiftPressed={isShiftPressed}
          />
        </div>
        <div className="absolute bottom-0">
          <Palette
            canvasRef={canvasRef}
            ctxRef={ctxRef}
            setStrokeWidth={setStrokeWidth}
            color={color}
            setColor={setColor}
            tool={tool}
            setTool={setTool}
            elements={elements}
            setElements={setElements}
            history={history}
            setHistory={setHistory}
            strokeWidth={strokeWidth}
            fill={fill}
            setFill={setFill}
          />
        </div>
      </div>
    </>
  );
};

export default GameArea;
