const express = require(`express`);
const UserController = require(`../controllers/user`);
const LeaveController = require(`../controllers/leave`);
const isAdmin = require(`../middlewares/is_admin`);
const isAuth = require(`../middlewares/is-auth`);
const { body } = require(`express-validator`);
const router = express.Router();

router.post(
  "/user",
  body("password").trim().isLength({ min: 6 }),
  isAuth,
  isAdmin,
  UserController.createUser
);
router.put("/user/update", isAdmin, UserController.updateUser);
router.post("/user/delete", isAdmin, UserController.deleteUser);
router.get("/userDetail", UserController.displayUser);
router.get("/leaveList", LeaveController.displayLeaveDetails);
router.get("/StudentLeaveList", LeaveController.studentLeaveDetails);
router.get("/registerForm", isAdmin, UserController.registerFormData);
router.get("/userType", UserController.displayUserType);
router.post("/leaveType", LeaveController.createLeave);
router.get("/updateDetails/:user_id", UserController.userDetailsById);

module.exports = router;
