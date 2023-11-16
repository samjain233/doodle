import { createContext, useState } from "react";

const globalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [isAdmin, setAdmin] = useState(false);
  const [chat, setChat] = useState([]);
  const [gameSettings, setGameSettings] = useState({});
  const [presenter, setPresenter] = useState(false);
  const [myTurn, setMyTurn] = useState(false);

  return (
    <globalStateContext.Provider
      value={{
        isAdmin,
        setAdmin,
        chat,
        setChat,
        gameSettings,
        setGameSettings,
        presenter,
        setPresenter,
        myTurn,
        setMyTurn,
      }}
    >
      {children}
    </globalStateContext.Provider>
  );
};

export default globalStateContext;
