import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import "../Profile/Profile.css";
import axios from "axios";
import Spinner from "../Components/Spinner";

function Profile() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    enrollNo: "",
    email: "",
    phoneNumber: "",
    batch: "",
    mentor: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:9000/user/profile", {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        });
        console.log(res);
        setLoading(true);
        const responseData = res.data;
        setData({
          name: responseData.firstName + " " + responseData.lastName,
          enrollNo: responseData.enrollno,
          email: responseData.email,
          phoneNumber: responseData.phoneNumber,
          batch: responseData.batch,
          mentor:
            responseData.mentorFirstName + " " + responseData.mentorLastName,
        });
        setLoading(false);
      } catch (err) {
        console.log("ERR", err);
      }
    };

    fetchData();
  }, []);

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
      {isLoading ? (
        <Spinner />
      ) : (
        <main className="main-profile">
          <div className="settings">
            <div className="settings__wrapper">
              <div className="details__form">
                <h1 className="profile__title">Profile</h1>
                {/* <p className="profile__desc"> Personals Details</p> */}
                <form>
                  <div className="form__group">
                    <div>
                      <label>Name</label>
                      <input
                        type="text"
                        value={data.name}
                        placeholder="Your Name"
                      />
                    </div>

                    <div>
                      <label>Enrollnment No:</label>
                      <input
                        type="text"
                        value={data.enrollNo}
                        placeholder="SYL 3108"
                      />
                    </div>
                  </div>

                  <div className="form__group">
                    <div>
                      <label>Email</label>
                      <input
                        type="email"
                        value={data.email}
                        placeholder="example@gmail.com"
                      />
                    </div>

                    <div>
                      <label>Phone Number:</label>
                      <input
                        type="number"
                        value={data.phoneNumber}
                        placeholder="+98--------"
                      />
                    </div>
                  </div>

                  <div className="form__group">
                    <div>
                      <label>Batch</label>
                      <input
                        type="text"
                        value={data.batch}
                        placeholder="year/department/division"
                      />
                    </div>

                    <div>
                      <label>Mentor:</label>
                      <input
                        type="text"
                        value={data.mentor}
                        placeholder="Mentor"
                      />
                    </div>
                  </div>

                  <div className="form__group">
                    <div className="profile__img-btns"></div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default Profile;
