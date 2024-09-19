import React, { useState } from 'react';
import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory as donation_idl } from '../../declarations/gift_care_backend/gift_care_backend.did.js';
import { canisterId as donation_canisterId } from '../../declarations/gift_care_backend/index';


const agent = new HttpAgent();
const donationActor = Actor.createActor(donation_idl, { 
    agent, 
    canisterId: donation_canisterId 
});

function DonationForm() {
  const [name, setName] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [description, setDescription] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [message, setMessage] = useState('');



  const handleSubmit = async (e) => {  

    try { 
        const requestId = await donationActor.submitRequest(name, contactDetails, description, proofUrl);
        console.log("Request ID: ", requestId);
        setMessage(`Request submitted successfully with ID: ${requestId}`);
    }catch (e) {
        console.error("Error submiting req: ",e);
        setMessage('An error occurred. Please try again.');
    }


    setName('');
    setContactDetails('');
    setDescription('');
    setProofUrl('');
  };
  
  
  
  return (
    <div>
      <h2>Submit a Donation Request</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Contact Details"
          value={contactDetails}
          onChange={(e) => setContactDetails(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Proof URL"
          value={proofUrl}
          onChange={(e) => setProofUrl(e.target.value)}
          required
        />
        <button type="submit">Submit Request</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default DonationForm;
