const jwt = require(`jsonwebtoken`);

module.exports = (req, res, next) => {
  if (req.userType !== "Admin") {
    logger.info("admin middle unAuthorized");
    return res.status(401).json({ msg: `unAuthorized` });
  }
  next();
};
