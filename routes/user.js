const express = require('express');
const router = express.Router();
const User = require("../model/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveUrl } = require('../middleWare');
const { signUpPage, loginPage, saveSignIn, saveLogIn, logout } = require('../controller/user');


router.route('/signup')
    .get(signUpPage)//get signin page
    .post(wrapAsync(saveSignIn));//save signin

router.route("/login")
    .get(loginPage)//get login page
    .post(saveUrl,
        passport.authenticate("local",
            {
                failureRedirect: '/login',
                failureFlash: true
            }),
        saveLogIn)//save login i.e check user is signed up or not

router.get('/logout', logout);

module.exports = router;

