const { default: mongoose } = require('mongoose');
const mongodb = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        rating : 
        {
            type: Number,
            min: 1,
            max: 5
        },
        comment: 
        {
            type: String,
        },
        CreatedAt :
        {
            type: Date,
            default: Date.now(),
        },
        author:
        {
            type: Schema.Types.ObjectId,
            ref : "User",
        }
    }
);

module.exports = mongoose.model("Review",reviewSchema);