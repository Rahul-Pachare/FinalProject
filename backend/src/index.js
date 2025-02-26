import dotenv from "dotenv"
import connectDB from './db/index.js'
import  app  from "./app.js"
dotenv.config({
    path:"./.env"
})


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 5000,()=>{
        console.log("server run at :",process.env.PORT)
       
    })
})
.catch((err)=>{
    console.log('mongoDB not connected :',err);
})




















//here is an approach of the connecting db to our code
/*
import mongoose from "mongoose";
import express from "express";

const DB_NAME = 'videotube'

const app = express()
(async ()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error) =>{
            console.log(error)
            throw error
        })

        app.listen(`${process.env.PORT}`,()=>{
            console.log("connect at :",process.env.PORT)
        })
    } catch (error) {
        console.log("Error:",error)
        throw error
    }
})()
*/