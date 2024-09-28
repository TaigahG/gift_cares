import React, { useState, useEffect } from 'react';
import { HttpAgent, Actor } from '@dfinity/agent'; 
import { Principal } from '@dfinity/principal'; 
import { idlFactory as donation_idl } from '../../declarations/gift_care_backend/gift_care_backend.did.js';
import { canisterId as donation_canisterId } from '../../declarations/gift_care_backend/index';

// Create agent and actor for submitting and fetching requests
const agent = new HttpAgent({ host: "http://localhost:4943" });
agent.fetchRootKey();
const donationActor = Actor.createActor(donation_idl, { agent, canisterId: donation_canisterId });

function DonationForm({ userPrincipal }) {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [description, setDescription] = useState('');
  const [proofUrl, setProofUrl] = useState(''); 
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const principal = Principal.fromText(userPrincipal);  
        const result = await donationActor.getRequestsByUser(principal);  
        setHistory(result);  
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    if (userPrincipal) {
      fetchHistory();
    }
  }, [userPrincipal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const principal = Principal.fromText(userPrincipal);

      const requestId = await donationActor.submitRequest(
        principal, 
        title,
        name,     
        contactDetails, 
        description,   
        proofUrl   
      );
      setMessage(`Request submitted successfully with ID: ${requestId}`);
      
      const result = await donationActor.getRequestsByUser(principal);
      setHistory(result);
    } catch (e) {
      console.error("Error submitting request:", e);
      setMessage('An error occurred. Please try again.');
    }

    setTitle('');
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
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
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

      {/* Display Request History */}
      <h3>Your Request History</h3>
      {history.length > 0 ? (
        <ul>
          {history.map((request, index) => (
            <li key={index}>
              <p><strong>Title:</strong> {request.title}</p>
              <p><strong>Name:</strong> {request.name}</p>
              <p><strong>Description:</strong> {request.description}</p>
              <p><strong>Proof URL:</strong> <a href={request.proofUrl} target="_blank" rel="noopener noreferrer">View Proof</a></p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No previous requests found.</p>
      )}
    </div>
  );
}

export default DonationForm;
