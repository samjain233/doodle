import { createContext, useState } from "react";

const lobbyStateContext = createContext();

export const LobbyStateProvider = ({ children }) => {
  const [lobby, setLobby] = useState([]);

  return (
    <lobbyStateContext.Provider value={{ lobby, setLobby }}>
      {children}
    </lobbyStateContext.Provider>
  );
};

export default lobbyStateContext;
