import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Auth API
export const loginWithGoogle = async () => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};

export const fetchUserDetails = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    console.log(response.data)
    return response.data;
   
  };

  export const fetchUserMails = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/api/mails/getmails`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    console.log(response.data)
    return response.data;
   
  };
  export const scanMails = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/api/mails/scanmails`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    console.log(response.data)
    return response.data;
   
  };

  export const getMaybeSpam = async (page,token) => {
    const response = await axios.get(`${API_BASE_URL}/api/mails/get/maybespam?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    console.log(response.data)
    return response.data;
   
  };
  export const getmailwithID = async (id,token) => {
    const response = await axios.get(`${API_BASE_URL}/api/mails/get/mailbyid?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    const data = response.data
    return data;
   
  };

  export const updateMail = async (id,status,spam_confidence,token) => {
    const response = await axios.get(`${API_BASE_URL}/api/mails/updatemail?id=${id}&status=${status}&spam_confidence=${spam_confidence}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    console.log(response.data)
    return response.data;
   
  };
  export const deleteMailwithID = async (id,token) => {
    const response = await axios.post(`${API_BASE_URL}/api/mails/deletemail`,
      { messageID: id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    const data = response.data
    return data;
   
  };

  export const ManunalScan = async () => {
    const response = await axios.post(`${API_BASE_URL}/api/mails/trigger-scan`,
      { }, {
        
      });
    const data = response.data
    return data;
   
  };
  export const getsafemails = async (page,token) => {
    const response = await axios.get(`${API_BASE_URL}/api/mails/get/safemail?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    console.log(response.data)
    return response.data;
   
  };
  export const gettrashmails = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/api/mails/get/trashmail`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    console.log(response.data)
    return response.data;
   
  };