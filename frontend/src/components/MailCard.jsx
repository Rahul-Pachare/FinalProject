
import React, { useEffect, useState } from 'react'
import { deleteMailwithID, getmailwithID, updateMail } from '../api';

function MailCard({ mailid ,type}) { 
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [showFullEmail, setShowFullEmail] = useState(false);
    const [mail, setMail] = useState('');
    const [plainText, setPlainText] = useState('');
    
    let token = "";
    if(localStorage.getItem("token")){
        token = localStorage.getItem("token");
    }
    
    // Base64 decoding function
    function fromBase64(str) {
        str = str.replace(/-/g, '+').replace(/_/g, '/'); // Handle URL-safe Base64
        return atob(str);
    }
    
    // Extract text from HTML content
    function extractTextFromHTML(html) {
        if (!html) return '';
        
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            return doc.body.textContent.replace(/\s+/g, ' ').trim(); // Removes extra spaces
        } catch (error) {
            console.error("Error extracting text from HTML:", error);
            return html || '';
        }
    }
    
    // Decode email content
    const decodeEmailContent = (encodedData) => {
        if (!encodedData) return { html: '', text: '' };
        
        try {
            const decodedHtml = fromBase64(encodedData);
            const plainText = extractTextFromHTML(decodedHtml);
            
            return {
                html: decodedHtml,
                text: plainText
            };
        } catch (error) {
            console.error("Error decoding email content:", error);
            return { html: '', text: '' };
        }
    };
    
    const markMailStatus = async (newStatus) => {
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
                
                // Decode email content when data is received
                const emailContent = getEmailContent(mailResponse.data);
                if (emailContent) {
                    const decoded = decodeEmailContent(emailContent);
                    setMail(decoded.html);
                    setPlainText(decoded.text);
                }
            } catch (error) {
                console.error("Error fetching mail details:", error);
            } finally {
                setLoading(false);
            }
        };
        
        getMailDetails();
    }, [mailid, token]);
    
    // Get email content from payload
    const getEmailContent = (data) => {
        if (!data || !data.payload) return null;
        
        // Check for plain body data
        if (data.payload.body && data.payload.body.data) {
            return data.payload.body.data;
        }
        
        // Check for parts
        if (data.payload.parts) {
            // First try HTML part
            const htmlPart = data.payload.parts.find(part => part.mimeType === 'text/html');
            if (htmlPart && htmlPart.body && htmlPart.body.data) {
                return htmlPart.body.data;
            }
            
            // Then try plain text part
            const textPart = data.payload.parts.find(part => part.mimeType === 'text/plain');
            if (textPart && textPart.body && textPart.body.data) {
                return textPart.body.data;
            }
            
            // Check for multi-level parts (for multipart/alternative inside multipart/mixed)
            for (const part of data.payload.parts) {
                if (part.parts) {
                    const nestedHtmlPart = part.parts.find(p => p.mimeType === 'text/html');
                    if (nestedHtmlPart && nestedHtmlPart.body && nestedHtmlPart.body.data) {
                        return nestedHtmlPart.body.data;
                    }
                    
                    const nestedTextPart = part.parts.find(p => p.mimeType === 'text/plain');
                    if (nestedTextPart && nestedTextPart.body && nestedTextPart.body.data) {
                        return nestedTextPart.body.data;
                    }
                }
            }
        }
        
        return null;
    };
    
    // Extract sender info
    const sender = data.payload?.headers?.find(h => h.name === "From")?.value || 
                  data.payload?.headers?.find(h => h.name.toLowerCase() === "from")?.value || 
                  "Unknown Sender";
    
    const subject = data.payload?.headers?.find(h => h.name === "Subject")?.value || 
                   data.payload?.headers?.find(h => h.name.toLowerCase() === "subject")?.value || 
                   "No Subject";
    
    const date = data.payload?.headers?.find(h => h.name === "Date")?.value || 
                data.payload?.headers?.find(h => h.name.toLowerCase() === "date")?.value || 
                "Unknown Date";
    
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
        <div 
            className={`flex flex-col space-y-3 p-4 border rounded-lg ${showFullEmail ? 'shadow-lg bg-white' : 'hover:bg-gray-50'}`}
        >
            {/* Email Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium text-gray-900 truncate max-w-md">{subject}</h3>
                    <p className="text-sm text-gray-600">{sender}</p>
                    <p className="text-xs text-gray-500">{new Date(date).toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                       {type != 'trash'?<p> Spam Confidence: {mailid.spam_confidence || "Unknown"}%</p>:<div></div>}
                    </span>
                </div>
            </div>
            
            {/* Email Content */}
            {showFullEmail ? (
                <div className="mt-4 border-t pt-4">
                    <div className="max-h-96 overflow-y-auto">
                        {mail ? (
                            <div dangerouslySetInnerHTML={{ __html: mail }} />
                        ) : (
                            <pre className="whitespace-pre-wrap text-sm text-gray-700">{plainText || data.snippet || "No content available"}</pre>
                        )}
                    </div>
                    <button 
                        className="mt-4 text-red-500 hover:text-red-700 text-xs font-medium"
                        onClick={() => setShowFullEmail(false)}
                    >
                        Show less
                    </button>
                </div>
            ) : (
                <div className="text-sm text-gray-700">
                    <p className="line-clamp-2">
                        {data.snippet || plainText || "No preview available"}
                    </p>
                    <button 
                        onClick={() => setShowFullEmail(true)}
                        className="text-red-500 hover:text-red-700 text-xs mt-1 font-medium"
                    >
                        Show more
                    </button>
                </div>
            )}
            
            {/* Action Buttons */}
            {type == 'maybespam'? <div className="flex justify-end space-x-3 pt-2">
                <button 
                    className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                    onClick={() => markMailStatus('ham')}
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
            </div>:<div></div>}
           
        </div>
    );
}

export default MailCard