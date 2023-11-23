const router = require("express").Router();
const controller = require("./signup.controller");
/* GET home page. */
router.route("/").get(controller.signupGet).post(controller.signupPost);

module.exports = router;
