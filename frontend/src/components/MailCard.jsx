// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { deleteMailwithID, getmailwithID, updateMail } from '../api';
// function MailCard({mailid}) { 
//     const [data,setdata] = useState({});
//     let token  = "";
//     if(localStorage.getItem("token")){
//          token  = localStorage.getItem("token")
        
//     }
//     const updatemail = async ()=>{
//       const see = await updateMail(mailid._id,"ham",0,token)
//     }
//     useEffect(()=>{
//         const getmail =async (mailid,accessToken) =>{
//             const mailResponse = await getmailwithID(mailid,accessToken);
//             const data = mailResponse.data
//             setdata(data)
//         }
//          getmail(mailid.messageID,token)
//         console.log("data is here",data)
//     },[mailid,token])
    
//    const onDelete=async()=>{
//     const res = await deleteMailwithID(mailid.messageID,token)
//     console.log(res)
//    }
//   return (
//     <div>
//    {data.snippet}
//    <span onClick={updatemail}>safe</span>
//    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={onDelete}>delete</button>
//     </div>
//   )
// }

// export default MailCard

import React, { useEffect, useState } from 'react'
import { deleteMailwithID, getmailwithID, updateMail } from '../api';

function MailCard({ mailid }) { 
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);
    
    let token = "";
    if(localStorage.getItem("token")){
        token = localStorage.getItem("token");
    }
    
    const updateMail = async (newStatus) => {
        try {
            setLoading(true);
            const confidence = newStatus === 'ham' ? 0 : 100;
            await updateMail(mailid._id, newStatus, confidence, token);
            // You could add some UI feedback here
        } catch (error) {
            console.error("Error updating mail:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteMailwithID(mailid.messageID, token);
            // In a real app, you might want to update the parent component
            // to remove this email from the list
        } catch (error) {
            console.error("Error deleting mail:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const getMailDetails = async () => {
            try {
                setLoading(true);
                const mailResponse = await getmailwithID(mailid.messageID, token);
                setData(mailResponse.data);
            } catch (error) {
                console.error("Error fetching mail details:", error);
            } finally {
                setLoading(false);
            }
        };
        
        getMailDetails();
    }, [mailid, token]);
    
    // Extract sender info (this is just an example, adapt to your data structure)
    const sender = data.headers?.from || data.headers?.From || "Unknown Sender";
    const subject = data.headers?.subject || data.headers?.Subject || "No Subject";
    const date = data.headers?.date || data.headers?.Date || "Unknown Date";
    
    if (loading && !data.snippet) {
        return (
            <div className="animate-pulse flex flex-col space-y-4 p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col space-y-3">
            {/* Email Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium text-gray-900 truncate max-w-md">{subject}</h3>
                    <p className="text-sm text-gray-600">{sender}</p>
                    <p className="text-xs text-gray-500">{new Date(date).toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Spam Confidence: {mailid.spam_confidence || "Unknown"}%
                    </span>
                </div>
            </div>
            
            {/* Email Preview */}
            <div className="text-sm text-gray-700">
                <p className={expanded ? "" : "line-clamp-2"}>
                    {data.snippet || "No preview available"}
                </p>
                {data.snippet && data.snippet.length > 120 && (
                    <button 
                        onClick={() => setExpanded(!expanded)}
                        className="text-red-500 hover:text-red-700 text-xs mt-1 font-medium"
                    >
                        {expanded ? "Show less" : "Show more"}
                    </button>
                )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-2">
                <button 
                    className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                    onClick={() => updateMail('ham')}
                    disabled={loading}
                >
                    Mark as Safe
                </button>
                <button 
                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                    onClick={handleDelete}
                    disabled={loading}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default MailCard
