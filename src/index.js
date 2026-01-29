import connectDB from "./db/index.js";
import dotenv from 'dotenv';
import { app } from "./app.js";
// import express from 'express';
// require('dotenv').config({path:'./env'})
// const app= express();

dotenv.config({
    path:'./env'
})


connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Err",error);
        throw error;
    })
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server is listening at port : ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("Mongo DB connection failed !!",error);
    
})