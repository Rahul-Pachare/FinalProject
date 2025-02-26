import mongoose from "mongoose"
import { DB_NAME } from "../constant.js"

const connectDB = async ()=>{
    try {
        const connectInst =  await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log("mongo connect at :",connectInst.connection.host)
    } catch (error) {
        console.log("MongoDB connection failed :", error)
        process.exit(1)
    }
}
export default connectDB