const express = require("express");

const router = express.Router();
const usersController = require("../controllers/users");

router.post("/signup", usersController.signUp);

router.post("/login", usersController.login);

router.post("/forget-password", usersController.forgetPassword);
router.get("/reset/:token", usersController.checkResetToken);

router.post("/reset/updateResetPassword", usersController.updateResetPassword);

router.post("/getUserName", usersController.getUserName);

router.post("/check-user", usersController.checkUser);

router.get("/:username", usersController.getProfile);

router.post("/create-new-access-token", usersController.createNewAccessToken);

module.exports = router;
