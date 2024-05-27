const express = require('express');
const router = express.Router();
const Wrapasync = require("../utils/Wrapasync.js");
const passport = require('passport');
const { savedurl } = require("../middleware.js");
const UserContoller = require("../controllers/UserController.js");

router.get("/signup", UserContoller.newuser);

router.post("/signup", Wrapasync(UserContoller.saveuser));

router.get('/login', UserContoller.loginuser);

router.post('/login',savedurl,passport.authenticate('local',{ failureRedirect: '/login', failureFlash: true}), UserContoller.saveloginuser);

router.get('/logout', UserContoller.logoutuser);

module.exports = router;