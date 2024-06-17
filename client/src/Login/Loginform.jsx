import React, { useEffect, useState } from "react";
import "./Loginform.css";
import { FaUser, FaLock } from "react-icons/fa6";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../Components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Loginform = (props) => {
  const [data, setData] = useState({
    email: "",
    userId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, userId, password } = data;
    try {
      await axios
        .post(
          "http://localhost:9000/auth/login",
          { email, userId, password },
          { withCredentials: true }
        )
        .then(async (result) => {
          console.log(result);
          setLoading(true);
          setTimeout(() => {
            if (result.status === 200) {
              const token = result.data.token;
              console.log(token);
              localStorage.setItem(`token`, token);
              navigate("/dashboard");
            } else {
              localStorage.removeItem("jwt");
              toast.error("Invalid Username and Password !", {
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
            setLoading(false);
          }, 500);
        });
    } catch (error) {
      localStorage.removeItem("jwt");
      toast.error("Invalid Username and Password !", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log(error);
    }
  };

  return (
    <>
      <div className="wrapper">
        {loading ? (
          <Spinner />
        ) : (
          <form method="post" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="email"
                placeholder="Username"
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
              <FaLock className="icon" />
            </div>

            <div className="remember-forget">
    
              <a href="#">Forgot passoword?</a>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

          </form>
        )}
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
    </>
  );
};

export default Loginform;
