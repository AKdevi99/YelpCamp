const User = require('../models/user');


module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
};


module.exports.createUser = async(req,res)=>{
    try{
        const {username,email,password} =  req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,err =>{
            if(err){
                return next(err);
            }
            req.flash('succuess',"welcome to yelp camp");
            res.redirect('/campgrounds');
        });
    }catch(e)
    {
        req.flash('error',e.message);
        res.redirect('/register');
    }

};


module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
};

module.exports.loginUser = ( req,res)=>{
    req.flash('success','welcome back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);

};

module.exports.logoutUser = (req,res,next)=>{
    req.logout(function(err){
        if(err)
        {
            return next(err);
        }
        req.flash('success', 'Goodbye! 👋');
        res.redirect('/campgrounds');
    })
    
};