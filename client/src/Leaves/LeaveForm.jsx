import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import "../Leaves/LeaveForm.css";
import axios from "axios";
import Spinner from "../Components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LeaveForm(props) {
  const headers = { authorization: `Bearer ` + localStorage.getItem(`token`) };
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({
    userName: "",
    userEnrollNo: "",
    Mentor: "",
    dateFrom: "",
    dateTo: "",
    typeOfLeave: "",
    attachment: "",
    description: "",
    userAuthority: "",
    division: "",
  });

  const uregister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("dateFrom", data.dateFrom);
    formData.append("dateTo", data.dateTo);
    formData.append("typeOfLeave", data.typeOfLeave);
    formData.append("description", data.description);
    formData.append("attachment", data.attachment);
    try {
      await axios
        .post("https://studentleavemanagement-1.onrender.com/user/leaveForm", formData, {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => {
          console.log(result);

          if (result.request.status === 200 && result.data.eligible === true) {
            toast.success("Leave Applied", {
              position: "top-right",
              autoClose: 2500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } else if (
            result.request.status === 200 &&
            result.data.eligible === false
          ) {
            toast.error("Leave Limit Reached", {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://studentleavemanagement-1.onrender.com/user/profile", {
          headers: headers,
        });
        const updateLoading = () => {
          setLoading(true);          
            const userData = response.data;
            setData({
              ...data,
              userName: userData.firstName + " " + userData.lastName,
              studentEnrollNo: userData.enrollno,
              studentDiv: userData.division,
              studentYear: userData.year,
              userMentor:
                userData.mentorFirstName + " " + userData.mentorLastName,
              userAuthority: userData.authority,
              userDepartment: userData.department,
            });

            setLoading(false);
          
        };
        updateLoading();
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchData();
  }, []);
  const token = localStorage.getItem(`token`);
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  const userName = tokenPayload.name;
  const userType = tokenPayload.type;

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />

      <main className="main">
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            {userType === "Student" && (
              <div className="registration-container-leave">
                <h1 className="title">Request For Leave</h1>
                <form
                  onSubmit={uregister}
                  className="registration-form-leave"
                  method="post"
                >
                  <div className="form-column-leave">
                    <div className="form-group-leave">
                      <label>
                        Name:
                        <input
                          type="text"
                          name="Name"
                          onChange={(e) =>
                            setData({ ...data, userName: e.target.value })
                          }
                          value={data.userName}
                          readOnly
                          placeholder=" Name"
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Enrollment No:
                        <input
                          type="text"
                          name="enrollNo"
                          onChange={(e) =>
                            setData({
                              ...data,
                              studentEnrollNo: e.target.value,
                            })
                          }
                          value={data.studentEnrollNo}
                          readOnly
                          placeholder="Enrollment No"
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Div:
                        <input
                          type="text"
                          name="division"
                          readOnly
                          value={data.studentDiv}
                          placeholder="Division"
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Year:
                        <input
                          type="text"
                          name="year"
                          readOnly
                          value={data.studentYear}
                          placeholder="Year"
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Mentor:
                        <input
                          name="mentor"
                          onChange={(e) =>
                            setData({ ...data, Mentor: e.target.value })
                          }
                          value={data.userMentor}
                          readOnly
                          placeholder=" Mentor"
                          required
                        />
                      </label>
                    </div>
                    <br />

                    <div className="details-header">
                      <h3>Details Of Leave</h3>
                    </div>
                    <br />
                    <div className="form-group-leave">
                      <label>
                        Leave Start:
                        <input
                          type="date"
                          name="leaveStart"
                          onChange={(e) =>
                            setData({ ...data, dateFrom: e.target.value })
                          }
                          value={data.dateFrom}
                          placeholder="dd/mm/yyyy"
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Leave End:
                        <input
                          type="date"
                          name="leaveEnd"
                          onChange={(e) =>
                            setData({ ...data, dateTo: e.target.value })
                          }
                          value={data.dateTo}
                          placeholder="dd/mm/yyyy"
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Leave Type:
                        <select
                          name="leaveType"
                          onChange={(e) =>
                            setData({ ...data, typeOfLeave: e.target.value })
                          }
                          value={data.typeOfLeave}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Vacation">Vacation Leave</option>
                          <option value="Medical">Medical Leave</option>
                          <option value="Sports">Sports Leave</option>
                          <option value="NCC">NCC Leave</option>
                          <option value="NSS">NSS Leave</option>
                          <option value="Others">Others</option>
                        </select>
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Browse Documnets:
                        <input
                          name="attachment"
                          type="file"
                          placeholder="Choose file"
                          onChange={(e) =>
                            setData({ ...data, attachment: e.target.files[0] })
                          }
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Description:
                        <textarea
                          name="description"
                          onChange={(e) =>
                            setData({ ...data, description: e.target.value })
                          }
                          value={data.description}
                        ></textarea>
                      </label>
                    </div>

                    <button type="Submit">Apply</button>
                  </div>
                </form>
              </div>
            )}
            {userType === "Moderator" && (
              <div className="registration-container-leave">
                <h1 className="title">Request For Leave</h1>
                <form
                  onSubmit={uregister}
                  className="registration-form-leave"
                  method="post"
                >
                  <div className="form-column-leave">
                    <div className="form-group-leave">
                      <label>
                        Name:
                        <input
                          type="text"
                          name="Name"
                          onChange={(e) =>
                            setData({ ...data, userName: e.target.value })
                          }
                          value={data.userName}
                          readOnly
                          placeholder=" Name"
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Department:
                        <input
                          type="text"
                          name="enrollNo"
                          value={data.userDepartment}
                          readOnly
                          placeholder="Department"
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Authority:
                        <input
                          type="text"
                          name="division"
                          readOnly
                          value={data.userAuthority}
                          placeholder="Authority"
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Mentor:
                        <input
                          name="mentor"
                          value={data.userMentor}
                          readOnly
                          placeholder=" Mentor"
                          required
                        />
                      </label>
                    </div>
                    <br />

                    <div className="details-header">
                      <h3>Details Of Leave</h3>
                    </div>
                    <br />
                    <div className="form-group-leave">
                      <label>
                        Leave Start:
                        <input
                          type="date"
                          name="leaveStart"
                          onChange={(e) =>
                            setData({ ...data, dateFrom: e.target.value })
                          }
                          value={data.dateFrom}
                          placeholder="dd/mm/yyyy"
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Leave End:
                        <input
                          type="date"
                          name="leaveEnd"
                          onChange={(e) =>
                            setData({ ...data, dateTo: e.target.value })
                          }
                          value={data.dateTo}
                          placeholder="dd/mm/yyyy"
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Leave Type:
                        <select
                          name="leaveType"
                          onChange={(e) =>
                            setData({ ...data, typeOfLeave: e.target.value })
                          }
                          value={data.typeOfLeave}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Medical">Medical Leave</option>
                          <option value="Casual">Casual Leave</option>
                          <option value="Vacation">Vacation Leave</option>
                          <option value="Others">Others</option>
                        </select>
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Browse Documnets:
                        <input
                          name="attachment"
                          type="file"
                          placeholder="Choose file"
                          onChange={(e) =>
                            setData({ ...data, attachment: e.target.files[0] })
                          }
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Description:
                        <textarea
                          name="description"
                          onChange={(e) =>
                            setData({ ...data, description: e.target.value })
                          }
                          value={data.description}
                        ></textarea>
                      </label>
                    </div>

                    <button type="Submit">Apply</button>
                  </div>
                </form>
              </div>
            )}
            {userType === "Admin" && (
              <div className="registration-container-leave">
                <h1 className="title">Request For Leave</h1>
                <form
                  onSubmit={uregister}
                  className="registration-form-leave"
                  method="post"
                >
                  <div className="form-column-leave">
                    <div className="form-group-leave">
                      <label>
                        Name:
                        <input
                          type="text"
                          name="Name"
                          onChange={(e) =>
                            setData({ ...data, userName: e.target.value })
                          }
                          value={data.userName}
                          readOnly
                          placeholder=" Name"
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Department:
                        <input
                          type="text"
                          name="enrollNo"
                          value={data.userDepartment}
                          readOnly
                          placeholder="Department"
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Authority:
                        <input
                          type="text"
                          name="division"
                          readOnly
                          value={data.userAuthority}
                          placeholder="Authority"
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Mentor:
                        <input
                          name="mentor"
                          value={data.userMentor}
                          readOnly
                          placeholder=" Mentor"
                          required
                        />
                      </label>
                    </div>
                    <br />

                    <div className="details-header">
                      <h3>Details Of Leave</h3>
                    </div>
                    <br />
                    <div className="form-group-leave">
                      <label>
                        Leave Start:
                        <input
                          type="date"
                          name="leaveStart"
                          onChange={(e) =>
                            setData({ ...data, dateFrom: e.target.value })
                          }
                          value={data.dateFrom}
                          placeholder="dd/mm/yyyy"
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Leave End:
                        <input
                          type="date"
                          name="leaveEnd"
                          onChange={(e) =>
                            setData({ ...data, dateTo: e.target.value })
                          }
                          value={data.dateTo}
                          placeholder="dd/mm/yyyy"
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Leave Type:
                        <select
                          name="leaveType"
                          onChange={(e) =>
                            setData({ ...data, typeOfLeave: e.target.value })
                          }
                          value={data.typeOfLeave}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Medical">Medical Leave</option>
                          <option value="Casual">Casual Leave</option>
                          <option value="Vacation">Vacation Leave</option>
                          <option value="Others">Others</option>
                        </select>
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Browse Documnets:
                        <input
                          name="attachment"
                          type="file"
                          placeholder="Choose file"
                          onChange={(e) =>
                            setData({ ...data, attachment: e.target.files[0] })
                          }
                        />
                      </label>
                    </div>

                    <div className="form-group-leave">
                      <label>
                        Description:
                        <textarea
                          name="description"
                          onChange={(e) =>
                            setData({ ...data, description: e.target.value })
                          }
                          value={data.description}
                        ></textarea>
                      </label>
                    </div>

                    <button type="Submit">Apply</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
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
    </div>
  );
}

export default LeaveForm;
