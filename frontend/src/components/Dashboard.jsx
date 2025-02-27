// import React, { useCallback, useEffect, useState } from 'react'
// import { fetchUserDetails, fetchUserMails, scanMails } from '../api'
// import { useNavigate } from 'react-router-dom'
// import MaybeSpam from './MaybeSpam';

// function Dashboard() {
//     const navigate = useNavigate();
//     const [data,setdata] = useState({});
//     const [result,setresult] = useState({});
//     const [mail,setmail] = useState('');
//     let token  = "";
//     if(localStorage.getItem("token")){
//          token  = localStorage.getItem("token")
        
//     }
   
//    function show (){
//     console.log("clcik",data.data)
//     console.log("mails",result.data[0].payload.body.data)
//    }
//    const getmails = async () =>{
//        setresult(await fetchUserMails(token))
//        const x = await scanMails(token)
     
//    }
//     useEffect( ()=>{
//         async function run (){
//             setdata(await fetchUserDetails(token))
           
//         }
//          run()
         
//     },[navigate,setdata])
//     function cyberChefLike(input, recipe) {
//       let output = input;
  
//       for (const step of recipe) {
//           if (step.op === "From Base64") {
//               output = fromBase64(output);
//           }
//       }
  
//       return output;
//   }
  
//   function fromBase64(str) {
//       str = str.replace(/-/g, '+').replace(/_/g, '/'); // CyberChef handles URL-safe Base64 too
//       return atob(str);
//   }
//   const recipe = [
//     { "op": "From Base64",
//       "args": ["A-Za-z0-9+\\-=", false, false] }
//   ]
//   const decode = () =>{
//       const body = result.data[5].payload.body.data ||result.data[8].payload.parts[1].body.data ;
//       setmail(cyberChefLike(body,recipe))
//       console.log("decoded data",mail)
//       console.log("text data :",extractTextFromHTML(mail))
//   }
//   function extractTextFromHTML(html) {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, "text/html");
//     return doc.body.textContent.replace(/\s+/g, ' ').trim(); // Removes extra spaces
// }
   
//   return (
//     <div>
//       <h1>welcome to DashBoard</h1>
//        <h2>{data?.data?.name}</h2>
//        <h3>{data?.data?.email}</h3>
//        <img src={data?.data?.picture} alt="" />
//        <button onClick={show}>show</button>
//        <MaybeSpam/>
//        <button onClick={getmails}>get mails</button>
//        <button onClick={decode}>get decode one</button>
//        <div dangerouslySetInnerHTML={{ __html: mail }} />
//     </div>
//   )
// }

// export default Dashboard


import React, { useCallback, useEffect, useState } from 'react'
import { fetchUserDetails, fetchUserMails, scanMails, getMaybeSpam, getsafemails, gettrashmails } from '../api'
import { useNavigate } from 'react-router-dom'
import MaybeSpam from './MaybeSpam';
import MailCard from './MailCard';

function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [result, setResult] = useState({});
    const [mail, setMail] = useState('');
    const [activeTab, setActiveTab] = useState('spam');
    const [spamMails, setSpamMails] = useState([]);
    const [trashMails, setTrashMails] = useState([]);
    const [safeMails, setSafeMails] = useState([]);
    
    let token = "";
    if(localStorage.getItem("token")){
        token = localStorage.getItem("token");
    }
   
    const getmails = async () => {
       const mailsResult = await fetchUserMails(token);
       setResult(mailsResult);
       await scanMails(token);
       
       // For demonstration, we'll split emails into 3 categories
       // In a real app, you would use API calls to get the specific categories
       fetchMailCategories();
    }
    
    const fetchMailCategories = async () => {
        // Get spam mails
        const spamResponse = await getMaybeSpam(1, token);
        setSpamMails(spamResponse.data.maildata || []);
        
        // In a real app, you would have separate API calls for these categories
        // This is just for demonstration
        const trash = await gettrashmails(token)
        setTrashMails(trash.data.maildata || []);
        const safe = await getsafemails(1,token)
        setSafeMails(safe.data.maildata || []);
    }

    useEffect(() => {
        async function run() {
            const userData = await fetchUserDetails(token);
            setData(userData);
            await getmails();
        }
        run();
    }, [navigate]);
    
    function cyberChefLike(input, recipe) {
        let output = input;
        
        for (const step of recipe) {
            if (step.op === "From Base64") {
                output = fromBase64(output);
            }
        }
        
        return output;
    }
    
    function fromBase64(str) {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        return atob(str);
    }
    
    const recipe = [
        { "op": "From Base64",
          "args": ["A-Za-z0-9+\\-=", false, false] }
    ];
   
    return (
        <div className="min-h-screen bg-gray-100">
            {/* User Profile Bar */}
            <div className="bg-white shadow">
                <div className="container mx-auto py-4 px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {data?.data?.picture && (
                                <img 
                                    src={data.data.picture} 
                                    alt="Profile" 
                                    className="w-12 h-12 rounded-full border-2 border-red-500"
                                />
                            )}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">{data?.data?.name || "User"}</h2>
                                <p className="text-gray-600">{data?.data?.email || "Loading..."}</p>
                            </div>
                        </div>
                        <button 
                            onClick={getmails} 
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-md"
                        >
                            Scan Emails
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="container mx-auto py-8 px-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Email Management Dashboard</h1>
                
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('spam')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'spam'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Maybe Spam ({spamMails.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('trash')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'trash'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Trash Mails ({trashMails.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('safe')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'safe'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Safe Mails ({safeMails.length})
                        </button>
                    </nav>
                </div>
                
                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {activeTab === 'spam' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Potential Spam Emails</h2>
                                <button 
                                    onClick={() => fetchMailCategories()}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition text-sm"
                                >
                                    Refresh
                                </button>
                            </div>
                            
                            {spamMails.length > 0 ? (
                                <div className="space-y-4">
                                    {spamMails.map(mail => (
                                        <div key={mail._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                            <MailCard mailid={mail} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No spam emails</h3>
                                    <p className="mt-1 text-sm text-gray-500">Your inbox is clean! No potential spam detected.</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {activeTab === 'trash' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Trash Emails</h2>
                                <button 
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition text-sm"
                                >
                                    Empty Trash
                                </button>
                            </div>
                            {trashMails.length > 0 ? (
                                <div className="space-y-4">
                                    {trashMails.map(mail => (
                                        <div key={mail._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                            <MailCard mailid={mail} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No safe emails</h3>
                                    <p className="mt-1 text-sm text-gray-500">Connect your email to see safe messages here.</p>
                                </div>
                            )}
                            {/* <div className="text-center py-10">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Trash is empty</h3>
                                <p className="mt-1 text-sm text-gray-500">No emails in trash at the moment.</p>
                            </div> */}
                        </div>
                    )}
                    
                    {activeTab === 'safe' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Safe Emails</h2>
                                <button 
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition text-sm"
                                >
                                    Refresh
                                </button>
                            </div>
                            {safeMails.length > 0 ? (
                                <div className="space-y-4">
                                    {safeMails.map(mail => (
                                        <div key={mail._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                            <MailCard mailid={mail} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No safe emails</h3>
                                    <p className="mt-1 text-sm text-gray-500">Connect your email to see safe messages here.</p>
                                </div>
                            )}
                            {/* <div className="text-center py-10">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No safe emails</h3>
                                <p className="mt-1 text-sm text-gray-500">Connect your email to see safe messages here.</p>
                            </div> */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard