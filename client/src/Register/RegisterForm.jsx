import React, { useState, useEffect } from "react";
import "../Register/Registerform.css";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const headers = { authorization: `Bearer ` + localStorage.getItem("token") };
  const [dataModerator, setDataModerator] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userId: "",
    password: "",
    confirmpassword: "",
    phoneNumber: "",
    department: "",
    mentorId: "",
    authority: "",
    registerUser: "Moderator",
  });

  const [mentor, setMentor] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/admin/registerForm",
          {
            headers: headers,
          }
        );
        setMentor(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchData();
  }, []);

  const uregisterModerator = async (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      userId,
      password,
      confirmpassword,
      phoneNumber,
      department,
      mentorId,
      authority,
      batch,
    } = dataModerator;
    try {
      await axios
        .post(
          "http://localhost:9000/admin/user",
          {
            type: "Moderator",
            firstName: firstName,
            lastName: lastName,
            email: email,
            userId: userId,
            password: password,
            confirmpassword: confirmpassword,
            phoneNumber: phoneNumber,
            department: department,
            mentorId: mentorId,
            authority: authority,
            userId: userId,
            batch: batch,
          },
          {
            headers: headers,
          }
        )
        .then((result) => {
          console.log(result);
          if (result.request.status === 200) {
            toast.success("Registered Successfully", {
              position: "top-right",
              autoClose: 2500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    enrollno: "",
    password: "",
    confirmpassword: "",
    phoneNumber: "",
    course: "",
    division: "",
    department: "",
    year: "",
    mentorId: "",
    authority: "Student",
    registerUser: "Student",
  });
  const navigate = useNavigate();

  const uregister = async (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      enrollno,
      password,
      confirmpassword,
      phoneNumber,
      course,
      division,
      department,
      year,
      mentorId,
      authority,
    } = data;
    console.log(data.mentor);
    try {
      await axios
        .post(
          "http://localhost:9000/admin/user",
          {
            type: "Student",
            firstName: firstName,
            lastName: lastName,
            email: email,
            enrollno: enrollno,
            password: password,
            confirmpassword: confirmpassword,
            phoneNumber: phoneNumber,
            course: course,
            division: division,
            department: department,
            year: year,
            mentorId: mentorId,
            authority: authority,
          },
          {
            headers: headers,
          }
        )
        .then((result) => {
          console.log(result);
          if (result.request.status === 200) {
            toast.success("Registered Successfully", {
              position: "top-right",
              autoClose: 2500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const [selectedOption, setSelectedOption] = useState("Student");

  const handleRadioChange = (event) => {
    toggleSwitch(event.target.value);
  };

  const toggleSwitch = () => {
    if (selectedOption === "Student") {
      setSelectedOption("Moderator");
      setData({ registerUser: "Moderator" });
    } else {
      setSelectedOption("Student");
      setData({ registerUser: "Student" });
    }
  };

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  return (
    <div className="grid-register">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <main className="main-register">
        <div>
          <div className="switch-container">
            <label className="switch">
              <h2 className="switch-toggle">{data.registerUser}</h2>
              <input type="checkbox" onChange={handleRadioChange} />
              <span className="slider"></span>
            </label>
          </div>

          <div>
            {selectedOption === "Student" && (
              <div className="registration-container">
                <h1 className="title">Registration Form</h1>
                <form
                  onSubmit={uregister}
                  className="registration-form"
                  method="post"
                >
                  <div className="form-column">
                    <div className="form-group">
                      <label>
                        First Name:
                        <input
                          type="text"
                          name="firstName"
                          onChange={(e) =>
                            setData({ ...data, firstName: e.target.value })
                          }
                          placeholder="First Name"
                          value={data.firstName}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        Email:
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          onChange={(e) =>
                            setData({ ...data, email: e.target.value })
                          }
                          value={data.email}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        Password:
                        <input
                          type="password"
                          name="password"
                          onChange={(e) =>
                            setData({ ...data, password: e.target.value })
                          }
                          placeholder="Password"
                          value={data.password}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        Enrollment No:
                        <input
                          type="text"
                          name="enrollno"
                          onChange={(e) =>
                            setData({ ...data, enrollno: e.target.value })
                          }
                          placeholder="Enrollment No"
                          value={data.enrollno}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        Course:
                        <select
                          name="course"
                          onChange={(e) =>
                            setData({ ...data, course: e.target.value })
                          }
                          value={data.course}
                          required
                        >
                          <option value="">Select</option>
                          <option value="BSC">BSC</option>
                          <option value="MSC">MSC</option>
                        </select>
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        Division:
                        <select
                          name="division"
                          onChange={(e) =>
                            setData({ ...data, division: e.target.value })
                          }
                          value={data.division}
                          required
                        >
                          <option value="">Select</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        Authority:
                        <select
                          name="authority"
                          onChange={(e) =>
                            setData({ ...data, authority: e.target.value })
                          }
                          value={data.authority}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Student">Regular</option>
                          <option value="NCC Student">NCC</option>
                          <option value="NSS Student">NSS</option>
                          <option value="Sports Student">Sports</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="form-column">
                    <div className="form-group">
                      <label>
                        Last Name:
                        <input
                          type="text"
                          name="lastName"
                          onChange={(e) =>
                            setData({ ...data, lastName: e.target.value })
                          }
                          placeholder="Last Name"
                          value={data.lastName}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        Phone Number:
                        <input
                          type="tel"
                          name="phoneNumber"
                          maxlength="10"
                          onChange={(e) =>
                            setData({ ...data, phoneNumber: e.target.value })
                          }
                          placeholder="Phone Number"
                          value={data.phoneNumber}
                          required
                        />
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        Confirm Password:
                        <input
                          type="password"
                          name="confirmpassword"
                          onChange={(e) =>
                            setData({
                              ...data,
                              confirmpassword: e.target.value,
                            })
                          }
                          placeholder="Confirm password"
                          value={data.confirmpassword}
                          required
                        />
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        Department:
                        <select
                          name="department"
                          onChange={(e) =>
                            setData({ ...data, department: e.target.value })
                          }
                          value={data.department}
                          required
                        >
                          <option value="">Select</option>
                          <option value="IT">IT</option>
                          <option value="CS">CS</option>
                          <option value="MB">MB</option>
                          <option value="BT">BT</option>
                        </select>
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        Year:
                        <select
                          name="year"
                          onChange={(e) =>
                            setData({ ...data, year: e.target.value })
                          }
                          value={data.year}
                          required
                        >
                          <option value="">Select</option>
                          <option value="FY">FY</option>
                          <option value="SY">SY</option>
                          <option value="TY">TY</option>
                        </select>
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        Mentor:
                        <select
                          name="mentorId"
                          onChange={(e) =>
                            setData({ ...data, mentorId: e.target.value })
                          }
                          value={data.mentorId}
                          required
                        >
                          <option value="">Select</option>
                          {mentor.map((mentor) => (
                            <option key={mentor._id} value={mentor._id}>
                              {mentor.mentorFirstName} {mentor.mentorLastName} (
                              {mentor.authority})
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <button className="btn-register" type="Submit">
                      Register
                    </button>
                  </div>
                </form>
              </div>
            )}
            {selectedOption === "Moderator" && (
              <div className="registration-container">
                <h1 className="title">Registration Form</h1>
                <form
                  onSubmit={uregisterModerator}
                  className="registration-form"
                  method="post"
                >
                  <div className="form-column">
                    <div className="form-group">
                      <label>
                        First Name:
                        <input
                          type="text"
                          name="firstName"
                          onChange={(e) =>
                            setDataModerator({
                              ...dataModerator,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="First Name"
                          value={dataModerator.firstName}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        Email:
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          onChange={(e) =>
                            setDataModerator({
                              ...dataModerator,
                              email: e.target.value,
                            })
                          }
                          value={dataModerator.email}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        Password:
                        <input
                          type="password"
                          name="password"
                          onChange={(e) =>
                            setDataModerator({
                              ...dataModerator,
                              password: e.target.value,
                            })
                          }
                          placeholder="Password"
                          value={dataModerator.password}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        User:
                        <input
                          type="text"
                          name="userId"
                          onChange={(e) =>
                            setDataModerator({
                              ...dataModerator,
                              userId: e.target.value,
                            })
                          }
                          placeholder="User"
                          value={dataModerator.userId}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        Department:
                        <select
                          name="batch"
                          onChange={(e) =>
                            setDataModerator({
                              ...dataModerator,
                              department: e.target.value,
                            })
                          }
                          value={dataModerator.department}
                          required
                        >
                          <option value="">Select</option>
                          <option value="IT">IT</option>
                          <option value="CS">CS</option>
                          <option value="MB">MB</option>
                          <option value="BT">BT</option>
                        </select>
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        Mentor:
                        <select
                          name="mentorId"
                          onChange={(e) =>
                            setDataModerator({
                              ...dataModerator,
                              mentorId: e.target.value,
                            })
                          }
                          value={dataModerator.mentorId}
                        >
                          <option value="">Select</option>
                          {mentor.map((mentor) => (
                            <option key={mentor._id} value={mentor._id}>
                              {mentor.mentorFirstName} {mentor.mentorLastName} (
                              {mentor.authority})
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <button type="Submit">Register</button>
                  </div>

                  <div className="form-column">
                    <div className="form-group">
                      <label>
                        Last Name:
                        <input
                          type="text"
                          name="lastName"
                          onChange={(e) =>
                            setDataModerator({
                              ...dataModerator,
                              lastName: e.target.value,
                            })
                          }
                          placeholder="Last Name"
                          value={dataModerator.lastName}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        Phone Number:
                        <input
                          type="tel"
                          name="phoneNumber"
                          maxlength="10"
                          pattern="[0-9]{10}"
                          onChange={(e) =>
                            setDataModerator({
                              ...dataModerator,
                              phoneNumber: e.target.value,
                            })
                          }
                          placeholder="Phone Number"
                          value={dataModerator.phoneNumber}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        Confirm Password:
                        <input
                          type="password"
                          name="confirmpassword"
                          onChange={(e) =>
                            setDataModerator({
                              ...dataModerator,
                              confirmpassword: e.target.value,
                            })
                          }
                          placeholder="Confirm password"
                          value={dataModerator.confirmpassword}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        Authority:
                        <select
                          name="authority"
                          onChange={(e) =>
                            setDataModerator({
                              ...dataModerator,
                              authority: e.target.value,
                            })
                          }
                          value={dataModerator.authority}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Faculty">Faculty</option>
                          <option value="Mentor">Mentor</option>
                          <option value="H.O.D">H.O.D</option>
                          <option value="Co-ordinator">Co-ordinator</option>
                          <option value="Principal">Principal</option>
                        </select>
                      </label>
                    </div>

                    <div className="form-group">
                      <label>
                        Batch:
                        <select
                          name="batch"
                          onChange={(e) =>
                            setDataModerator({
                              ...dataModerator,
                              batch: e.target.value,
                            })
                          }
                          value={dataModerator.batch}
                          required
                        >
                          <option value="">Select</option>
                          <option value="FY">FY</option>
                          <option value="SY">SY</option>
                          <option value="TY">TY</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            )}
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

export default App;
