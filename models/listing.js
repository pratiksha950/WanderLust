const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

image: {
  url: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&w=800&q=60",
  },
  filename: {
    type: String,
    default: "listingimage",
  },
},

price: {
  type: Number,
  default: 0
},
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },

//   description: {
//     type: String,
//     required: true,
//   },

//   image: {
//     filename: {
//       type: String,
//       default: "listingimage",
//     },
    
//     url: {
//       type: String,
//     },
//   },

//   price: {
//     type: Number,
//     required: true,
//     min: 0,
//   },

//   location: {
//     type: String,
//     required: true,
//   },

//   country: {
//     type: String,
//     required: true,
//   },
// });

// // collection
// const Listing = mongoose.model("Listing", listingSchema);

// module.exports = Listing;
