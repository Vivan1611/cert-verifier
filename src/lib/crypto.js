import CryptoJS from 'crypto-js';

// Function to generate SHA-256 hash from a file
export const generateFileHash = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        // e.target.result is an ArrayBuffer
        const arrayBuffer = e.target.result;
        
        // Convert ArrayBuffer to WordArray for CryptoJS
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        
        // Calculate SHA-256 Hash
        const hash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
        resolve(hash);
      } catch (err) {
        reject(new Error('Failed to generate hash: ' + err.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // Read file as ArrayBuffer
    reader.readAsArrayBuffer(file);
  });
};
