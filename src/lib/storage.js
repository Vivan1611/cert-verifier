// Unique storage key for local storage
const STORAGE_KEY = 'blockchain_certificates';
const VERIFY_COUNT_KEY = 'blockchain_verify_count';

/**
 * Get all stored certificates from local storage
 * @returns {Array} Array of certificate objects
 */
export const getStoredCertificates = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to read from local storage', err);
    return [];
  }
};

/**
 * Store a new certificate in local storage
 * @param {string} hash - SHA-256 hash of the certificate
 * @param {string} fileName - Original file name
 * @returns {Object|boolean} Returns the saved object or false if already exists
 */
export const storeCertificate = (hash, fileName) => {
  const certs = getStoredCertificates();
  
  if (certs.some(cert => cert.hash === hash)) {
    return false;
  }
  
  const newCert = {
    id: Date.now().toString(),
    hash,
    fileName,
    timestamp: new Date().toISOString()
  };
  
  certs.push(newCert);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
  
  return newCert;
};

/**
 * Verify if a hash exists in our "blockchain" (localStorage)
 * @param {string} hash - SHA-256 hash to find
 * @returns {Object|null} Returns the certificate metadata or null
 */
export const verifyCertificateHash = (hash) => {
  const certs = getStoredCertificates();
  const cert = certs.find(cert => cert.hash === hash);
  if (cert) {
    const count = getVerifyCount() + 1;
    localStorage.setItem(VERIFY_COUNT_KEY, count.toString());
    return cert;
  }
  return null;
};

/**
 * Get the total number of successful verifications
 * @returns {number}
 */
export const getVerifyCount = () => {
  try {
    const data = localStorage.getItem(VERIFY_COUNT_KEY);
    return data ? parseInt(data, 10) : 0;
  } catch (err) {
    return 0;
  }
};
