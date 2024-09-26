import React, { useEffect, useState } from 'react';
import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory as donation_idl } from '../../declarations/gift_care_backend/gift_care_backend.did.js'; 
import { canisterId as donation_canisterId } from '../../declarations/gift_care_backend';

// Create agent and actor for fetching requesters
const agent = new HttpAgent({ host: "http://localhost:4943" });
agent.fetchRootKey();
const donationActor = Actor.createActor(donation_idl, { agent, canisterId: donation_canisterId });

function RequestersPage() {
  const [requesters, setRequesters] = useState([]);

  useEffect(() => {
    const fetchRequesters = async () => {
      try {
        const result = await donationActor.getRequests();
        setRequesters(result);  // Set the fetched requesters
      } catch (error) {
        console.error('Error fetching requesters:', error);
      }
    };

    fetchRequesters();
  }, []);

  return (
    <div>
      <h2>All Requesters</h2>
      {requesters.length > 0 ? (
        <ul>
          {requesters.map((requester, index) => (
            <li key={index}>
              <p><strong>Name:</strong> {requester.name}</p>
              <p><strong>Internet Identity ID:</strong> {requester.internetIdentityId}</p>  {/* Display their II ID */}
              <p><strong>Description:</strong> {requester.description}</p>
              <p><strong>Proof URL:</strong> <a href={requester.proofUrl} target="_blank" rel="noopener noreferrer">View Proof</a></p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No requesters found.</p>
      )}
    </div>
  );
}

export default RequestersPage;
