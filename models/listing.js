const { default: mongoose } = require('mongoose');
const mongodb = require('mongoose');
const { listingschema } = require('../schema');
const listSchema = mongoose.Schema;
const Schema = mongoose.Schema;
const Review = require('./review.js');


let lSchema = new listSchema(
    {
        title : {
            type : String,
            required : true,
        },
        description:
        {
            type : String,
        },
        image : 
        {
            url : String,
            filename : String,
        },
        category:{
            type: String,
        },
        price:{
            type : Number,
            required : true,
        },
        location : String,
        country : String,
        reviews:
        [
            {
                type: Schema.Types.ObjectId,
                ref : "Review",
            },
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        
    });

    lSchema.post("findOneAndDelete", async(listing) => 
    {
        if(listing)
        {
            await Review.deleteMany({_id: {$in: listing.reviews}});
        }
    });

let listing = mongoose.model('listing', lSchema);

module.exports = listing;