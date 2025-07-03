const mongoose = require("mongoose");
const schema = mongoose.Schema;

let reviewSchema = schema({
    name:{
        type:String,
    },
    comment:{
        type:String,
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        default:1,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
})

const Review = mongoose.model('Review',reviewSchema);
module.exports = Review;