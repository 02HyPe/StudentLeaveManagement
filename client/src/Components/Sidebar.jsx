import React, { useState } from "react";
import "./Styles.css";
import {
  BsGrid1X2Fill,
  BsFillGearFill,
} from "react-icons/bs";
import axios from "axios";
import { FaCalendarTimes } from "react-icons/fa";
import { FaUsersBetweenLines } from "react-icons/fa6";
import { FaListUl } from "react-icons/fa";

import { doLogout } from "../auth";
import { TbLogout2 } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();
  const logOutHandler = async () => {
    try {
      doLogout(() => {
        console.log("logged out");
        navigate("/login");
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const token = localStorage.getItem(`token`);
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  const userName = tokenPayload.name;
  const userType = tokenPayload.type;

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <img src={logo} className="icon_header" />
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <a href="/dashboard">
            <BsGrid1X2Fill className="icon" /> Dashboard
          </a>
        </li>

        <li className="sidebar-list-item">
          <a href="/profile">
            <CgProfile className="icon" /> Profile
          </a>
        </li>

        <li className="sidebar-list-item">
          <a href="/leaveForm">
            <FaCalendarTimes className="icon" /> Leave Form
          </a>
        </li>

        {userType === "Admin" && (
          <>
            <li className="sidebar-list-item">
              <a href="/user">
                <FaUsersBetweenLines className="icon" /> Users List
              </a>
            </li>
            <li className="sidebar-list-item">
              <a href="/leaveRequest">
                <FaListUl className="icon" /> Leave Request List
              </a>
            </li>
            <li className="sidebar-list-item">
              <a href="/leaveType">
                <FaCalendarTimes className="icon" /> Add Leave Type
              </a>
            </li>
          </>
        )}
        {userType === "Moderator" && (
          <>
            <li className="sidebar-list-item">
              <a href="/user">
                <FaUsersBetweenLines className="icon" /> Users List
              </a>
            </li>
            <li className="sidebar-list-item">
              <a href="/leaveRequest">
                <FaListUl className="icon" /> Leave Request List
              </a>
            </li>
          </>
        )}
        <li className="sidebar-list-item">
          <a
            href="/"
            onClick={(e) => {
              logOutHandler();
            }}
          >
            <TbLogout2 className="icon" /> Logout
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
