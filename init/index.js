const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// to connect the database (mongose) 
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then((res) => {
    console.log(res ,"Connetction db");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}
const initDB = async () =>{
   await Listing.deleteMany({});
       initData.data = initData.data.map((obj)=> ({...obj, owner: "661e0fb80c70827301917948"}))
   await Listing.insertMany(initData.data);
   console.log("data was intialized");
};
initDB();