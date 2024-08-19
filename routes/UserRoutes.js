const express = require("express");

const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const { ADMIN, SUPER_ADMIN } = require("./../constant/types").USER;

const router = express.Router();

router.post("/signUp", authController.signUp);
router.post("/login", authController.login);

router.use(authController.protect);

router.post(
  "/createOfficer",
  authController.restrictTo(ADMIN, SUPER_ADMIN),
  userController.createOfficer
);

module.exports = router;
