const express = require('express');
const router = express.Router()
const catchasync = require('../utils/catchasync');
const Campground = require('../models/campground');
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware');
const campgrounds = require('../controllers/campground');

const {storage} = require('../cloudinary');
const multer = require('multer');
const upload = multer({storage});


router.route('/')
    .get(catchasync(campgrounds.index))
    // .post(isLoggedIn,validateCampground,catchasync(campgrounds.createNewCampground));
    .post(upload.single('image'),(req,res)=>{
        console.log(req.body,req.file);
    })


router.get('/new',isLoggedIn,campgrounds.renderNewForm);

router.route('/:id')
    .get( catchasync(campgrounds.showEachCampground))
    .put(isLoggedIn,isAuthor,validateCampground,catchasync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,catchasync(campgrounds.deleteCampground));


router.get("/:id/edit",isLoggedIn,isAuthor,catchasync(campgrounds.editCampground));


module.exports = router;