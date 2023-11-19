"use client";
import {
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
  useContext,
} from "react";
import StateContext from "../States/StateManager";
import rough from "roughjs";
import { socket } from "../../../test/socketConn";
import globalStateContext from "@/app/States/GlobalStateManager";

const roughGen = rough.generator();

const userJoined = (data) => {
  if (data.success) {
    console.log("userJoined");
  } else {
    console.log("userJoined error");
  }
};

const WhiteBoard = ({ isShiftPressed, roomId }) => {
  const {
    canvasRef,
    ctxRef,
    strokeWidth,
    color,
    tool,
    elements,
    setElements,
    setHistory,
    fill,
  } = useContext(StateContext);
  const { presenter } = useContext(globalStateContext);
  const [hold, setHold] = useState(false);
  const divRef = useRef(null);

  const handleMouseDown = (e) => {
    if (presenter === false) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setHold(true);

    //pencil and eraser -free draw
    if (tool === "pencil" || tool === "eraser") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          color: tool === "pencil" ? color : "#ffffff",
          strokeWidth: strokeWidth,
        },
      ]);
    }

    //line
    else if (tool === "line") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "line",
          startx: offsetX,
          starty: offsetY,
          endx: offsetX,
          endy: offsetY,
          color: color,
          strokeWidth: strokeWidth,
        },
      ]);
    }

    //rectangle
    else if (tool === "rectangle") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "rect",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          color: color,
          strokeWidth: strokeWidth,
          fill: fill === true ? color : "",
        },
      ]);
    }

    //square
    else if (tool === "square") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "square",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          color: color,
          strokeWidth: strokeWidth,
          fill: fill === true ? color : "",
        },
      ]);
    }

    //circle and ellipse
    else if (tool === "circle") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: isShiftPressed ? "circle" : "ellipse",
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          color: color,
          strokeWidth: strokeWidth,
          fill: fill === true ? color : "",
        },
      ]);
    }
  };

  const handleMouseMove = (e) => {
    if (presenter === false) return;
    const { offsetX, offsetY } = e.nativeEvent;
    if (hold) {
      setHistory([]);
      // pencil
      if (tool === "pencil" || tool === "eraser") {
        const { path } = elements[elements.length - 1];
        const newpath = [...path, [offsetX, offsetY]];
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                path: newpath,
              };
            } else {
              return ele;
            }
          })
        );
      }

      // line
      else if (tool === "line") {
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                endx: offsetX,
                endy: offsetY,
              };
            } else {
              return ele;
            }
          })
        );
      }

      //reactangle
      else if (tool === "rectangle") {
        setElements((prevElements) => {
          return prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
              };
            } else {
              return ele;
            }
          });
        });
      }

      //square
      else if (tool === "square") {
        setElements((prevElements) => {
          return prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetY - ele.offsetY,
                height: offsetY - ele.offsetY,
              };
            } else {
              return ele;
            }
          });
        });
      }

      //circle and ellipse
      else if (tool === "circle") {
        setElements((prevElements) => {
          return prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                type: isShiftPressed ? "circle" : "ellipse",
                width: offsetX,
                height: offsetY,
              };
            } else {
              return ele;
            }
          });
        });
      }
    }
  };

  const handleMouseUp = (e) => {
    if (presenter === false) return;
    setHold(false);
  };

  // const handleKeyDown = (e) => {
  //   console.log(e);
  // };

  useEffect(() => {
    socket.on("userIsJoined", userJoined);
    socket.on("whiteBoardDrawingResponse", (data) => {
      if (presenter === false) setElements(data);
    });
  }, [presenter]);

  useEffect(() => {
    if (elements.length === 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.fillRect = "white";
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [elements]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    ctxRef.current.strokeStyle = color;
  }, [color]);

  const handleTouch = (e) => {
    // const { clientX, clientY } = e.targetTouches[0];
    // console.log(clientX, clientY);
    console.log(e);
  };

  // useEffect(() => {
  //   console.log(divRef);
  // }, [divRef]);

  useLayoutEffect(() => {
    // console.log(elements);
    const data = {
      roomId: roomId,
      elements: elements,
    };
    if (presenter === true) socket.emit("whiteBoardDrawing", data);
    const roughCanvas = rough.canvas(canvasRef.current);

    if (elements.length > 0) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }

    elements.forEach((element) => {
      if (element.type === "pencil") {
        roughCanvas.linearPath(element.path, {
          stroke: element.color,
          strokeWidth: element.strokeWidth,
          roughness: 0,
        });
      } else if (element.type === "line") {
        console.log(element.startx, element.starty, element.endx, element.endy);
        roughCanvas.draw(
          roughGen.line(
            element.startx,
            element.starty,
            element.endx,
            element.endy,
            {
              stroke: element.color,
              strokeWidth: element.strokeWidth,
              roughness: 0,
            }
          )
        );
      } else if (element.type === "rect") {
        roughCanvas.draw(
          roughGen.rectangle(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            {
              stroke: element.color,
              strokeWidth: element.strokeWidth,
              roughness: 0,
              fill: element.fill,
              fillStyle: "solid",
            }
          )
        );
      } else if (element.type === "square") {
        roughCanvas.draw(
          roughGen.rectangle(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            {
              stroke: element.color,
              strokeWidth: element.strokeWidth,
              roughness: 0,
              fill: element.fill,
              fillStyle: "solid",
            }
          )
        );
      } else if (element.type === "circle") {
        roughCanvas.draw(
          roughGen.circle(
            (element.width + element.offsetX) / 2,
            (element.height + element.offsetY) / 2,
            element.width - element.offsetX,
            {
              stroke: element.color,
              strokeWidth: element.strokeWidth,
              roughness: 0,
              fill: element.fill,
              fillStyle: "solid",
            }
          )
        );
      } else if (element.type === "ellipse") {
        roughCanvas.draw(
          roughGen.ellipse(
            (element.width + element.offsetX) / 2,
            (element.height + element.offsetY) / 2,
            element.width - element.offsetX,
            element.height - element.offsetY,
            {
              stroke: element.color,
              strokeWidth: element.strokeWidth,
              roughness: 0,
              fill: element.fill,
              fillStyle: "solid",
            }
          )
        );
      }
    });
  }, [elements]);

  return (
    <>
      <div className="h-full w-full">
        <div
          onMouseDown={(e) => handleMouseDown(e)}
          onMouseMove={(e) => handleMouseMove(e)}
          onMouseUp={(e) => handleMouseUp(e)}
          onMouseOut={(e) => handleMouseUp(e)}
          // onTouchStart={(e) => handleMouseDown(e)}
          onTouchMove={(e) => handleTouch(e)}
          // onTouchEnd={(e) => handleMouseUp(e)}
          className="w-full h-full"
          ref={divRef}
        >
          <canvas ref={canvasRef} className="w-full h-full bg-white" />
        </div>
      </div>
    </>
  );
};

export default WhiteBoard;
