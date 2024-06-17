const express = require(`express`);
const LeaveController = require(`../controllers/leave`);
const isModerator = require(`../middlewares/is-moderator`);
const router = express.Router();

router.put("/updateLeave", isModerator, LeaveController.updateLeaveDetails);
router.get("/mentorLeaveList", LeaveController.displayMentorLeaveDetails);
router.get("/leaveList", isModerator, LeaveController.displayLeaveDetails);
router.get(
  "/myLeaveList",
  isModerator,
  LeaveController.studentToMentorLeaveDetails
);

module.exports = router;
