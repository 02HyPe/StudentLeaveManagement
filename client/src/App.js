import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Loginform from "./Login/Loginform";
import LoginformAdmin from "./Login/LoginformAdmin";
import RegisterForm from "./Register/RegisterForm";
import Dashboard from "./Dashboard";
import Profile from "./Profile/Profile";
import Users from "./Components/Users";
import { DataProvider } from "./DataContext";
import LeaveForm from "./Leaves/LeaveForm";
import LeaveRequest from "./Leaves/LeaveRequest";
import LeaveType from "./Leaves/LeaveType";
import { isLoggedIn } from "./auth";
import UpdateProfile from "./Profile/updateProfile";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: "",
      openSidebarToggle: false,
      loading: false,
    };
  }

  render() {
    return (
      <DataProvider>
        <React.Fragment>
          <Router>
            <Routes>
              <Route path="/" element={<Loginform />} />

              <Route path="/Admin" element={<LoginformAdmin />} />
              <Route exact path="/register" element={<RegisterForm />} />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route exact path="/user" element={<Users />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/leaveForm" element={<LeaveForm />} />
                <Route exact path="/leaveRequest" element={<LeaveRequest />} />
                <Route exact path="/leaveType" element={<LeaveType />} />
                <Route
                  exact
                  path="/updateProfile/:user_id"
                  element={<UpdateProfile />}
                />
              </Route>
            </Routes>
          </Router>
        </React.Fragment>
      </DataProvider>
    );
  }
}

const PrivateRoute = () => {
  return isLoggedIn() ? <Outlet /> : <Navigate to={"/"} />;
};

export default App;
