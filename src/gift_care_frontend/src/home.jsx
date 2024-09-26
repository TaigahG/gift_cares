import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const goToRequesters = () => {
    navigate('/requesters');  // Navigate to the requesters page
  };

  const goToDonationForm = () => {
    navigate('/donation-form');  // Navigate to the donation form page
  };

  return (
    <div>
      <h1>Welcome to Gift Care</h1>
      <button onClick={goToRequesters}>Show All Requesters</button>
      <button onClick={goToDonationForm}>Request a Donation</button>
    </div>
  );
}

export default Home;
