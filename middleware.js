const Listing = require("./models/listing");
const { listingSchema } = require("./Schema.js");
const ExpressError = require("./utils/ExpressError");
const { reviewSchema} = require("./Schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.user);
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl ){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//  Validate for listing

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};



  //validate for review 
module.exports.validateReview =   (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };
  


module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    // Accessing current user from req.user instead of currUser
    if (!req.user || !listing.owner._id.equals(req.user._id)) {
      req.flash("error", "You don't have permission to edit and delete!!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}
