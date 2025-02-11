const express = require('express');
const router = express.Router({mergeParams:true})
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchasync = require('../utils/catchasync');
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware');
const review = require('../controllers/review');
 



router.post("/",isLoggedIn,validateReview,catchasync(review.addReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchasync(review.deleteReview));

module.exports = router;