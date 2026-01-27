const express = require("express");
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync.js")
const Listing =require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing,createListing} =require("../views/middleware/middleware.js")
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const ListingController=require("../controllers/listing.js")

//create Route and index route
router
.route("/")
.get(wrapAsync(ListingController.index))
// .post(validateListing,isLoggedIn, wrapAsync(ListingController.createListing))
.post(
  isLoggedIn,
  upload.single("image"),
  wrapAsync(ListingController.createListing)
);


//new route 
router.get("/new",isLoggedIn,ListingController.renderNewForm)

//show route ,update Route and DELETE Route
router
.route("/:id")
.get(wrapAsync(ListingController.showListing))
.put(validateListing,isLoggedIn,isOwner,wrapAsync(ListingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.deleteListing))

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.renderEditForm))

module.exports=router;
