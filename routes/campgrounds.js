const express = require('express');
const router = express.Router()
const catchasync = require('../utils/catchasync');
const Campground = require('../models/campground');
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware');
const campgrounds = require('../controllers/campground');




router.get('/',catchasync(campgrounds.index));

router.get('/new',isLoggedIn,campgrounds.renderNewForm);

router.post('/',isLoggedIn,validateCampground,catchasync(campgrounds.createNewCampground));


router.get('/:id', catchasync(campgrounds.showEachCampground));


router.get("/:id/edit",isLoggedIn,isAuthor,catchasync(campgrounds.editCampground));

router.put("/:id",isLoggedIn,isAuthor,validateCampground,catchasync(campgrounds.updateCampground));

router.delete('/:id',isLoggedIn,isAuthor,catchasync(campgrounds.deleteCampground));



module.exports = router;