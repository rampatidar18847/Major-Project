if(process.env.NODE_ENV !== 'production')
{
  require('dotenv').config();
}
const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const Wrapasync = require("../utils/Wrapasync.js");
const { isLoggedIn, isowner, validatelisting } = require("../middleware.js");
const ListingController = require("../controllers/ListingController.js");
const multer = require("multer");
const {storage} = require("../CloudConfig.js");
const upload = multer({storage});

//new lisiting
router.get("/new", isLoggedIn, Wrapasync(ListingController.index));

//index listings
router.get("/", Wrapasync(ListingController.createlisting));

//show listing
router.get("/:id", Wrapasync(ListingController.showlisting));

//save lisiting
router.post("/",upload.single("listing[image]"), Wrapasync(ListingController.savelisting));

//edit lisiting
router.get(
  "/:id/edit",
  isLoggedIn,
  isowner,
  Wrapasync(ListingController.editlisting)
);

//update lisiting
router.put(
  "/:id",
  isLoggedIn,
  isowner,
  upload.single("listing[image]"),
  Wrapasync(ListingController.updatelisting)
);

router.get(
  "/search/:category", Wrapasync(ListingController.search)
);

router.get("/navsearchbar", Wrapasync(ListingController.navsearchbar)
);

//delete lisiting
router.delete(
  "/delete/:id",
  isLoggedIn,
  isowner,
  Wrapasync(ListingController.deletelisting)
);

module.exports = router;
