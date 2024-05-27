const express = require('express');
const router = express.Router({mergeParams: true});
const Wrapasync = require("../utils/Wrapasync.js");
const {isLoggedIn, validatereview, isReviewAuthor} = require("../middleware.js");
const ReviewController = require('../controllers/ReviewController.js');
const review = require('../models/review.js');


//show review
router.post("/",isLoggedIn,validatereview, Wrapasync(ReviewController.ShowReview));

//delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,Wrapasync(ReviewController.deleteReview)); 

module.exports = router;