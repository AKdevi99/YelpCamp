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




const reviewRouter = require('./routes/reviews');
const campgroundsRouter = require('./routes/campgrounds');



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
app.use(express.static('public'));


app.get('/',(req,res)=>{
    res.render('home');
})


app.use('/campgrounds',campgroundsRouter);

app.use('/campgrounds/:id/reviews',reviewRouter);



app.get('/makecampground',async (req,res,next)=>{
    const camp = new Campground({
        title:"my backyard",description:"cheap camping"
    })

    await camp.save();
    res.send(camp);
})





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