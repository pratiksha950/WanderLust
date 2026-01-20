const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing =require("./models/Listing.js");
const path=require("path");
const methodOverride=require("method-override")
//database  
const MONGO_URL="mongodb://127.0.0.1:27017/WanderLust";

main().then(()=>{
    console.log("connected to mongoDB");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))


//index routev completed
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({})
    res.render("listings/index",{allListings});
    });

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new")
})

//show route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show",{listing})
})

//create Route
app.post("/listings",async (req,res)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
})

//Edit Route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit",{listing})
})

//update Route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
})

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new vila",
//         description:"By the beach",
//         price:1200,
//         location:"alphanche,Goa",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("Sample was save");
//     res.send("Sucessfull testing")
// })


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})

app.get("/",(req,res)=>{
    res.send("Hii i am Root")
})
