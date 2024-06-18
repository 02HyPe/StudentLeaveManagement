import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import "../Profile/Profile.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LeaveType() {
  const headers = { authorization: `Bearer ` + localStorage.getItem(`token`) };
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [data, setData] = useState({
    leaveName: "",
    typeOfLeave: "",
    leaveDays: "",
    leaveDate: "",
    authority: [],
    leaveFor: [],
    publicHoliday: false,
  });

  const createLeave = async (event) => {
    event.preventDefault(); 
    try {
      const result = await axios.post(
        "https://studentleavemanagement-1.onrender.com/admin/leaveType",
        {
          leaveName: data.leaveName,
          typeOfLeave: data.typeOfLeave,
          leaveDays: data.leaveDays,
          leaveDate: data.leaveDate,
          authority: data.authority,
          leaveFor: data.leaveFor,
          publicHoliday: data.publicHoliday,
        },
        { headers: headers }
      );

      if (result.status === 200) {
        toast.success("Leave Created Successfully");
      }
    } catch (err) {}
  };

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setData((prevData) => ({
      ...prevData,
      authority: checked
        ? [...prevData.authority, value]
        : prevData.authority.filter((item) => item !== value),
    }));
  };
  const handleCheckboxChangeLeaveFor = (event) => {
    const { value, checked } = event.target;
    setData((prevData) => ({
      ...prevData,
      authority: checked
        ? [...prevData.authority, value]
        : prevData.authority.filter((item) => item !== value),
    }));
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <main className="main-profile">
        <div className="settings">
          <div className="settings__wrapper">
            <div className="details__form">
              <h2 className="profile__title">Leave Types</h2>
              <p className="profile__desc"></p>
              <form onSubmit={createLeave}>
                <label htmlFor="publicHolidayCheckbox">Public Holiday</label>
                <div className="pubholiday">
                  <input
                    type="checkbox"
                    id="publicHolidayCheckbox"
                    name="publicHoliday"
                    checked={data.publicHoliday}
                    onChange={(e) =>
                      setData({ ...data, publicHoliday: e.target.checked })
                    }
                  />
                </div>
                <div className="form__group">
                  <div>
                    <label>Leave Days:</label>
                    <input
                      type="text"
                      value={data.leaveDays}
                      placeholder="Leave Days"
                      onChange={(e) =>
                        setData({ ...data, leaveDays: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label>Leave Name:</label>
                    <input
                      type="text"
                      value={data.leaveName}
                      placeholder="Leave Name"
                      onChange={(e) =>
                        setData({ ...data, leaveName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form__group">
                  {data.publicHoliday && (
                    <>
                      <div>
                        <label>Leave Date:</label>
                        <input
                          type="date"
                          value={data.leaveDate}
                          placeholder="leavedate"
                          onChange={(e) =>
                            setData({ ...data, leaveDate: e.target.value })
                          }
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="form-group-checkbox">
                  <div>
                    <label>Authority:</label>
                    <div>
                      <input
                        type="checkbox"
                        id="checkbox1"
                        name="authority"
                        value="H.O.D"
                        onChange={handleCheckboxChange}
                        checked={data.authority.includes("H.O.D")}
                      />
                      <label htmlFor="checkbox1">H.O.D</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="checkbox2"
                        name="authority"
                        value="Faculty"
                        onChange={handleCheckboxChange}
                        checked={data.authority.includes("Faculty")}
                      />
                      <label htmlFor="checkbox2">Faculty</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="checkbox3"
                        name="authority"
                        value="Co-Ordinator"
                        onChange={handleCheckboxChange}
                        checked={data.authority.includes("Co-Ordinator")}
                      />
                      <label htmlFor="checkbox3">Co-Ordinator</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="checkbox4"
                        name="authority"
                        value="Mentor"
                        onChange={handleCheckboxChange}
                        checked={data.authority.includes("Mentor")}
                      />
                      <label htmlFor="checkbox4">Mentor</label>
                    </div>
                  </div>
                </div>

                <div className="form-group-checkbox">
                  <div>
                    <label>Select:</label>
                    <div>
                      <input
                        type="checkbox"
                        id="checkbox5"
                        name="authority"
                        value="student"
                      />
                      <label htmlFor="checkbox5">Student</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="checkbox6"
                        name="authority"
                        value="faculty"
                      />
                      <label htmlFor="checkbox6">Faculty</label>
                    </div>
                  </div>
                </div>

                <div className="profile__img-btns">
                  <button className="dlt__btn" type="submit">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </main>
    </div>
  );
}

export default LeaveType;
