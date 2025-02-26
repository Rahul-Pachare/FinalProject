import mongoose, { Schema } from "mongoose";



const mailSchema = new mongoose.Schema({
    messageID:{
        type : String,
        required : true,
        unique: true,
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    spam_confidence:{
        type : Number,
        required : true,
        
    },
    status:{
        type : String,
        required : true,
        default:"ham",
        enum :["spam","maybe_spam","ham"]
    }
},{
    timestamps:true
})

export const Mail = mongoose.model("Mail",mailSchema)
