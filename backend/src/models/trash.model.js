import mongoose, { Schema } from "mongoose";



const trashSchema = new mongoose.Schema({
    messageID:{
        type : String,
        required : true,
        unique: true,
    },
    deletedData:{
        type : String,
        required : true
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    
},{
    timestamps:true
})

export const Trash = mongoose.model("Trash",trashSchema)
 