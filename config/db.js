const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./.env'});

const connectDB = async ()=>{
    // const conn= await mongoose.connect(process.env.MONGO_URI, {
    const conn= await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        // useUnifiedTopologu: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

module.exports=connectDB;