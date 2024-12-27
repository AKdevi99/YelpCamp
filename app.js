const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
var methodOverride = require('method-override')
const Campground = require('./models/campground');
const ejsmate = require('ejs-mate');



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

app.get('/campgrounds',async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{ campgrounds });
})

app.get("/campgrounds/new",(req,res)=>{
    res.render("campgrounds/new");
})

app.post('/campgrounds',async(req,res)=>{
    const camp = new  Campground(req.body.campground);
    await camp.save();
    res.redirect("/campgrounds");

})
app.get('/campgrounds/:id',async (req,res)=>{

    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});

}
);

app.get("/campgrounds/:id/edit",async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
});



app.put("/campgrounds/:id",async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground.id}`)

})


app.get('/makecampground',async (req,res)=>{
    const camp = new Campground({
        title:"my backyard",description:"cheap camping"
    })

    await camp.save();
    res.send(camp);
})


app.delete('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});


app.listen(3000,()=>{
    console.log("Listening to port 3000!");
})