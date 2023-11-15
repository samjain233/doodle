import { createContext, useState } from "react";

const globalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [isAdmin, setAdmin] = useState(false);
  const [chat, setChat] = useState([]);
  const [gameSettings, setGameSettings] = useState({});

  return (
    <globalStateContext.Provider value={{ isAdmin, setAdmin, chat, setChat , gameSettings , setGameSettings }}>
      {children}
    </globalStateContext.Provider>
  );
};

export default globalStateContext;
