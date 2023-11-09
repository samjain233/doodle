import { useState, useEffect, useContext } from "react";
import StateContext from "../States/StateManager";
import WhiteBoard from "./WhiteBoard";
import Palette from "./Palette";
import ChatArea from "./ChatArea";

const GameArea = ({ roomId }) => {
  const [isShiftPressed, setShiftPressed] = useState(false);
  const [presenter, setPresenter] = useState(true);
  const { setStrokeWidth } = useContext(StateContext);

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
    // console.log(elements);
    // console.log(roomId);
    console.log(presenter);
  }, [presenter]);

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
          <div className="w-full h-full grid grid-cols-12">
            <div className="col-span-9">
              <WhiteBoard
                isShiftPressed={isShiftPressed}
                roomId={roomId}
                presenter={presenter}
              />
            </div>
            <div className="col-span-3">
              <ChatArea roomId={roomId} />
            </div>
          </div>
          <div className="absolute top-0 left-0 bottom-0">
            <Palette presenter={presenter} setPresenter={setPresenter} />
          </div>
        </div>
      </div>
    </>
  );
};

export default GameArea;
