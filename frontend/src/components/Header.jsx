import React, { useEffect, useState } from 'react'

function Header() {
    const [token,setToken] = useState('');
    useEffect(()=>{
        if(localStorage.getItem("token")){
            setToken(localStorage.getItem("token"))
           
       }
    },[token])
    const userlogout = ()=>{
            localStorage.removeItem("token")
    }

  return (
    <div className='bg-gradient-to-br from-blue-50 to-gray-200 flex justify-between items-center'>
      <div className='flex'>
        <span className='flex align-middle'>
        <img src="../public/spamguard.png" alt="" className='w-20 h-20 object-contain' /><span className="text-red-500 font-bold  text-4xl self-center">Spam</span>
          <span className="text-[#4c4c4c] font-sans text-4xl self-center">Guard</span>
        </span>
        
      </div>
      <div>
        <button className='text-xl font-semibold mr-7 '>Home</button>
        <button className='text-xl font-semibold mx-7 '>About</button>
        <button className='text-xl font-semibold mx-7'>Contact us</button>
      </div>
      <div>
        {token ?  <button className='bg-red-500 text-2xl font-semibold rounded-md text-white hover:bg-red-700 cursor-pointer  self-center align-middle mr-6 py-1.5 text-center px-3 '  onClick={userlogout}>logout</button> :   <button className='bg-red-500 text-2xl font-semibold rounded-md text-white hover:bg-red-700 cursor-pointer  self-center align-middle mr-6 py-1.5 text-center px-3 '>login</button>}
      
      </div>
    </div>
  )
}

export default Header
