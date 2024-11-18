const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const Campground = require('./models/campground');



app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

mongoose.connect('mongodb://localhost:27017/yelp-camp').then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });


// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/campgrounds',async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{ campgrounds });
})

app.get("/campgrounds/new",(req,res)=>{
    res.render("campgrounds/new");
})
app.get('/campgrounds/:id',async (req,res)=>{

    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});

}
);



app.get('/makecampground',async (req,res)=>{
    const camp = new Campground({
        title:"my backyard",description:"cheap camping"
    })

    await camp.save();
    res.send(camp);
})

app.listen(3000,()=>{
    console.log("Listening to port 3000!");
})