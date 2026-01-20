// const mongoose =require("mongoose")
// const Schema=mongoose.Schema;

// const listingSchema=new Schema({
//     title:{
//         type:String,
//         required:true
//     },
//     description:String,
//     image:{
//         default:"https://unsplash.com/photos/a-painting-of-a-river-surrounded-by-pink-flowers-ZWg3KmVdtVw",
//         type:String,
//         set:(v)=>v ===""?"https://unsplash.com/photos/a-painting-of-a-river-surrounded-by-pink-flowers-ZWg3KmVdtVw":v,
//     },
//     price:Number,
//     location:String,
//     country:String
// })

// //collection
// const Listing=mongoose.model("Listing",listingSchema);

// module.exports=Listing;


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      required: true,
    },
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  location: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },
});

// collection
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
