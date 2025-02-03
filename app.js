const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const catchasync = require('./utils/catchasync');
const expresserror = require('./utils/expresserror');
var methodOverride = require('method-override')
const Campground = require('./models/campground');
const ejsmate = require('ejs-mate');
const joi = require('joi');
const {campgroundSchema,reviewSchema} = require('./schemas');
const Review = require('./models/review');
const review = require('./models/review');



app.engine('ejs',ejsmate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

mongoose.connect('mongodb://localhost:27017/yelp-camp').then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));//method override

// app.use(express.json());

const validateCampground = (req,res,next)=>{
    

        
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expresserror(msg,400);
    }else{
        next()//very imp to go to next route
    }
    
    
}

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expresserror(msg,400);
    }else{
        next()//very imp to go to next route
    }
}

app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/campgrounds',catchasync(async (req,res,next)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{ campgrounds });
}))

app.get("/campgrounds/new",(req,res)=>{
    res.render("campgrounds/new");
})

app.post('/campgrounds',validateCampground,catchasync(async(req,res,next)=>{
    // if(!req.body.campground) throw new expresserror("invalid campground data",400);
    //creating joi schema
   



    const camp = new  Campground(req.body.campground);
    const campground = await camp.save();
    res.redirect(`/campgrounds/${campground._id}`);

}));
app.get('/campgrounds/:id',catchasync(async (req,res,next)=>{

    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show',{campground});

}
));

app.get("/campgrounds/:id/edit",catchasync(async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}));



app.put("/campgrounds/:id",validateCampground,catchasync(async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground.id}`)

}))


app.get('/makecampground',async (req,res,next)=>{
    const camp = new Campground({
        title:"my backyard",description:"cheap camping"
    })

    await camp.save();
    res.send(camp);
})


app.delete('/campgrounds/:id',catchasync(async(req,res,next)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

//adding review routers
app.post("/campgrounds/:id/reviews",validateReview,catchasync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})
);

app.delete('/campgrounds/:id/reviews/:reviewId',catchasync(async(req,res)=>{
    const{id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}))



app.all('*',(req,res,next)=>{
    next(new expresserror('page not found',404));
})

//adding a error handler
app.use((err,req,res,next)=>{
    const {statusCode=500} = err;
    if(!err.message) err.message = "oh no!,Something went wrong";
    res.status(statusCode).render('error',{err});
    
})


app.listen(3000,()=>{
    console.log("Listening to port 3000!");
})