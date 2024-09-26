import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Use Routes instead of Switch
import Home from './Home';
import RequestersPage from './RequestersPage';
import DonationFormWithHistory from './DonationForm';
import Auth from './Auth';

function App() {
  const [userPrincipal, setUserPrincipal] = useState(null);

  const handleSignIn = (principal) => {
    setUserPrincipal(principal);
  };

  return (
    <Router>
      <div>
        {userPrincipal ? (
          <Routes>
            <Route path="/" element={<Home />} />  {/* Use element prop instead of component */}
            <Route path="/requesters" element={<RequestersPage />} />
            <Route path="/donation-form" element={<DonationFormWithHistory userPrincipal={userPrincipal} />} />
          </Routes>
        ) : (
          <Auth onSignIn={handleSignIn} />
        )}
      </div>
    </Router>
  );
}

export default App;
