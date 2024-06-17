const User = require("../config/mongoose.model").userModel;
const LeaveDetails = require(`../config/mongoose.model`).leaveDetailsModel;
const Leave = require(`../config/mongoose.model`).leaveModel;
const bcrypt = require(`bcryptjs`);
const { validationResult } = require(`express-validator`);
const logger = global.logger;

const registerFormData = async (req, res, next) => {
  try {
    logger.info("in registerFormData");
    const regData = await User.find({ type: "Moderator" });

    logger.info(regData, "------------");
    let result = [];
    regData.forEach((regData) => {
      const data = {
        _id: regData._id,
        mentorFirstName: regData.firstName,
        mentorLastName: regData.lastName,
        authority: regData.authority,
      };
      result.push(data);
    });
    logger.info(result);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(502).json({ err: "failed to get predefined form data" });
  }
};

const createUser = async (req, res, next) => {
  try {
    const body = req.body;
    logger.info(body);
    const type = body.type;
    const alreadyExist = await User.find({
      email: body.email,
    });
    if (alreadyExist.email) {
      return res.status(403).json({ error: "email already exist" });
    }
    logger.info(alreadyExist);
    if (!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(body.password)) {
      return res.status(400).json({ error: "password weak err" });
    }
    const password = await bcrypt.hash(body.password, 12);
    const leaveDays = await Leave.find();
    logger.info(leaveDays);
    let user;
    user = new User({
      type: type,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      password: password,
      phoneNumber: body.phoneNumber,
      department: body.department,
      leave: 0,
    });
    const mentorResult = await User.findById(body.mentorId);
    logger.info(mentorResult, "--mentor");
    if (type === "Student") {
      const mentorResult = await User.findById(body.mentorId);
      logger.info(type);
      user["userId"] = body.email;
      user["authority"] = body.authority;
      user["enrollno"] = body.enrollno.toUpperCase();
      user["course"] = body.course;
      user["division"] = body.division.toUpperCase();
      user["year"] = body.year.toUpperCase();
      user["mentor"] = {
        _id: mentorResult._id,
        firstName: mentorResult.firstName,
        lastName: mentorResult.lastName,
      };
      user["leave"] = 0;
    } else if (type === "Moderator") {
      if (body.authority === "Principal") {
        user["userId"] = body.userId;
        user["authority"] = body.authority;
        user["batch"] = body.batch;
      } else {
        user["userId"] = body.userId;
        user["authority"] = body.authority;
        user["mentor"] = {
          _id: mentorResult._id,
          firstName: mentorResult.firstName,
          lastName: mentorResult.lastName,
        };
        user["batch"] = body.batch;
      }
      console.log(type);
    }
    console.log(user);
    const result = await user.save();
    return res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ err: "error occured while creating user" });
    console.log(`error occured while creating user`, err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    logger.info("IN USER UPDATE FUNCTION");
    const body = req.body;

    logger.info("user", req.params.user_id);
    const user = await User.findById(body.user_id);
    let updatedUser;
    const mentorUser = await User.findById(body.mentorId);
    if (user.type === "Student") {
      updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          firstName: body.firstName,
          lastName: body.lastName,
          phoneNumber: body.phoneNumber,
          department: body.department,
          batch: body.batch,
          enrollno: body.enrollno,
          course: body.course,
          division: body.division,
          year: body.year,
          mentor: {
            _id: mentorUser["_id"],
            firstName: mentorUser["firstName"],
            lastName: mentorUser["lastName"],
          },
        },
        {
          new: true,
        }
      );

      logger.info(updatedUser, "--- updated User");
      return res.status(200).json("user Updated successfully");
    } else if (user.type === "Moderator") {
      const result = await User.findOneAndUpdate(
        { _id: user._id },
        {
          firstName: body.firstName,
          lastName: body.lastName,
          phoneNumber: body.phoneNumber,
          department: body.department,
          batch: body.batch,
          authority: body.authority,
          mentor: {
            _id: mentorUser["_id"],
            firstName: mentorUser["firstName"],
            lastName: mentorUser["lastName"],
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json(result);
    }
  } catch (err) {
    res.status(400).json({ err: "error occured while updating user" });
    console.log(`error occured while updating user`, err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const body = req.body;
    const user = await User.findById(body.user_id);
    logger.info("User deleting", user);
    if (user === null) {
      logger.info("User is null");
      return res.status(500).json({ msg: "user does not exist" });
    }
    logger.info("deleting user", user);
    const resultLeaveDetails = await LeaveDetails.deleteMany({
      "userInfo._id": user._id,
    });

    const resultUser = await User.findOneAndDelete(user._id);
    logger.info(resultLeaveDetails, "deleting user id");
    return res.status(200).json({ msg: "deleted successfully" });
  } catch (err) {
    logger.info("error while deleting user");
    return res.status(400).json();
  }
};

const displayUser = async (req, res, next) => {
  try {
    const users = await User.find();
    const studentCount = await User.countDocuments({ type: "Student" });
    const moderatorCount = await User.countDocuments({ type: "Moderator" });
    const adminCount = await User.countDocuments({ type: "Admin" });
    logger.info(users);
    const usersInfo = [];
    users.forEach((user) => {
      const userInfo = {
        user_id: user._id,
        type: user.type,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        authority: user.authority,
        department: user.department,
      };
      usersInfo.push(userInfo);
    });
    return res.status(200).json({
      usersInfo,
      studentCount: studentCount,
      moderatorCount: moderatorCount,
      adminCount: adminCount,
    });
  } catch (err) {
    logger.info("failed to display user");
    return res.status(500).json({ msg: "failed to retrieve data" });
  }
};

const displayUserType = async (req, res, next) => {
  try {
    const users = await User.find({ type: req.query.type });
    logger.info(users);
    const usersInfo = [];
    users.forEach((user) => {
      const userInfo = {
        user_id: user._id,
        type: user.type,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        authority: user.authority,
        department: user.department,
      };
      if (req.query.type === "Student") {
        userInfo["enrollno"] = user.enrollno;
      }
      usersInfo.push(userInfo);
    });
    logger.info("usersInfo", usersInfo);
    return res.status(200).json(usersInfo);
  } catch (err) {
    logger.info("failed to display user");
    return res.status(500).json({ msg: "failed to retrieve data" });
  }
};

const userDetails = async (req, res, next) => {
  try {
    logger.info(req.user_id);
    const userResult = await User.findById(req.user_id);
    logger.info(userResult);
    const mentor = await User.findById(userResult.mentor._id);
    const type = req.userType;
    const userInfo = {
      firstName: userResult.firstName,
      lastName: userResult.lastName,
      email: userResult.email,
      phoneNumber: userResult.phoneNumber,
    };
    if (type === "Moderator") {
      userInfo["batch"] = userResult.batch;
      userInfo["authority"] = userResult.authority;
      userInfo["department"] = userResult.department;
      userInfo["mentorFirstName"] = mentor.firstName;
      userInfo["mentorLastName"] = mentor.lastName;
    } else if (type === "Student") {
      userInfo["enrollno"] = userResult.enrollno;
      userInfo["mentorFirstName"] = mentor.firstName;
      userInfo["mentorLastName"] = mentor.lastName;
      userInfo["department"] = userResult.department;
      userInfo["course"] = userResult.course;
      userInfo["division"] = userResult.division;
      userInfo["year"] = userResult.year;
      userInfo["batch"] =
        userResult.year + userResult.department + "-" + userResult.division;
    }
    logger.info("user profile", userInfo);
    return res.status(200).json(userInfo);
  } catch (err) {
    logger.info("error with getting profile", err);
    res.status(502).json({ err: "failed to fetch profile" });
  }
};

const userDetailsById = async (req, res, next) => {
  try {
    logger.info("in update email section");
    const userResult = await User.findById(req.params.user_id);
    logger.info(userResult, "usre res to update   ");
    const mentorId = userResult.mentor._id;
    logger.info(mentorId);
    const mentor = await User.findById(mentorId);
    // const type = req.userType;
    logger.info("mentor dtls ", mentor);
    const userInfo = {
      type: userResult.type,
      firstName: userResult.firstName,
      lastName: userResult.lastName,
      phoneNumber: userResult.phoneNumber,
      email: userResult.email,
      mentor: {
        _id: mentor["_id"],
        firstName: mentor["firstName"],
        lastName: mentor["lastName"],
      },
    };
    if (userResult.type === "Moderator") {
      userInfo["batch"] = userResult.batch;
      userInfo["authority"] = userResult.authority;
      userInfo["department"] = userResult.department;
    } else if (userResult.type === "Student") {
      userInfo["enrollno"] = userResult.enrollno;
      userInfo["department"] = userResult.department;
      userInfo["course"] = userResult.course;
      userInfo["division"] = userResult.division;
      userInfo["year"] = userResult.year;
    }
    logger.info("user profile", userInfo);
    return res.status(200).json(userInfo);
  } catch (err) {
    logger.info("error with getting profile", err);
    res.status(502).json({ err: "failed to fetch profile" });
  }
};

const resetLeave = async (req, res, next) => {
  try {
    const users = await User.find();

    for (const user of users) {
      user.leave = 7;
      await user.save();
    }

    console.log("Leave updated for all users successfully.");
  } catch (error) {
    console.error("Error updating leave for users:", error);
  }
};

module.exports = {
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  displayUser: displayUser,
  userDetails: userDetails,
  registerFormData: registerFormData,
  displayUserType: displayUserType,
  userDetailsById: userDetailsById,
};
