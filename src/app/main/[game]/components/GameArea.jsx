import { useState, useEffect, useContext } from "react";
import StateContext from "../States/StateManager";
import WhiteBoard from "./WhiteBoard";
import Palette from "./Palette";
import ChatArea from "./ChatArea";
import SideNav from "./SideNav";
import { socket } from "@/app/test/socketConn";
import Waiting from "./Waiting";
import ChooseWord from "./ChooseWord";
import Score from "./Score";

const GameArea = ({ roomId }) => {
  const [isShiftPressed, setShiftPressed] = useState(false);
  const [hideWaitingSection, setHideWaitingSection] = useState(false);
  const [wordWindow, setWordWindow] = useState(false);
  const [scoreWindow, setScoreWindow] = useState(false);
  const { setStrokeWidth, setPresenter, presenter } = useContext(StateContext);

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

  // useEffect(() => {
  //   // console.log(elements);
  //   // console.log(roomId);
  //   console.log(presenter);
  // }, [presenter]);

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    socket.on("setPresenter", ({ presenter }) => {
      setPresenter(presenter);
    });
    socket.on("waitingSection", ({ hideWaiting }) => {
      setHideWaitingSection(hideWaiting);
    });
    socket.on("chooseWord", ({ chooseWordWindow }) => {
      setWordWindow(chooseWordWindow);
    });
    socket.on("showScore", ({ showScoreWindow }) => {
      setScoreWindow(showScoreWindow);
    });
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
            <div className="col-span-9 relative">
              <WhiteBoard isShiftPressed={isShiftPressed} roomId={roomId} />
              <div
                className={`z-[50] h-full w-full absolute  ${
                  hideWaitingSection ? "top-[-1200px]" : "top-0"
                } left-0 transition-all duration-500`}
              >
                <Waiting />
              </div>
              <div
                className={`z-[50] h-full w-full absolute ${
                  wordWindow ? "top-0" : "top-[-1200px]"
                } left-0 transition-all duration-500`}
              >
                <ChooseWord />
              </div>
              <div
                className={`z-[50] h-full w-full absolute ${
                  scoreWindow ? "top-0" : "top-[-1200px]"
                }  left-0 transition-all duration-500`}
              >
                <Score roomId={roomId} />
              </div>
            </div>
            <div className="col-span-3">
              <SideNav roomId={roomId} />
            </div>
          </div>

          <div
            className={`z-[20] absolute top-0 ${
              presenter ? "left-0" : "left-[-200px]"
            } bottom-0 transition-all duration-500`}
          >
            <Palette />
          </div>
        </div>
      </div>
    </>
  );
};

export default GameArea;
