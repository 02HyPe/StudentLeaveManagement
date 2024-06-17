import React, { useState } from "react";
import "./Styles.css";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
  BsJustify,
} from "react-icons/bs";
import { IoNotificationsCircleOutline } from "react-icons/io5";

function Header({ OpenSidebar }) {
  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="shree-header">
        <h2 className="shree-animate">
          <span>
            SHREE RAMKRISHNA INSTITUTE OF COMPUTER EDUCATION AND APPLIED SCIENCE
          </span>
        </h2>
      </div>
      <div style={{ fontSize: "30px" }}>
        <IoNotificationsCircleOutline />
      </div>
    </header>
  );
}

export default Header;
