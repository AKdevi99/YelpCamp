const Campground = require('../models/campground');


module.exports.index = async (req,res,next)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{ campgrounds });
};

module.exports.renderNewForm = (req,res)=>{
    
    res.render("campgrounds/new");
};


module.exports.createNewCampground = async(req,res,next)=>{
    if (!req.user) {   // 🚨 Check if user is logged in before proceeding
        req.flash('error', 'You must be logged in to create a campground');
        return res.redirect('/login');
    }
    
    const camp = new  Campground(req.body.campground);
    camp.author = req.user._id;
    const campground = await camp.save();
    req.flash('success','Successfully made a campground!');
    res.redirect(`/campgrounds/${campground._id}`);

};


module.exports.showEachCampground = async (req, res, next) => {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        req.flash('error', 'Campground does not exist!');
        return res.redirect('/campgrounds');
    }

    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');

    if (!campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
} ;

module.exports.editCampground = async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
};

module.exports.updateCampground = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground.id}`)

};

module.exports.deleteCampground = async(req,res,next)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
};