const User = require('../models/user');
const express = require('express');
const router = express.Router();
exports.router = router;
const catchAsync = require('../utils/catchasync');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');
const user = require('../controllers/user');


router.route('/register')
    .get(user.renderRegister)
    .post(catchAsync(user.createUser));

router.route('/login')
    .get(user.renderLogin)
    .post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.loginUser);


router.get('/logout',user.logoutUser);


module.exports =router;