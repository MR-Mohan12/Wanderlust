const express= require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const { reviewSchema} = require("../Schema.js");
const Review = require("../models/review");
const { isLoggedIn } = require('../middleware.js');
const {validateReview} = require('../middleware');

const { createReview, deleteReview } = require('../controllers/reviews.js');



// // Validate for review
// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//       const errMsg = error.details.map((el) => el.message).join(",");
//       throw new ExpressError(400, errMsg);
//     } else {
//       next();
//     }
//   };
  


//reviews
//post route
router.post("/",isLoggedIn,validateReview, wrapAsync(createReview))
 
//delete review route
router.delete("/:reviewId", wrapAsync(deleteReview))
  
  module.exports = router;