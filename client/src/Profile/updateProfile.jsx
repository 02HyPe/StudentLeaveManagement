import React, { useState, useEffect } from "react";
import "../Profile/updateProfile.css";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function updateProfile() {
  const headers = { authorization: `Bearer ` + localStorage.getItem("token") };
  const [data, setData] = useState({
    type: "",
    firstName: "",
    lastName: "",
    email: "",
    enrollno: "",
    password: "",
    course: "",
    division: "",
    department: "",
    year: "",
    mentorId: "",
    registerUser: "Student",
  });
  const { user_id } = useParams();
  const [mentor, setMentor] = useState([]);

  useEffect(() => {
    const fetchMentorData = async () => {
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

    fetchMentorData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/admin/updateDetails/${user_id}`,
          {
            headers: headers,
          }
        );
        setData({
          type: response.data.type,
          course: response.data.course,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          enrollno: response.data.enrollno,
          phoneNumber: response.data.phoneNumber,
          division: response.data.division,
          department: response.data.department,
          year: response.data.year,
          mentorId: response.data.mentor._id,
        });
        console.log(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchUserData();
  }, []);

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      console.log(data);
      const result = await axios.put(
        "http://localhost:9000/admin/user/update",
        {
          user_id: user_id,

          course: data.course,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          enrollno: data.enrollno,
          phoneNumber: data.phoneNumber,
          division: data.division,
          department: data.department,
          year: data.year,
          mentorId: data.mentorId,
        },
        {
          headers: headers,
        }
      );
      if (result.status === 200) {
        toast.success("Updated Successfully");
      } else {
        toast.error("error");
      }
    } catch (err) {
      console.log(err);
    }
  };
  console.log(data);
  const token = localStorage.getItem(`token`);
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  const userName = tokenPayload.name;
  const userType = tokenPayload.type;

  return (
    <div className="grid-update">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <main className="main-update">
        {data.type === "Student" && (
          <div className="registration-container-update">
            <h1 className="title-update">Update Form</h1>
            <form className="registration-form-update">
              <div className="form-column-update">
                <div className="form-group-update">
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
                    />
                  </label>
                </div>

                <div className="form-group-update">
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
                    />
                  </label>
                </div>

                <div className="form-group-update">
                  <label>
                    Enrollment No:
                    <input
                      type="text"
                      name="enrollno"
                      onChange={(e) =>
                        setData({ ...data, enrollno: e.target.value })
                      }
                      placeholder="Enroll No"
                      value={data.enrollno}
                    />
                  </label>
                </div>

                <div className="form-group-update">
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
                    />
                  </label>
                </div>
              </div>

              <div className="form-column-update">
                <div className="form-group-update">
                  <label>
                    Course:
                    <select
                      name="course"
                      onChange={(e) =>
                        setData({ ...data, course: e.target.value })
                      }
                      value={data.course}
                    >
                      <option value="">Select</option>
                      <option value="BSC">BSC</option>
                      <option value="MSC">MSC</option>
                    </select>
                  </label>
                </div>

                <div className="form-group-update">
                  <label>
                    Department:
                    <select
                      name="department"
                      onChange={(e) =>
                        setData({ ...data, department: e.target.value })
                      }
                      value={data.department}
                    >
                      <option value="">Select</option>
                      <option value="IT">IT</option>
                      <option value="CS">CS</option>
                      <option value="MB">MB</option>
                      <option value="BT">BT</option>
                    </select>
                  </label>
                </div>
                <div className="form-group-update">
                  <label>
                    Year:
                    <select
                      name="year"
                      onChange={(e) =>
                        setData({ ...data, year: e.target.value })
                      }
                      value={data.year}
                    >
                      <option value="">Select</option>
                      <option value="FY">FY</option>
                      <option value="SY">SY</option>
                      <option value="TY">TY</option>
                    </select>
                  </label>
                </div>
                <div className="form-group-update">
                  <label>
                    Division:
                    <select
                      name="division"
                      onChange={(e) =>
                        setData({ ...data, division: e.target.value })
                      }
                      value={data.division}
                    >
                      <option value="">Select</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </label>
                </div>
                <div className="form-group-update">
                  <label>
                    Mentor:
                    <select
                      name="mentorId"
                      onChange={(e) =>
                        setData({ ...data, mentorId: e.target.value })
                      }
                      value={data.mentorId}
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
                <button onClick={updateProfile}>Update</button>
              </div>
            </form>
          </div>
        )}
        {data.type === "Moderator" && (
          <div className="registration-container-update">
            <h1 className="title-update">Update Form</h1>
            <form className="registration-form-update">
              <div className="form-column-update">
                <div className="form-group-update">
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
                    />
                  </label>
                </div>
              </div>

              <div className="form-column-update">
                <div className="form-group-update">
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
                    />
                  </label>
                </div>

                <div className="form-group-update">
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
                    />
                  </label>
                </div>

                <div className="form-group-update">
                  <label>
                    Phone Number:
                    <input
                      type="number"
                      name="phoneNumber"
                      onChange={(e) =>
                        setData({ ...data, phoneNumber: e.target.value })
                      }
                      placeholder="Phone Number"
                      value={data.phoneNumber}
                    />
                  </label>
                </div>

                <div className="form-group-update">
                  <label>
                    Department:
                    <select
                      name="department"
                      onChange={(e) =>
                        setData({ ...data, department: e.target.value })
                      }
                      value={data.department}
                    >
                      <option value="">Select</option>
                      <option value="IT">IT</option>
                      <option value="CS">CS</option>
                      <option value="MB">MB</option>
                      <option value="BT">BT</option>
                    </select>
                  </label>
                </div>

                <div className="form-group-update">
                  <label>
                    Mentor:
                    <select
                      name="mentorId"
                      onChange={(e) =>
                        setData({ ...data, mentorId: e.target.value })
                      }
                      value={data.mentorId}
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

                <button onClick={updateProfile}>Update</button>
              </div>
            </form>
          </div>
        )}
      </main>
      <ToastContainer />
    </div>
  );
}

export default updateProfile;
