
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require("./cities");
const {places,descriptors} = require('./seedHelplers');


mongoose.connect('mongodb://localhost:27017/yelp-camp').then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });


const sample = array=> array[Math.floor(Math.random() * array.length)]; 

  const seeddb = async() =>{
    await Campground.deleteMany({});
    for(let i =0;i<50;i++)
    {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author:'67aaf12516d235136768ac72',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:`https://picsum.photos/600?random=${Math.random()}`,
            description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati adipisci nihil voluptatibus magni quisquam provident, placeat quo reprehenderit ad atque eaque, sapiente ex. Recusandae cumque dolorum quis saepe assumenda veritatis?',
            price
        })

        await camp.save();
    }

    console.log("done");
  }

  seeddb().then(()=>{
    mongoose.connection.close();
  });