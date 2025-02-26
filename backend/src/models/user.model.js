import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
    
    },
    email:{
        type : String,
        required : true,
        unique : true
    },
    picture:{
        type : String,
        required : true,
    }, 
     googleTokens: {
        accessToken: { type: String, required: true },
        refreshToken: { type: String,required:true },
        expiryDate: { type: Date, required: true },
      },
},{
    timestamps:true
})

export const User = mongoose.model("User",userSchema)
