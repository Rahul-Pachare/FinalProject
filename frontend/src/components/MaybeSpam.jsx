// import React, { useState } from 'react'
// import { getMaybeSpam } from '../api';
// import MailCard from './MailCard';

// function MaybeSpam() {
//     const [mailid,setmailid] = useState([])
//     let token  = "";
//     if(localStorage.getItem("token")){
//          token  = localStorage.getItem("token")
        
//     }
//     const getmails =async ()=>{
//         const response = await getMaybeSpam(1,token);
//         setmailid(response.data.maildata)
//     }

//   return (
//     <div>
//       <button onClick={getmails}>get may be spam mails</button>
//       {mailid.map(mail =>(
//         <MailCard mailid ={mail} key={mail}/>
//       ))}
//     </div>
//   )
// }

// export default MaybeSpam

import React, { useState, useEffect } from 'react'
import { getMaybeSpam } from '../api';
import MailCard from './MailCard';

function MaybeSpam() {
    const [mailid, setMailid] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    let token = "";
    if(localStorage.getItem("token")){
        token = localStorage.getItem("token");
    }
    
    const getSpamMails = async (page = 1) => {
        try {
            setLoading(true);
            const response = await getMaybeSpam(page, token);
            setMailid(response.data.maildata || []);
            
            // Assuming your API returns pagination info
            setTotalPages(response.data.totalPages || 1);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching spam mails:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        getSpamMails(1);
    }, []);
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Potential Spam Emails</h2>
                <button 
                    onClick={() => getSpamMails(currentPage)}
                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                    disabled={loading}
                >
                    {loading ? (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    )}
                    <span>Refresh</span>
                </button>
            </div>
            
            {loading && mailid.length === 0 ? (
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    ))}
                </div>
            ) : mailid.length > 0 ? (
                <div className="space-y-4">
                    {mailid.map(mail => (
                        <div key={mail._id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                            <MailCard mailid={mail} />
                        </div>
                    ))}
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center pt-4">
                            <nav className="inline-flex rounded-md shadow-sm">
                                <button
                                    onClick={() => getSpamMails(currentPage - 1)}
                                    disabled={currentPage === 1 || loading}
                                    className={`inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                                        currentPage === 1 || loading
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Previous
                                </button>
                                <span className="inline-flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => getSpamMails(currentPage + 1)}
                                    disabled={currentPage === totalPages || loading}
                                    className={`inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                                        currentPage === totalPages || loading
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No spam emails found</h3>
                    <p className="mt-1 text-sm text-gray-500">Your inbox is clean! No potential spam detected.</p>
                </div>
            )}
        </div>
    );
}

export default MaybeSpam