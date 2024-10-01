import CryptoJS from 'crypto-js';

// const mainDomain = "http://localhost:3000"; //samana 
const mainDomain = "https://mlinfomap.org/LMS-API"; //live 
// const mainDomain = "http://192.168.1.168:3000"; //ip

const Config = {
  apiUrl: mainDomain,
  apiKey: 'z6Aom8zGPbqtF9vQWr3Vk72JGJ5toKud',  
  decryptData: (data) => {
    const bytes = CryptoJS.AES.decrypt(data, Config.apiKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  },
  encryptData: (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), Config.apiKey).toString();
  }  
};

export default Config;
