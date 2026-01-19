const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing =require("./models/Listing.js")

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

app.get("/testListing",async(req,res)=>{
    let sampleListing=new Listing({
        title:"My new vila",
        description:"By the beach",
        price:1200,
        location:"alphanche,Goa",
        country:"India"
    })
    await sampleListing.save();
    console.log("Sample was save");
    res.send("Sucessfull testing")
})


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})

app.get("/",(req,res)=>{
    res.send("Hii i am Root")
})
