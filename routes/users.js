const User = require('../models/user');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchasync');
const passport = require('passport');

router.get('/register',(req,res)=>{
    res.render('users/register');
});


router.post('/register',catchAsync(async(req,res)=>{
    try{
        const {username,email,password} =  req.body;
        const newUser = new User({email,username});
        const registeredUSer = await User.register(newUser,password);
        // console.log(registeredUSer);
        req.flash('succuess',"welcome to yelp camp");
        res.redirect('/campgrounds');
    }catch(e)
    {
        req.flash('error',e.message);
        res.redirect('/register');
    }

}));

router.get('/login',(req,res)=>{
    res.render('users/login');
});

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','welcome back');
    res.redirect('/campgrounds');

})


module.exports =router;