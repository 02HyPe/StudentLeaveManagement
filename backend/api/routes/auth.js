const express = require(`express`);
const AuthController = require("../controllers/auth");
const router = express.Router();
const isAuth = require(`../middlewares/is-auth`);

router.post(`/login`, AuthController.login);
router.post(`/logout`, isAuth, AuthController.logout);

module.exports = router;
