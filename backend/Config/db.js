const mongoose = require("mongoose");

const dburl ="mongodb+srv://dilkiprabodya:dilki123@cluster0.k43vw.mongodb.net/";
mongoose.set("strictQuery", true,"useUrlParser", true);

const connection =async () =>{
    try{
    await mongoose.connect(dburl);
    console.log("MongoDB connected~");
}catch (e){
    console.error(e.message);
    process.exit();

}
};

module.exports = connection;
