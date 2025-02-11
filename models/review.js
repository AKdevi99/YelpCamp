const { number } = require("joi");
const { Mongoose, default: mongoose, Schema } = require("mongoose");

const schema = mongoose.Schema;


const reviewSchema = new schema({

    body:String,
    rating:Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

// reviewSchema.pre("save", function (next) {
//     this.rating = Number(this.rating);  // Ensure rating is stored as a number
//     next();
// });

module.exports = mongoose.model("Review",reviewSchema);