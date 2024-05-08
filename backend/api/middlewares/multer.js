const multer = require("multer");

const logger = global.logger;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./backend/api/uploads");
  },
  filename: function (req, file, cb) {
    logger.info("Uploaded file:--------------------", file.originalname);
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

module.exports = { upload: upload };
