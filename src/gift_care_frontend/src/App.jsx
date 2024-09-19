import React from 'react';
import DonationForm from './DonationFrom';
import DonationList from './DonationList';

function App() {
  return (
    <div>
      <h1>Donation Tracking dApp</h1>
      <DonationForm />
      <DonationList />
    </div>
  );
}

export default App;
