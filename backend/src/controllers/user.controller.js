import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const getUserDetail = asyncHandler(async(req,res)=>{
    const user = req.user
    return res
    .status(200)
    .json(new ApiResponse(200,user,"user data fetch successfully"))

})

export {
    getUserDetail
}