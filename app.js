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

app.post('/campgrounds',catchasync(async(req,res,next)=>{
    // if(!req.body.campground) throw new expresserror("invalid campground data",400);
    //creating joi schema
    const campgroundSchema = joi.object({
        campground: joi.object({
            title: joi.string().required(),
            price: joi.number().required().min(0),
            image: joi.string().required(),
            description:joi.string().required(),
            location:joi.string().required(),

        }).required()})

        
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expresserror(msg,400);
    }
    console.log(result);



    const camp = new  Campground(req.body.campground);
    const campground = await camp.save();
    res.redirect(`/campgrounds/${campground._id}`);

}));
app.get('/campgrounds/:id',catchasync(async (req,res,next)=>{

    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});

}
));

app.get("/campgrounds/:id/edit",catchasync(async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}));



app.put("/campgrounds/:id",catchasync(async(req,res,next)=>{
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