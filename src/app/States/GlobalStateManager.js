import { createContext, useState } from "react";

const globalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [isAdmin, setAdmin] = useState(false);

  return (
    <globalStateContext.Provider value={{ isAdmin, setAdmin }}>
      {children}
    </globalStateContext.Provider>
  );
};

export default globalStateContext;
