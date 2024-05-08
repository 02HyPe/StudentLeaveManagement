const jwt = require(`jsonwebtoken`);

module.exports = (req, res, next) => {
  logger.info("-------body", req.body);
  const authHeader = req.headers["authorization"];
  logger.info("headers", authHeader);
  if (!authHeader) {
    logger.info(`Authorization header not found`);
    return res.status(400).send(`login needed`);
  }
  const token = authHeader.split(` `)[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, `somesupersecret`);
    logger.info(decodedToken);
  } catch (err) {
    logger.info(err, `error while decoding token`);
    return res.status(400).send("error with verifying token");
  }
  req.user_id = decodedToken.user_id;
  req.userName = decodedToken.name;
  req.authority = decodedToken.authority;
  req.userType = decodedToken.type;
  logger.info(req.userType, "usertype");
  next();
};
