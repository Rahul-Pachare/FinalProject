import React, { useState } from 'react'
import { getMaybeSpam } from '../api';
import MailCard from './MailCard';

function MaybeSpam() {
    const [mailid,setmailid] = useState([])
    let token  = "";
    if(localStorage.getItem("token")){
         token  = localStorage.getItem("token")
        
    }
    const getmails =async ()=>{
        const response = await getMaybeSpam(1,token);
        setmailid(response.data.maildata)
    }

  return (
    <div>
      <button onClick={getmails}>get may be spam mails</button>
      {mailid.map(mail =>(
        <MailCard mailid ={mail} key={mail}/>
      ))}
    </div>
  )
}

export default MaybeSpam
