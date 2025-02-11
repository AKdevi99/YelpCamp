const express = require('express');
const router = express.Router()
const catchasync = require('../utils/catchasync');
const Campground = require('../models/campground');
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware');






router.get('/',catchasync(async (req,res,next)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{ campgrounds });
}))

router.get('/new',isLoggedIn,(req,res)=>{
    
    res.render("campgrounds/new");
});

router.post('/',isLoggedIn,validateCampground,catchasync(async(req,res,next)=>{
    
    const camp = new  Campground(req.body.campground);
    camp.author = req.user._id;
    const campground = await camp.save();
    req.flash('success','Successfully made a campground!');
    res.redirect(`/campgrounds/${campground._id}`);

}));


router.get('/:id', catchasync(async (req, res, next) => {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        req.flash('error', 'Campground does not exist!');
        return res.redirect('/campgrounds');
    }

    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if (!campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));


router.get("/:id/edit",isLoggedIn,isAuthor,catchasync(async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}));

router.put("/:id",isLoggedIn,isAuthor,validateCampground,catchasync(async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground.id}`)

}));

router.delete('/:id',isLoggedIn,isAuthor,catchasync(async(req,res,next)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}));



module.exports = router;