import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HttpAgent, Actor } from '@dfinity/agent'; 
import { idlFactory as donation_idl } from '../../declarations/gift_care_backend/gift_care_backend.did.js'; 
import { canisterId as donation_canisterId } from '../../declarations/gift_care_backend';

// Create agent and actor for fetching the request details
const agent = new HttpAgent({ host: "http://localhost:4943" });
if (process.env.DFX_NETWORK !== 'ic') {
  agent.fetchRootKey();  
}
const donationActor = Actor.createActor(donation_idl, { agent, canisterId: donation_canisterId });

function RequestDetails() {
  const { id } = useParams();  
  const [requestDetails, setRequestDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const result = await donationActor.getRequestsById(parseInt(id)); 
        if (result) {
          setRequestDetails(result);
        } else {
          setErrorMessage('Request not found');
        }
      } catch (error) {
        setErrorMessage('Error fetching request details: ' + error);
      }
    };
    fetchRequestDetails();
  }, [id]);

  // Function to handle voting
  const handleVote = async (voteType) => {
    try {
      await donationActor.voteRequest(parseInt(id), voteType);  
      // Fetch updated request details after voting
      const updatedRequest = await donationActor.getRequestsById(parseInt(id));
      setRequestDetails(updatedRequest); 
    } catch (error) {
      setErrorMessage('Error submitting vote: ' + error);
    }
  };

  const formatUrl = (url) => {
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  };


  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  if (requestDetails && requestDetails.length > 0) {
    const request = requestDetails[0]; 

    return (
      <div>
        <h2>Request Details</h2>
        <div>
          <p><strong>Title:</strong> {request.title || 'N/A'}</p>
          <p><strong>Name:</strong> {request.name || 'N/A'}</p>
          <p><strong>Description:</strong> {request.description || 'N/A'}</p>
          <p><strong>Proof URL:</strong> 
            <a href={formatUrl(requestDetails[0].proofUrl)} target="_blank" rel="noopener noreferrer">View Proof</a>
          </p>
          <p><strong>Votes:</strong> Layak: {request.votes.layak}, Tidak Layak: {request.votes.tidakLayak}</p>

          {/* Voting Buttons */}
          <button onClick={() => handleVote('layak')}>Vote Layak</button>
          <button onClick={() => handleVote('tidak layak')}>Vote Tidak Layak</button>
        </div>
      </div>
    );
  }

  return <p>Loading request details...</p>;
}

export default RequestDetails;
