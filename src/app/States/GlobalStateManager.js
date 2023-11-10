import { createContext, useState } from "react";

const globalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [isAdmin, setAdmin] = useState(false);
  const [chat, setChat] = useState([]);

  return (
    <globalStateContext.Provider value={{ isAdmin, setAdmin ,chat , setChat}}>
      {children}
    </globalStateContext.Provider>
  );
};

export default globalStateContext;
