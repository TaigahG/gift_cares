import React, { useState } from 'react';
import { create } from 'ipfs-http-client';

const client = create('https://ipfs.infura.io:5001/api/v0'); // IPFS gateway

function UploadProof({ setProofCid }) {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const added = await client.add(file);  // Upload file to IPFS
      setCid(added.path);  // Set the CID after upload
      setProofCid(added.path);  // Send CID back to the parent component
      console.log('File uploaded to IPFS with CID:', added.path);
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button type="button" onClick={handleUpload}>Upload</button>
      {cid && (
        <div>
          <p>Uploaded to IPFS:</p>
          <a href={`https://ipfs.io/ipfs/${cid}`} target="_blank" rel="noopener noreferrer">
            View Proof
          </a>
        </div>
      )}
    </div>
  );
}

export default UploadProof;
