const express = require('express');
const router = express.Router()
const catchasync = require('../utils/catchasync');
const joi = require('joi');
const Review = require('../models/review');
const {campgroundSchema,reviewSchema} = require('../schemas');
const Campground = require('../models/campground');
const expresserror = require('../utils/expresserror');



const validateCampground = (req,res,next)=>{
    

        
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expresserror(msg,400);
    }else{
        next()//very imp to go to next route
    }
    
    
}

router.get('/',catchasync(async (req,res,next)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{ campgrounds });
}))

router.get('/new',(req,res)=>{
    res.render("campgrounds/new");
});

router.post('/',validateCampground,catchasync(async(req,res,next)=>{
    // if(!req.body.campground) throw new expresserror("invalid campground data",400);
    //creating joi schema
    

    const camp = new  Campground(req.body.campground);
    const campground = await camp.save();
    req.flash('success','Successfully made a campground!');
    res.redirect(`/campgrounds/${campground._id}`);

}));


router.get('/:id', catchasync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));


router.get("/:id/edit",catchasync(async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}));

router.put("/:id",validateCampground,catchasync(async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground.id}`)

}));

router.delete('/:id',catchasync(async(req,res,next)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}));



module.exports = router;