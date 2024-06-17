// import React, { useState } from "react";
// import "./Loginform.css";
// import { FaUser, FaLock } from "react-icons/fa6";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const Loginform = () => {
//   const [data, setData] = useState({
//     userId: "",
//     password: "",
//   });
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { userId, password } = data;
//     try {
//       await axios
//         .post("http://localhost:9000/auth/login", { userId, password })
//         .then((result) => {
//           console.log(result);
//           if (result.status === 200) {
//             const token = result.data.token;
//             console.log(token);
//             localStorage.setItem(`token`, token);
//             navigate("/dashboard");
//           } else {
//             alert("invalid credentials");
//           }
//         });
//     } catch (error) {
//       alert("invalid credentials");
//       console.log(error);
//     }
//   };

//   return (
//     <div className="wrapper">
//       <form method="post" onSubmit={handleSubmit}>
//         <h1>Login</h1>
//         <div className="input-box">
//           <input
//             type="text"
//             placeholder="user"
//             onChange={(e) => setData({ ...data, userId: e.target.value })}
//             required
//           />
//           <FaUser className="icon" />
//         </div>
//         <div className="input-box">
//           <input
//             type="password"
//             placeholder="Password"
//             onChange={(e) => setData({ ...data, password: e.target.value })}
//             required
//           />
//           <FaLock className="icon" />
//         </div>

//         <div className="remember-forget">
//           <a href="#">Forgot passoword?</a>
//         </div>

//         <button type="submit">Login</button>

//         <div className="register-link">
//           <p>
//             Don't have an account? <a href="/register">Register</a>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Loginform;
