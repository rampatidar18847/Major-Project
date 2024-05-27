const listing = require("./models/listing");
const review = require("./models/review");
const { listingschema, reviewschema } = require("./schema");
const ErrorExpress = require("./utils/ErrorExpress.js");

module.exports.isLoggedIn = (req, res, next) =>
{
    if(!req.isAuthenticated())
    {
      req.session.redirectUrl = req.originalUrl;
      req.flash('error', "You neet to Login first.");
      res.redirect('/login');
    }
    next();
}

module.exports.savedurl = (req, res, next) =>
{
  if(req.session.redirectUrl)
  {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isowner = async(req, res, next) =>
{
  let { id } = req.params;
  let listingdata = await listing.findById(id);
  if(!listingdata.owner.equals(res.locals.curr_user._id))
  {
    req.flash('error',"You do not have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validatelisting = (req, res, next) => {
  let {error} = listingschema.validate(req.body);
  if(error)
  {
    throw new ErrorExpress(500, error);
  }else{
    next();
  }
}

module.exports.validatereview = (req, res, next) => {
  let {error} = reviewschema.validate(req.body);
  if(error)
  {
      throw new ErrorExpress(500, error);
  }else{
      next();
  }
}

module.exports.isReviewAuthor = async(req, res, next) =>
{
  let { id , reviewId} = req.params;
  let reviewdata = await review.findById(reviewId);
  if(!reviewdata.author.equals(res.locals.curr_user._id))
  {
    req.flash('error',"You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}