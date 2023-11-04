"use client";
import { useEffect, useState, useLayoutEffect, useRef } from "react";
import rough from "roughjs";

const roughGen = rough.generator();

const WhiteBoard = ({ canvasRef, ctxRef }) => {
  const [hold, setHold] = useState(false);
  const [elements, setElements] = useState([]);
  const [tool, setTool] = useState("pencil");
  const divRef = useRef(null);
  const [color, setColor] = useState("red");

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setHold(true);

    //pencil -free draw
    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          color: color,
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
        },
      ]);
    }
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (hold) {
      // pencil
      if (tool === "pencil") {
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
      if (tool === "line") {
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
    }
  };

  const handleMouseUp = (e) => {
    setHold(false);
  };

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
    console.log(elements);
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
          strokeWidth: 1,
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
              strokeWidth: 1,
              roughness: 0,
            }
          )
        );
      }
    });
  }, [elements]);

  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center">
        <div
          onMouseDown={(e) => handleMouseDown(e)}
          onMouseMove={(e) => handleMouseMove(e)}
          onMouseUp={(e) => handleMouseUp(e)}
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
