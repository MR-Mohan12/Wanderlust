const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

//Index Route
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist! ");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
}));


router.post(
  "/",
  isLoggedIn,
  (req, res, next) => upload.single('listing[image]')(req, res, next), // <-- Modify this line
  validateListing,
  listingController.createListing
);


//Create Route
// router.post(
//   "/",
//   isLoggedIn,
//   upload.single('listing[image]'), // Include multer middleware here
//   validateListing,
//   listingController.createListing
// );

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist! ");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

//Update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     req.flash("success", "Listing Updated!");
//     res.redirect(`/listings/${id}`);
//   })
// );
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log("Updated listing data:", req.body.listing); // Log the updated listing data
    // Update the listing using findByIdAndUpdate
    await Listing.findByIdAndUpdate(id, req.body.listing, { new: true }); // Add { new: true } to return the updated document
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);




//Delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect(`/listings`);
  })
);

module.exports = router;
