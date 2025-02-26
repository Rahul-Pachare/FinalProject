import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { deleteMailwithID, getmailwithID, updateMail } from '../api';
function MailCard({mailid}) { 
    const [data,setdata] = useState({});
    let token  = "";
    if(localStorage.getItem("token")){
         token  = localStorage.getItem("token")
        
    }
    const updatemail = async ()=>{
      const see = await updateMail(mailid._id,"ham",0,token)
    }
    useEffect(()=>{
        const getmail =async (mailid,accessToken) =>{
            const mailResponse = await getmailwithID(mailid,accessToken);
            const data = mailResponse.data
            setdata(data)
        }
         getmail(mailid.messageID,token)
        console.log("data is here",data)
    },[mailid,token])
    
   const onDelete=async()=>{
    const res = await deleteMailwithID(mailid.messageID,token)
    console.log(res)
   }
  return (
    <div>
   {data.snippet}
   <span onClick={updatemail}>safe</span>
   <button onClick={onDelete}>delete</button>
    </div>
  )
}

export default MailCard
