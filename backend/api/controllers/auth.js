const userModel = require("../config/mongoose.model").userModel;
const bcrypt = require(`bcryptjs`);
const jwt = require("jsonwebtoken");
const logger = global.logger;

const login = async (req, res, next) => {
  try {
    const body = req.body;
    const { userId, email, password } = body;
    const userResult = await userModel.findOne({
      $or: [{ email: email }, { userId: userId }],
    });
    logger.info(userResult, "userresult--");
    if (userResult) {
      const passwordMatch = await bcrypt.compare(password, userResult.password);
      if (passwordMatch) {
        const token = jwt.sign(
          {
            type: userResult.type,
            name: userResult.firstName + " " + userResult.lastName,
            email: userResult.email,
            user_id: userResult._id,
            authority: userResult.authority,
          },
          process.env.JWT_SECRET || "somesupersecret"
        );

        return res.status(200).json({
          token: token,
          name: userResult.firstName,
        });
      } else {
        return res.status(400).json({ error: "Invalid Credential" });
      }
    } else {
      return res.status(404).json({ msg: "user not found" });
    }
  } catch (err) {
    console.error("Error with student login", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "logged out " });
  } catch (err) {
    return res.status(400).json({ err: err });
  }
};

module.exports = {
  login: login,
  logout: logout,
};
