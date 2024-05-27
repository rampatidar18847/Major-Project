const Review = require("../models/review");
const listing = require("../models/listing.js");
const ErrorExpress = require("../utils/ErrorExpress.js");
const {reviewschema } = require("../schema.js");


module.exports.ShowReview = async(req, res) => 
{
  let listid = await listing.findById(req.params.id);
  let newreview = new Review(req.body.review);
  newreview.author = req.user._id;
  listid.reviews.push(newreview);
  await newreview.save();
  await listid.save();
  res.redirect(`/listings/${listid._id}`);
};

module.exports.deleteReview = async (req, res) => 
{
  let {id, reviewId} = req.params;
  await listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review deleted successfully");
  res.redirect(`/listings/${id}`);
};

