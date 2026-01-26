const mongoose =require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/WanderLust";

main().then(()=>{
    console.log("connected to mongoDB");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({})
   initData.data = initData.data.map((obj) => {
    return { ...obj, owner: "6976ff6bca4b8e929744173c" };
});

    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();