import React, { createContext, useContext, useRef } from "react";
import { handleAddActivity } from "./handleAddActivity";

const ActivityContext = createContext();
export const useActivity = () => useContext(ActivityContext);

export const ActivityProvider = ({ children }) => {
  const timerRef = useRef(null);


  const setPendingActivity = (feature, fileName) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      handleAddActivity(feature, fileName);
      timerRef.current = null;
    }, 5000);
  };

  return (
    <ActivityContext.Provider value={{ setPendingActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};
