const express = require('express');
const router = express.Router(mer)
const {reviewSchema} = require('../schemas');
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchasync = require('../utils/catchasync');
const expresserror = require('../utils/expresserror');


const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expresserror(msg,400);
    }else{
        next()//very imp to go to next route
    }
}

router.post("/",validateReview,catchasync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})
);

router.delete('/:reviewId',catchasync(async(req,res)=>{
    const{id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;