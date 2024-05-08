const express = require(`express`);
const UserController = require("../controllers/user");
const LeaveController = require("../controllers/leave");
const isAuth = require("../middlewares/is-auth");
const router = express.Router();
const { upload } = require("../middlewares/multer");
router.get("/profile", UserController.userDetails);
router.post(
  "/leaveform",
  upload.single("attachment"),
  LeaveController.applyLeave
);
router.get("/leaveAttachment", LeaveController.downloadAttachment);
router.get("/meduVadu", LeaveController.leaveTypeDetails)
module.exports = router;
