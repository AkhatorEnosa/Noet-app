/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from 'react';

// Initialize context
export const AppContext = createContext({
  markedNotes: [],
  setMarkedNotes: () => {},
  autoSave: "true",
  setAutoSave: () => {},
  loggingIn: false,
  setLoggingIn: () => {}
});

// Get URL last part
const originUrl = location.href;
const splitUrl = originUrl.split("/");
const lastPartOfUrl = splitUrl[splitUrl.length - 1];

const result = lastPartOfUrl.slice(1);
localStorage.setItem("section", result);

const getAutoSave = localStorage.getItem("autoSave");

export function AppProvider({ children }) {
  const [markedNotes, setMarkedNotes] = useState([]);
  const [autoSave, setAutoSave] = useState(getAutoSave ? getAutoSave : "true");
  const [loggingIn, setLoggingIn] = useState(false);

  // set localeStorage initially
  useEffect(() => {
    localStorage.setItem("autoSave", autoSave);
  }, [autoSave]);

  return (
    <AppContext.Provider value={{
        markedNotes,
        setMarkedNotes,
        autoSave,
        setAutoSave,
        loggingIn,
        setLoggingIn
    }}>
      {children}
    </AppContext.Provider>
  );
}