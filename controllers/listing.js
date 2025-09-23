const Listing = require("../models/listing.js");

//////////// INDEX ROUTE////////////////
module.exports.index = async (req, res) => {
  let listing = await Listing.find({});
  res.render("listings/index.ejs", { listing });
};

///////Create: NEW & Create ROUTE///////
module.exports.createNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//////////// SHOW ROUTE////////////////
module.exports.showRoute = async (req, res) => {
  let { id } = req.params;
  let listId = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  console.log(listId);
  if (!listId) {
    req.flash("error", "Listing does not exits!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listId });
};

///////CREATE ROUTE POST///////////
module.exports.createNewListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  // let { title, description, image, price, location, country } = req.body;
  let newListings = new Listing(req.body.listing);
  newListings.owner = req.user._id;
  newListings.image = { url, filename };
  await newListings.save();
  req.flash("success", "New Listing created!");
  res.redirect("/listings");
};

///////Edit: Edit & Update ROUTE///////
module.exports.createEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exits!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

///////////// Update ROUTE////////////
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

////////////DELETE ROUTE////////////////
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
