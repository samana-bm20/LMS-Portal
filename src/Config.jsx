import CryptoJS from 'crypto-js';


const mainDomain = "http://localhost:3000"; //samana 
// const mainDomain = "http://192.168.1.168:3000"; //ip

const Config = {
  apiUrl: mainDomain,
  apiKey: 'z6Aom8zGPbqtF9vQWr3Vk72JGJ5toKud',  
  decryptData: (data) => {
    const bytes = CryptoJS.AES.decrypt(data, Config.apiKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
};

export default Config;
