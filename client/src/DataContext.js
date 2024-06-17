import { createContext, useContext, useState } from "react";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [sharedData, setSharedData] = useState("");

  const updateData = (newData) => {
    setSharedData(newData);
  };

  return (
    <DataContext.Provider value={{ sharedData, updateData }}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export { DataProvider, useData };
