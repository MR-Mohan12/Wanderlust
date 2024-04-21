const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exists!");
    res.redirect("/listings");
  }
  
  res.render("show.ejs", { listing });
};



module.exports.createListing = async (req, res, next) => {
  // Extract image information from multer
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url ,"", filename);
  // Create a new listing object
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  // Set the image information
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");

};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id);
  res.render("edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  try {
    let { id } = req.params;

    // Find the existing listing by ID
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing);

    // Check if a file was uploaded and update image information if needed
    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
    }

    // Save the updated listing
    await listing.save();

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update listing");
    res.redirect(`/listings/${id}/edit`);
  }
};



module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
