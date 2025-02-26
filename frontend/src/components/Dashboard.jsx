import React, { useCallback, useEffect, useState } from 'react'
import { fetchUserDetails, fetchUserMails, scanMails } from '../api'
import { useNavigate } from 'react-router-dom'
import MaybeSpam from './MaybeSpam';

function Dashboard() {
    const navigate = useNavigate();
    const [data,setdata] = useState({});
    const [result,setresult] = useState({});
    const [mail,setmail] = useState('');
    let token  = "";
    if(localStorage.getItem("token")){
         token  = localStorage.getItem("token")
        
    }
   
   function show (){
    console.log("clcik",data.data)
    console.log("mails",result.data[0].payload.body.data)
   }
   const getmails = async () =>{
       setresult(await fetchUserMails(token))
       const x = await scanMails(token)
     
   }
    useEffect( ()=>{
        async function run (){
            setdata(await fetchUserDetails(token))
           
        }
         run()
         
    },[navigate,setdata])
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
      str = str.replace(/-/g, '+').replace(/_/g, '/'); // CyberChef handles URL-safe Base64 too
      return atob(str);
  }
  const recipe = [
    { "op": "From Base64",
      "args": ["A-Za-z0-9+\\-=", false, false] }
  ]
  const decode = () =>{
      const body = result.data[5].payload.body.data ||result.data[8].payload.parts[1].body.data ;
      setmail(cyberChefLike(body,recipe))
      console.log("decoded data",mail)
      console.log("text data :",extractTextFromHTML(mail))
  }
  function extractTextFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent.replace(/\s+/g, ' ').trim(); // Removes extra spaces
}
   
  return (
    <div>
      <h1>welcome to DashBoard</h1>
       <h2>{data?.data?.name}</h2>
       <h3>{data?.data?.email}</h3>
       <img src={data?.data?.picture} alt="" />
       <button onClick={show}>show</button>
       <MaybeSpam/>
       <button onClick={getmails}>get mails</button>
       <button onClick={decode}>get decode one</button>
       <div dangerouslySetInnerHTML={{ __html: mail }} />
    </div>
  )
}

export default Dashboard
