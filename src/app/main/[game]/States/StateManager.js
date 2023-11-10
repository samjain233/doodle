import { createContext, useState, useRef } from "react";

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [history, setHistory] = useState([]);
  const [fill, setFill] = useState(false);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  return (
    <StateContext.Provider
      value={{
        chat,
        setChat,
        tool,
        setTool,
        color,
        setColor,
        elements,
        setElements,
        strokeWidth,
        setStrokeWidth,
        history,
        setHistory,
        fill,
        setFill,
        canvasRef,
        ctxRef,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateContext;
