import React, { useEffect, useState } from 'react';
import { HttpAgent, Actor } from '@dfinity/agent'; 
import { idlFactory as donation_idl } from '../../declarations/gift_care_backend/gift_care_backend.did.js'; 
import { canisterId as donation_canisterId } from '../../declarations/gift_care_backend';
import { Link } from 'react-router-dom'; 

// Create agent and actor
const agent = new HttpAgent({ host: "http://localhost:4943" });
agent.fetchRootKey();
const donationActor = Actor.createActor(donation_idl, { agent, canisterId: donation_canisterId });

function RequestersPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequesters = async () => {
      try {
        const result = await donationActor.getRequests();
        const sortedRequests = result.sort((a, b) => {
          return Number(b.votes.layak) - Number(a.votes.layak);  
        });
        setRequests(sortedRequests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequesters();
  }, []);

  const isImageUrl = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  };

  return (
    <div>
      <h2>Donation Requests (Sorted by Votes)</h2>
      <div className="request-list">
        {requests.length > 0 ? (
          <ul>
            {requests.map((request, index) => (
              <li key={index} className="request-item">
                <Link to={`/request/${request.id}`}>
                  <h3>{request.title}</h3>
                  {isImageUrl(request.proofUrl) ? (
                    <img src={request.proofUrl} alt="Uploaded proof" />
                  ) : (
                    <img src="/default-image-thumbnail.jpg" alt="Default thumbnail" />
                  )}
                  <p>Votes: {request.votes.layak.toString()} layak, {request.votes.tidakLayak.toString()} tidak layak</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No donation requests available.</p>
        )}
      </div>
    </div>
  );
}

export default RequestersPage;
