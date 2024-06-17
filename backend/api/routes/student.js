const express = require(`express`);
const LeaveController = require(`../controllers/leave`);
const isAuth = require(`../middlewares/is-auth`);
const router = express.Router();

router.get(`/leaveList`, LeaveController.studentLeaveDetails);

module.exports = router;
