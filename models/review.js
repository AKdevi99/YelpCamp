const { number } = require("joi");
const { Mongoose, default: mongoose } = require("mongoose");

const schema = mongoose.Schema;


const reviewSchema = new schema({
    body:String,
    rating:Number
});

// reviewSchema.pre("save", function (next) {
//     this.rating = Number(this.rating);  // Ensure rating is stored as a number
//     next();
// });

module.exports = mongoose.model("Review",reviewSchema);