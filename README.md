# TruthChain - Verification Portal 

The **TruthChain Web Client** is the public-facing verification tool for the TruthChain protocol. It allows anyone (news agencies, auditors, general users) to verify the authenticity of an image instantly.

> **Zero-Trust Architecture:** This application verifies files **without uploading them**. It generates a SHA-256 cryptographic hash locally in the browser and queries the TruthChain ledger only with the hash, ensuring complete privacy.

# TruthChain Portol Link  
> https://truthchain-frontend.onrender.com/ 
> Use this verified and tampered images from google drive link  https://drive.google.com/drive/folders/1QQUg-KlTxiGyF_VuV1hD1RlzEP__1W5Q?usp=sharing

## Key Features

* **Client-Side Cryptography:** Uses `crypto-js` to calculate SHA-256 hashes entirely within the browser. The actual file never leaves the user's device.
* **Instant Verification:** Queries the immutable ledger to retrieve hardware-backed evidence (GPS, Timestamp, Device ID).
* **Tamper Detection:** If a single bit of the image has been altered, the hash changes, and verification fails immediately.
* **Visual Evidence:** Displays the "Proof of Presence" (Map location and exact time of capture) in a clean, modern UI.

## Tech Stack

* **Framework:** React 18 (Vite)
* **Styling:** Tailwind CSS (Dark Mode / Cyberpunk Aesthetic)
* **Animations:** Framer Motion (Smooth transitions for "Scanning" effects)
* **Cryptography:** Crypto-JS (Browser-side hashing)
* **Icons:** Lucide React

## How it Works

1.  **Drop:** User drags and drops a suspect image.
2.  **Hash:** The browser calculates the unique SHA-256 fingerprint.
3.  **Query:** The frontend sends *only* the hash to the backend API (`/verify/{hash}`).
4.  **Result:**
    * **Match:** Returns the original Hardware Signature, GPS, and Timestamp.
    * **Mismatch:** Flags the image as potentially fake or tampered with.

## Code Highlight: Client-Side Hashing

The core of our "Zero-Trust" approach:

```javascript
const generateSHA256 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Create hash from raw binary data
      const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
      resolve(CryptoJS.SHA256(wordArray).toString());
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
