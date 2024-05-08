import React from "react";

const DropProfile = () => {
  return (
    <div className="flex-flex-col-drop">
      <ul className="flex-flex-col-gap">
        <li className="flex-list">
          <a>Profile</a>
        </li>
        <li className="flex-list">
          <a>Logout</a>
        </li>
      </ul>
    </div>
  );
};

export default DropProfile;
