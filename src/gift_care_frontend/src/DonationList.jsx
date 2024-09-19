import React, { useEffect, useState } from 'react';
import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory as donation_idl } from '../../declarations/gift_care_backend/gift_care_backend.did.js'; 
import { canisterId as donation_canisterId } from '../../declarations/gift_care_backend'; 

// Create an agent and actor
const agent = new HttpAgent();
agent.fetchRootKey();
const donationActor = Actor.createActor(donation_idl, {
  agent,
  canisterId: donation_canisterId,
});
console.log("Donation Actor: ", donationActor);



function DonationList() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
      const fetchRequests = async () => {
        try {
          const result = await donationActor.getRequests();  
          console.log("Fetched requests:", result);  
          setRequests(result);
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      };
  
      fetchRequests();
    }, []);

    return (
        <div>
          <h2>All Donation Requests</h2>
          {requests.length > 0 ? (
            <ul>
              {requests.map((request, index) => (
                <li key={index}>
                  <p><strong>Name:</strong> {request.name}</p>
                  <p><strong>Contact Details:</strong> {request.contactDetails}</p>
                  <p><strong>Description:</strong> {request.description}</p>
                  <p><strong>Proof URL:</strong> <a href={request.proofUrl} target="_blank" rel="noopener noreferrer">View Proof</a></p>
                  <p><strong>Status:</strong> {request.status}</p>
                  <p><strong>Submitted At:</strong> {new Date(Number(request.timestamp) / 1_000_000).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No requests submitted yet.</p>
          )}
        </div>
      );
}

export default DonationList;
