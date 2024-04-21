const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res)=>{
    // console.log(req.params.id);
    let listing =   await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);
     newReview.author = req.user._id;  //add bye me
        listing.reviews.push(newReview);
          await newReview.save();
         await listing.save();
  
         req.flash("success","New Review Created");
    // Redirecting the user after saving the review
    res.redirect(`/listings/${listing.id}`)
       
  }


  module.exports.deleteReview = async (req, res) => {
    try {
        const { id, reviewId } = req.params;

        // Find the review by its ID
        const review = await Review.findById(reviewId);

        // Find the listing by its ID
        const listing = await Listing.findById(id);

        // Check if the user is authorized to delete the review
        if (!review) {
            req.flash("error", "Review not found");
            return res.redirect(`/listings/${id}`);
        }

        // Check if the current user is authorized to delete the review
        if (!req.user || (!review.author.equals(req.user._id) && !listing.owner.equals(req.user._id))) {
            req.flash("error", "You are not authorized to delete this review");
            return res.redirect(`/listings/${id}`);
        }

        // Remove the review ID from the listing's reviews array
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

        // Delete the review
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review deleted successfully");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error deleting review:", error);
        req.flash("error", "Failed to delete review");
        res.redirect(`/listings/${id}`);
    }
}



//   module.exports.deleteReview = async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     req.flash("success","Review Deleted !!");
//     res.redirect(`/listings/${id}`);
//   }