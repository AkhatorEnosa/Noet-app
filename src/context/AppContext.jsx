/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';

// Initialize context
export const AppContext = createContext(null);

// Get URL last part
const originUrl = location.href;
const splitUrl = originUrl.split("/");
const lastPartOfUrl = splitUrl[splitUrl.length - 1];

const result = lastPartOfUrl.slice(1);
localStorage.setItem("section", result);

export function AppProvider({ children }) {
    const [markedNotes, setMarkedNotes] = useState([]);

  return (
    <AppContext.Provider value={{
        markedNotes,
        setMarkedNotes
    }}>
      {children}
    </AppContext.Provider>
  );
}