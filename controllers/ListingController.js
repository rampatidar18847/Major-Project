const { model } = require('mongoose');
const listing = require('../models/listing');

module.exports.index = async (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.createlisting = async (req, res) => {
    const alllistings = await listing.find({});
    res.render("./listings/index.ejs", { alllistings });
};

module.exports.showlisting = async (req, res, next) => {
    let { id } = req.params;
    const onelisting = await listing
      .findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!onelisting) {
      next(new ErrorExpress(404, "Listing not found"));
    }
    res.render("./listings/show.ejs", { onelisting });
};

module.exports.savelisting = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename};
    await newlisting.save();
    console.log(newlisting);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.editlisting = async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id);
    let originalimg = data.image.url;
    originalimg = originalimg.replace("/upload", "/upload/h_150,w_300");
    res.render("./listings/edit.ejs", { data,originalimg });
};

module.exports.updatelisting = async (req, res) => {
    let { id } = req.params;
    let data = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined")
    {
      let url = req.file.path;
      let filename = req.file.filename;
      data.image = { url, filename};
      await data.save();
    }
    console.log(data);
    if (!data) {
      req.flash("error", "Listing does not exist");
    } else {
      req.flash("success", "Listing Successfully Updated");
    }
    res.redirect(`/listings/${id}`);
};


module.exports.search = async(req, res) => {
  let {category} = req.params;
  let alllistings = await listing.find({category: category});
  res.render("./listings/index.ejs", { alllistings });
}

module.exports.navsearchbar = (req, res) => {
  res.send('response');
}

module.exports.deletelisting = async (req, res) => {
    let { id } = req.params;
    let deletelisting = await listing
      .findByIdAndDelete(id)
      .then((result) => {
        if (!id) {
          req.flash("error", "Listing does not exist");
        } else {
          req.flash("success", "Listing Successfully Deleted");
        }
        res.redirect("/listings");
      })
      .catch((err) => {
        console.log(err);
      });
};