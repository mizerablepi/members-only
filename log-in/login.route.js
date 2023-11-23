const router = require("express").Router();
const controller = require("./login.controller");

router.route("/").get(controller.loginGet).post(controller.loginPost);

module.exports = router;
