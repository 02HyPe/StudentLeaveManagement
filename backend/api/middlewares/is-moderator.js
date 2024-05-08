const jwt = require(`jsonwebtoken`);

module.exports = (req, res, next) => {
  if (req.userType !== "Moderator") {
    logger.info("Moderator middle unAuthorized");
    return res.status(401).json({ msg: `unAuthorized` });
  }
  next();
};
