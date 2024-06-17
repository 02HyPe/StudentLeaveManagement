const LeaveDetails = require(`../config/mongoose.model`).leaveDetailsModel;
const Leave = require(`../config/mongoose.model`).leaveModel;
const User = require(`../config/mongoose.model`).userModel;
const fs = require("fs");
const mailer = require(`nodemailer`);
const path = require("path");
const { upload } = require("../middlewares/multer");

const createLeave = async (req, res, next) => {
  try {
    const body = req.body;
    logger.info("leavetype details", body);
    const leave = new Leave({
      numberOfLeave: body.leaveDays,
      authority: body.authority,
    });
    if (body.publicHoliday === true) {
      leave["leaveName"] = body.leaveName;
      leave["leaveDate"] = body.leaveDate;
      leave["typeOfLeave"] = "Public Holiday";
    } else if (body.publicHoliday === false) {
      leave["typeOfLeave"] = body.leaveName;
    }
    logger.info(leave);
    const result = await leave.save();

    res.status(200).json(result);
  } catch (err) {
    logger.info(err);
    res.status(400).json({ error: err + "error with leave upload" });
  }
};

const leaveTypeDetails = async (req, res, next) => {
  try {
    const leaveType = await Leave.find({
      typeOfLeave: { $ne: "Public Holiday" },
    });
    const currentDate = new Date();

    const holidayLeave = await Leave.aggregate([
      {
        $match: {
          leaveDate: { $exists: true, $ne: null },
          leaveDate: { $gt: currentDate },
        },
      },
      {
        $addFields: {
          dateDifference: { $subtract: ["$leaveDate", currentDate] },
        },
      },
      {
        $sort: {
          dateDifference: 1,
        },
      },
      {
        $limit: 3,
      },
    ]);
    const leavesType = leaveType.map((leave) => ({
      name: leave.typeOfLeave,
      days: leave.numberOfLeave,
    }));

    const holidayLeaves = holidayLeave.map((leave) => ({
      name: leave.leaveName,
      days: leave.numberOfLeave,
      date: leave.leaveDate,
    }));
    logger.info(leavesType, holidayLeaves, "adada");
    return res.status(200).json({ leavesType, holidayLeaves });
  } catch (err) {
    logger.error(err, "leavetype details err");
    return res.status(501).json({ msg: "error with leave type display" });
  }
};

const applyLeave = async (req, res, next) => {
  try {
    const body = req.body;
    const dateTo = new Date(body.dateTo);
    let dateFrom = new Date(body.dateFrom);
    const currentDate = new Date();
    const dates = [];
    let leaves = 0;

    const user = await User.findById(req.user_id);
    logger.info(user, `----------------------------------------`);
    const mentor = await User.findById(user.mentor._id);
    logger.info("leaveDetails controller", user, req.user_id);

    const leaveDtls = await Leave.find({ typeOfLeave: "Public Holiday" });
    logger.info(leaveDtls, "array of dates");

    currentDate.setDate(currentDate.getDate() - 1);

    if (dateFrom < currentDate || dateFrom > dateTo) {
      return res.status(400).json({ error: `Invalid date range` });
    }

    while (dateFrom <= dateTo) {
      if (dateFrom.getDay() !== 0) {
        console.log(dateFrom.getDay());
        leaves += 1;
      }
      dates.push(dateFrom);
      dateFrom.setDate(dateFrom.getDate() + 1);
    }

    const ttlLeaveDays = user.leave + leaves;

    const leaveDetails = new LeaveDetails({
      userInfo: {
        type: user.type,
        _id: user._id,
        email: user.email,
      },
      typeOfLeave: body.typeOfLeave,
      dateFrom: body.dateFrom,
      dateTo: body.dateTo,
      ttlLeaves: leaves,
      description: body.description,
      handledBy: "Pending",
      status: "Pending",
    });

    if (ttlLeaveDays > 10) {
      if (
        body.typeOfLeave === "NSS" ||
        body.typeOfLeave === "NCC" ||
        body.typeOfLeave === "Sports" ||
        body.typeOfLeave === "Medical"
      ) {
        if (ttlLeaveDays > 45) {
          return res.status(200).json({ eligible: false });
        }

        leaveDetails["coOrdinatorHandledBy"] = "Pending";
        leaveDetails["coOrdinatorStatus"] = "Pending";
        leaveDetails["activityLeave"] = ttlLeaveDays;
      } else {
        return res.status(200).json({ eligible: false });
      }
    }

    logger.info("attachments------", body.attachment);

    if (req.file && req.file.path) {
      leaveDetails["attachment"] = {
        fileName: req.file.filename,
        filePath: req.file.path,
      };
    }

    logger.info("leave details", leaveDetails);

    const result = await leaveDetails.save();
    const leaveInduction = await User.findOneAndUpdate(
      { _id: user._id },
      { leave: ttlLeaveDays },
      {
        new: true,
      }
    );

    const transporter = mailer.createTransport({
      port: 587,
      secure: false,
      service: `gmail`,
      auth: {
        user: `tubeyunbox000@gmail.com`,
        pass: `fzyn qngh alhn cfiy`,
      },
    });
    const info = await transporter.sendMail({
      from: {
        name: `Student Leave Management`,
        address: `tubeyunbox000@gmail.com`,
      },
      to: `${mentor.email}`,
      subject: `Leave Application`,
      text: `${user.firstName} ${user.lastName} applied for a leave \n- ${
        leaveDetails[`typeOfLeave`]
      } from ${leaveDetails[`dateFrom`]} to ${
        leaveDetails[`dateTo`]
      } \n- for total ${leaveDetails[`ttlLeaves`]} days \n- leave description ${
        leaveDetails[`description`]
      }`,
    });
    logger.info(user, info.messageId, "fgyhufghffghgfhfghfghfghfghfgh");

    logger.info("leave form applied", result, leaveInduction);

    return res
      .status(200)
      .json({ msg: "Leave applied successfully", eligible: true });
  } catch (err) {
    logger.error(err, "Error while applying leave form");

    if (req.file) {
      fs.unlinkSync(path.join(__dirname, "..", req.file.path));
    }

    return res.status(400).json({ err: "Error with leave form" });
  }
};

const displayLeaveDetails = async (req, res, next) => {
  try {
    const body = req.body;
    const leaveResult = await LeaveDetails.find({ "userInfo.type": "Student" });
    const leavesPending = await LeaveDetails.countDocuments({
      status: "Pending",
    });
    const leavesApproved = await LeaveDetails.countDocuments({
      status: "Approved",
    });
    const leavesRejected = await LeaveDetails.countDocuments({
      status: "Rejected",
    });
    const promiseArray = leaveResult.map(async (leave) => {
      const userResult = await User.findById(leave.userInfo._id);
      let attachmentData = null;

      const leaveData = {
        leave_id: leave._id,
        userAuthority: userResult.authority,
        userFirstName: userResult.firstName,
        userLastName: userResult.lastName,
        enrollno: userResult.enrollno,
        typeOfLeave: leave.typeOfLeave,
        ttlLeaves: leave.ttlLeaves,
        mentorFirstName: userResult.mentor.firstName,
        mentorLastName: userResult.mentor.lastName,
        leaveStatus: leave.status,
        dateFrom: leave.dateFrom,
        dateTo: leave.dateTo,
        description: leave.description,
      };
      if (leave.attachment !== null) {
        leaveData["attachment"] = leave.attachment;
      }

      return leaveData;
    });
    const leaveData = await Promise.all(promiseArray);
    return res.status(200).json({
      leaveData,
      pendingLeaves: leavesPending,
      approvedLeaves: leavesApproved,
      rejectedLeaves: leavesRejected,
    });
  } catch (err) {
    logger.info("leave list err", err);
    return res
      .status(400)
      .json({ error: "could not retireve student leave list " });
  }
};

const displayMentorLeaveDetails = async (req, res, next) => {
  try {
    const leaveResult = await LeaveDetails.find({
      "userInfo.type": "Moderator",
    });

    const [leavesPending, leavesApproved, leavesRejected] = await Promise.all([
      LeaveDetails.countDocuments({ status: "Pending" }),
      LeaveDetails.countDocuments({ status: "Approved" }),
      LeaveDetails.countDocuments({ status: "Rejected" }),
    ]);

    const leaveData = await Promise.all(
      leaveResult.map(async (leave) => {
        const userResult = await User.findById(leave.userInfo._id);

        const mentorResult = await User.findById(userResult.mentor["_id"]);

        return {
          leave_id: leave._id,
          userAuthority: userResult.authority,
          userFirstName: userResult.firstName,
          userLastName: userResult.lastName,
          enrollno: userResult.enrollno,
          typeOfLeave: leave.typeOfLeave,
          ttlLeaves: leave.ttlLeaves,
          leaveStatus: leave.status,
          dateFrom: leave.dateFrom,
          dateTo: leave.dateTo,
          description: leave.description,
          mentorFirstName: mentorResult.firstName,
          mentorLastName: mentorResult.lastName,
          attachment: leave.attachment,
        };
      })
    );
    logger.info(leaveData, "awjkdnawkjdnawjkdbawk");
    res.status(200).json({
      leaveData,
      pendingLeaves: leavesPending,
      approvedLeaves: leavesApproved,
      rejectedLeaves: leavesRejected,
    });
  } catch (error) {
    logger.error("Error fetching mentor leave details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const studentToMentorLeaveDetails = async (req, res, next) => {
  try {
    const body = req.body;
    const moderatorResult = await User.findById(req.user_id);
    logger.info(moderatorResult, "--moderatorResult");

    const studentResult = await User.find({
      "mentor._id": moderatorResult._id,
    });
    logger.info("student", studentResult);

    let leaves = [];
    let leavesPending = 0;
    let leavesApproved = 0;
    let leavesRejected = 0;

    await Promise.all(
      studentResult.map(async (student) => {
        const leaveDetails = await LeaveDetails.find({
          "userInfo._id": student._id,
        });

        logger.info(leaveDetails, "leavedetails");
        leaveDetails.forEach((leave) => {
          const leaveRecord = {
            leave_id: leave._id,
            userFirstName: student.firstName,
            userLastName: student.lastName,
            enrollno: student.enrollno,
            typeOfLeave: leave.typeOfLeave,
            ttlLeaves: leave.ttlLeaves,
            mentorFirstName: student.mentor.firstName,
            mentorLastName: student.mentor.lastName,
            leaveStatus: leave.status,
            dateFrom: leave.dateFrom,
            dateTo: leave.dateTo,
            description: leave.description,
            leave: student.leave,
            leaveOutof: 7,
          };

          if (leave.attachment !== null) {
            leaveRecord["attachment"] = leave.attachment;
          }
          if (leaveRecord["leaveStatus"] === "Pending") {
            leavesPending += 1;
          }
          if (leaveRecord["leaveStatus"] === "Approved") {
            leavesApproved += 1;
          }
          if (leaveRecord["leaveStatus"] === "Rejected") {
            leavesRejected += 1;
          }

          leaves.push(leaveRecord);
        });
      })
    );
    logger.info("--------", leavesPending);
    logger.info(leaves, "leaves of mentor-to-student");
    return res.status(200).json({
      leaves,
      pendingLeaves: leavesPending,
      approvedLeaves: leavesApproved,
      rejectedLeaves: leavesRejected,
    });
  } catch (err) {
    logger.error("leave list err", err);
    return res
      .status(400)
      .json({ error: "Could not retrieve student leave list" });
  }
};

const studentLeaveDetails = async (req, res, next) => {
  try {
    const body = req.body;
    const studentResult = await User.findById(req.user_id);
    logger.info("student----", studentResult);

    const leaveResult = await LeaveDetails.find({
      "userInfo._id": studentResult._id,
    });
    const leavesPending = await LeaveDetails.countDocuments({
      "userInfo._id": studentResult._id,
      status: "Pending",
    });
    const leavesApproved = await LeaveDetails.countDocuments({
      "userInfo._id": studentResult._id,
      status: "Approved",
    });
    const leavesRejected = await LeaveDetails.countDocuments({
      "userInfo._id": studentResult._id,
      status: "Rejected",
    });
    logger.info(`----studentresandleave`, leaveResult);
    let leaves = [];
    leaveResult.forEach((leave) => {
      const leaveRecord = {
        leave_id: leave._id,
        userFirstName: studentResult.firstName,
        userLastName: studentResult.lastName,
        enrollno: studentResult.enrollno,
        typeOfLeave: leave.typeOfLeave,
        ttlLeaves: leave.ttlLeaves,
        mentorFirstName: studentResult.mentor.firstName,
        mentorLastName: studentResult.mentor.lastName,
        leaveStatus: leave.status,
        dateFrom: leave.dateFrom,
        dateTo: leave.dateTo,
        description: leave.description,
        leave: studentResult.leave,
        leaveOutof: 7,
      };
      if (leave.attachment !== null) {
        leaveRecord["attachment"] = leave.attachment;
      }
      leaves.push(leaveRecord);
    });
    logger.info("student leave list", leaves);
    return res.status(200).json({
      leaves,
      pendingLeaves: leavesPending,
      approvedLeaves: leavesApproved,
      rejectedLeaves: leavesRejected,
    });
  } catch (err) {
    logger.info("errror with student leave ", err);
    return res.status(400).json({ error: err });
  }
};

const updateLeaveDetails = async (req, res, next) => {
  try {
    const body = req.body;
    const leaveResult = await LeaveDetails.findById(body.leave_id);
    const leaveUserResult = await User.findById(leaveResult.userInfo._id);
    const userResult = await User.findById(req.user_id);
    logger.info("----- leveuser", leaveUserResult);

    let leaveUserResultUpdate;
    if (leaveUserResult.authority === "Student") {
      if (
        leaveResult.typeOfLeave === "NSS" ||
        leaveResult.typeOfLeave === "NCC" ||
        leaveResult.typeOfLeave === "Sports"
      ) {
        if (leaveResult.coOrdinatorStatus === "Approved") {
          if (body.approve === true) {
            leaveUserResultUpdate = await LeaveDetails.findOneAndUpdate(
              { _id: leaveResult._id },
              {
                status: "Approved",
                handledBy: userResult.firstName + " " + userResult.lastName,
              },
              {
                new: true,
              }
            );
          } else if (body.approve === false) {
            leaveUserResultUpdate = await LeaveDetails.findOneAndUpdate(
              { _id: leaveResult._id },
              {
                status: "Rejected",
                handledBy: userResult.firstName + " " + userResult.lastName,
              },
              {
                new: true,
              }
            );
          }
        } else if (leaveResult.coOrdinatorStatus === "Pending") {
          if (userResult.authority === "Co-ordinator") {
            if (body.approve === true) {
              leaveUserResultUpdate = await LeaveDetails.findOneAndUpdate(
                { _id: leaveResult._id },
                {
                  coOrdinatorStatus: "Approved",
                  coOrdinatorHandledBy:
                    userResult.firstName + " " + userResult.lastName,
                },
                {
                  new: true,
                }
              );
            } else if (body.approve === false) {
              leaveUserResultUpdate = await LeaveDetails.findOneAndUpdate(
                { _id: leaveResult._id },
                {
                  coOrdinatorStatus: "Rejected",
                  coOrdinatorHandledBy:
                    userResult.firstName + " " + userResult.lastName,
                },
                {
                  new: true,
                }
              );
            }
          } else {
            logger.info("coordinator update leave error ");
            return res
              .status(401)
              .json({ msg: "coOrdinator approval remaining" });
          }
        }
      } else {
        if (body.approve === true) {
          leaveUserResultUpdate = await LeaveDetails.findOneAndUpdate(
            { _id: leaveResult._id },
            {
              status: "Approved",
              handledBy: userResult.firstName + " " + userResult.lastName,
            },
            {
              new: true,
            }
          );
        } else if (body.approve === false) {
          leaveUserResultUpdate = await LeaveDetails.findOneAndUpdate(
            { _id: leaveResult._id },
            {
              status: "Rejected",
              handledBy: userResult.firstName + " " + userResult.lastName,
            },
            {
              new: true,
            }
          );
        }
      }
    }
    if (
      leaveUserResult.authority === "Faculty" ||
      leaveUserResult.authority === "Mentor"
    ) {
      if (req.authority === "H.O.D") {
        if (body.approve === true) {
          leaveUserResultUpdate = await LeaveDetails.findOneAndUpdate(
            { _id: leaveResult._id },
            {
              status: "Approved",
              handledBy: userResult.firstName + " " + userResult.lastName,
            },
            {
              new: true,
            }
          );
        } else if (body.approve === false) {
          leaveUserResultUpdate = await LeaveDetails.findOneAndUpdate(
            { _id: leaveResult._id },
            {
              status: "Rejected",
              handledBy: userResult.firstName + " " + userResult.lastName,
            },
            {
              new: true,
            }
          );
        }
      } else {
        return res.status(401).json({ msg: "unauthorized" });
      }
    }
    if (leaveUserResult.authority === "H.O.D") {
      if (req.authority === "Principal") {
        if (body.approve === true) {
          leaveUserResultUpdate = await LeaveDetails.findOneAndUpdate(
            { _id: leaveResult._id },
            {
              status: "Approved",
              handledBy: userResult.firstName + " " + userResult.lastName,
            },
            {
              new: true,
            }
          );
        } else if (body.approve === false) {
          leaveUserResultUpdate = await LeaveDetails.findOneAndUpdate(
            { _id: leaveResult._id },
            {
              status: "Rejected",
              handledBy: userResult.firstName + " " + userResult.lastName,
            },
            {
              new: true,
            }
          );
        }
      } else {
        return res.status(401).json({ msg: "unauthorized" });
      }
    }
    let status;
    if (body.approve === true) {
      status = "Approved";
    } else {
      status = Rejected;
    }
    const updatedUser = await User.findById(leaveUserResult._id);
    const transporter = mailer.createTransport({
      port: 587,
      secure: false,
      service: `gmail`,
      auth: {
        user: `tubeyunbox000@gmail.com`,
        pass: `fzyn qngh alhn cfiy`,
      },
    });
    const info = await transporter.sendMail({
      from: {
        name: `Student Leave Management`,
        address: `tubeyunbox000@gmail.com`,
      },
      to: `${leaveUserResult.email}`,
      subject: `Leave ${status}`,
      text: `Your leave have been ${status}`,
    });
    logger.info(user, info.messageId);
    logger.info("successfully updated leave request", leaveUserResultUpdate);
    return res.status(200).json({ msg: "successfully updated leave request" });
  } catch (err) {
    logger.info(`error with approving leave form `, err);
    return res.status(400).send();
  }
};

const downloadAttachment = async (req, res, next) => {
  try {
    const body = req.body;
    const leaveResult = await LeaveDetails.findById(body.leave_id);
    const fileName = leaveResult.attachment["fileName"];
    const filePath = leaveResult.attachment["filePath"];
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return next(err);
      }
      res.send(data);
    });
  } catch (err) {
    logger.info("error with download attachment");
    res
      .status(502)
      .json({ msg: "something went wrong while downloading file" });
  }
};

module.exports = {
  leaveTypeDetails: leaveTypeDetails,
  createLeave: createLeave,
  applyLeave: applyLeave,
  displayMentorLeaveDetails: displayMentorLeaveDetails,
  displayLeaveDetails: displayLeaveDetails,
  studentLeaveDetails: studentLeaveDetails,
  studentToMentorLeaveDetails: studentToMentorLeaveDetails,
  updateLeaveDetails: updateLeaveDetails,
  downloadAttachment: downloadAttachment,
};
