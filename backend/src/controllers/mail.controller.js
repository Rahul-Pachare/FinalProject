// import ApiError from "../utils/ApiError.js";
// import ApiResponse from "../utils/ApiResponse.js";
// import asyncHandler from "../utils/asyncHandler.js";
// import axios from "axios"

// const getUnreadMails = asyncHandler(async(req,res) =>{
//     const user = req.user;
//     const accessToken = user.googleTokens.accessToken
    
//     try {
//         const response = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=is:unread', {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//         console.log('object',response)
//       res
//       .status(200)
//       .json(new ApiResponse(200,response.data,"mail data fetched"))
//     } catch (error) {
//        console.log(error)
//     }
// })

// export{
//     getUnreadMails
// }

import oauth2Client from "../config/googleAuth.js";
import { Mail } from "../models/mail.model.js";
import { Trash } from "../models/trash.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import axios from "axios";
import google from 'googleapis'


const getUnreadMails = asyncHandler(async (req, res) => {
  const user = req.user;
  const accessToken = user.googleTokens.accessToken;

  try {
    // Step 1: Fetch unread mail IDs
    const response = await axios.get(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=is:unread",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const messages = response.data.messages || [];

    // Step 2: Fetch each mail's details
    const mailDetails = await Promise.all(
      messages.map(async (message) => {
//stared        
        // const mailsexist = await Mail.findOne({ messageID: message.id });
  
        // if (!mailsexist) {
        //     const mail = await Mail.create({
        //         messageID: message.id,
        //         owner: user._id,
        //         spam_confidence: Math.floor(Math.random() * 100),
        //         status: "maybe_spam",
        //     });
    
        //     const isCreated = await Mail.findById(mail._id); // Use findById instead of find
        //     if (!isCreated) {
        //         throw new ApiError(500, "Mail not created");
        //     }
        // }
//ended
        const mailResponse = await axios.get(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        return mailResponse.data;
      })
    );

    res
      .status(200)
      .json(new ApiResponse(200, mailDetails, "Mail data fetched successfully"));
  } catch (error) {
    console.error("Error fetching mails:", error);
    res.status(500).json(new ApiError(500, "Failed to fetch mails"));
  }
});

const addMails = asyncHandler(async(req,res) =>{
  const user = req.user;
  const accessToken = user.googleTokens.accessToken;
  try {
    // Step 1: Fetch unread mail IDs
    const response = await axios.get(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=is:unread",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const messages = response.data.messages || [];
   
    const mails = [];
    for (const message of messages) {
      if (!message.id || typeof message.id !== "string") {
        console.warn("Skipping message with invalid ID:", message);
        continue; // Skip this iteration
    }
      console.log("object",message)
      const mailsexist = await Mail.findOne({ messageID: message.id });
  
      if (!mailsexist) {
        const spam = spam_detection();
        let status = "ham";
        if(spam >= 60 && spam <= 90 ){
          status = "maybe_spam"
        }else if (spam > 90){
          status = "spam"
        }
          const mail = await Mail.create({
              messageID: message.id,
              owner: user._id,
              spam_confidence:spam ,
              status,
          });
  
          const isCreated = await Mail.findById(mail._id); // Use findById instead of find
          if (!isCreated) {
              throw new ApiError(500, "Mail not created");
          }
          mails.push(mail);
      }
  }
  
   
    res
      .status(200)
      .json(new ApiResponse(200, mails, "Mail data fetched successfully"));
  } catch (error) {
    console.error("Error fetching mails:", error);
    res.status(500).json(new ApiError(500, "Failed to fetch mails"));
  }
})

const getUserMails = asyncHandler(async(req,res)=>{
    const userid = req.user._id
    
    const usermails = await Mail.find({owner :userid})
    if(!usermails){
      throw new ApiError(500,"there is issue in mail contro..")
    }

    res
    .status(200)
    .json( new ApiResponse(200,usermails,"user mail fetch successfully"))

})

const spam_detection = () =>{
  return  Math.floor(Math.random() * 100)
}

const getMaybeSpamMails = asyncHandler(async (req,res)=>{
    
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit
  const userid = req.user._id;
  const maildata =  await Mail.find({owner : userid, status:"maybe_spam"}).sort({ createdAt: -1 }).skip(skip).limit(limit);
 
  const totalmails = await Mail.find({owner : userid, status:"maybe_spam"}).countDocuments();

  // Calculate total number of pages
  const totalPages = Math.ceil(totalmails / limit);

if (!maildata) {
  throw new ApiError(400,"cant fetched may be spma mails ")
}
  return res
  .status(200)
  .json(new ApiResponse(200,{page,limit,totalPages,maildata},"mails(maybe spam) fetched successfully"))
})
const getSafeMails = asyncHandler(async(req,res) =>{
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit
  const userid = req.user._id;
  const maildata =  await Mail.find({owner : userid, status:"ham"}).sort({ createdAt: -1 }).skip(skip).limit(limit);
 
  const totalmails = await Mail.find({owner : userid, status:"ham"}).countDocuments();

  // Calculate total number of pages
  const totalPages = Math.ceil(totalmails / limit);

if (!maildata) {
  throw new ApiError(400,"cant fetched may be spma mails ")
}
  return res
  .status(200)
  .json(new ApiResponse(200,{page,limit,totalPages,maildata},"mails(maybe spam) fetched successfully"))
})

const getTrashMails = asyncHandler(async(req,res) =>{
  
  const userid = req.user._id;
  const maildata =  await Trash.find({owner : userid, }).sort({ createdAt: -1 });
 
  const page = 1
  // Calculate total number of pages

if (!maildata) {
  throw new ApiError(400,"cant fetched may be spma mails ")
}
  return res
  .status(200)
  .json(new ApiResponse(200,{page,maildata},"mails(maybe spam) fetched successfully"))
})

const getMailbyID = asyncHandler(async(req,res) =>{
  const user = req.user;
  const accessToken = user.googleTokens.accessToken;
  
  const message = req.query.id
  const mailResponse = await axios.get(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
    const data = mailResponse.data

    res.
    status(200)
    .json(new ApiResponse(200,data,"get mail with id successfully"))
  
})

const UpdateMailStatus = asyncHandler(async(req,res)=>{
  const status = req.query.status;
  const mailID = req.query.id
  const spam_confidence = req.query.spam_confidence
  const mail = await Mail.findByIdAndUpdate(mailID,{
    $set:{
      status : status,
      spam_confidence:spam_confidence
    }
   },{
    new:true
   })

  if(!mail){
    throw new ApiError(400,"there is an problem during the updating the status of the mail")
  }
  
  return res
  .status(200)
  .json(new ApiResponse(200,mail,"mail updated successfully"))
})
const deleteMailByID = asyncHandler(async (req, res) => {
  const user = req.user;
  const accessToken = user.googleTokens.accessToken;
  const { messageID } = req.body;
  
  if (!messageID || typeof messageID !== "string") {
    throw new ApiError(400, "Invalid or missing message ID");
  }
  console.log('started')
  const mailResponse = await axios.get(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageID}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
    const data = mailResponse.data
    if(!data){
      throw new ApiError(400,"Mails data is not fetched...")
    }
    console.log('step 1')
    const deleteMail = await Mail.deleteOne({messageID:messageID})
    console.log('step 2')
    const trash = await Trash.create({
      owner : user._id,
      messageID:messageID,
      deletedData:JSON.stringify(data)
    })
    console.log('step 3')
    if(!trash){
      throw new ApiError(400,"Mails is not saved in the trash...")
    }
  try {
    
      const deleteResponse = await axios.post(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageID}/trash`,
        {}, // Empty body for POST
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json", // Ensure correct content type
          },
        }
      );
      console.log('step 4')
    if(!deleteResponse || !deleteResponse.data){
      throw new ApiError(400,"mail is not deleted")
    }
    console.log('step 5')
    // Check the response status
    return res
    .status(200)
    .json(new ApiResponse(200,deleteResponse.data,"mail deleted successfully..."))
  } catch (error) {
    throw new ApiError(500, "Failed to delete email");
  }
});

export {  getUnreadMails,
          addMails,
          getUserMails,
          getMaybeSpamMails,
          getMailbyID,
          UpdateMailStatus,
          deleteMailByID,
          getSafeMails,
          getTrashMails
};
