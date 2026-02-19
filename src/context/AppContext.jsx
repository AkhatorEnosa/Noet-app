/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from 'react';

// Initialize context
export const AppContext = createContext(null);

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

  // set localeStorage initially
  useEffect(() => {
    localStorage.setItem("autoSave", autoSave);
  }, [autoSave]);

  return (
    <AppContext.Provider value={{
        markedNotes,
        setMarkedNotes,
        autoSave,
        setAutoSave
    }}>
      {children}
    </AppContext.Provider>
  );
}