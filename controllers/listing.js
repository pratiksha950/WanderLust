const Listing=require("../models/listing.js")

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({})
    res.render("listings/index",{allListings});
    }

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new")
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","listing you requested does not exists")
       return res.redirect("/listings")
    }
    console.log(listing);
    res.render("listings/show",{listing})
}

module.exports.createListing = async (req, res) => {

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    } else {
        newListing.image = {
            url: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        };
    }

    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
        if(!listing){
        req.flash("error","listing you requested does not exists")
       return res.redirect("/listings")
    }
    res.render("listings/edit",{listing})
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    if (req.file) { 
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }

    req.flash("success", "Listing Updated !!!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted")
    res.redirect("/listings")
}