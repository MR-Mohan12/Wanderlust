const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { signup, renderSignupForm, login, loginForm, logoutForm } = require("../controllers/users");

router.get("/signup",renderSignupForm);


router.post("/signup",wrapAsync( signup));

router.get("/login",login);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  loginForm
);

router.get("/logout",logoutForm);
module.exports = router;


