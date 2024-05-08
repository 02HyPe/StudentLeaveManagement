import React, { useState } from "react";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Home from "./Components/Home";
import LoadingBar from "react-top-loading-bar";

function Dashboard() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const [progress, setProgress] = useState(0);
  return (
    <div className="grid-container">
      <LoadingBar height={3} color="#face4d" progress={progress} />
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <Home setProgress={setProgress} />
    </div>
  );
}

export default Dashboard;
