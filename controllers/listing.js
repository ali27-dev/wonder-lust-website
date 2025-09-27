const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;

  // let { title, description, image, price, location, country } = req.body;
  let newListings = new Listing(req.body.listing);
  newListings.owner = req.user._id;
  newListings.image = { url, filename };
  newListings.geometry = response.body.features[0].geometry;
  let saved = await newListings.save();
  req.flash("success", "New Listing created!");
  res.redirect("/listings");
};

///////Edit: Edit & Update ROUTE///////
module.exports.renderEditForm = async (req, res) => {
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
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

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
