import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';

// Landing Page Component
const LandingPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <h1>Welcome to DemandCast</h1>
      <p>Optimize your supply chain with our advanced forecasting tools.</p>
      <button onClick={() => loginWithRedirect()}>Start Free Trial</button>
    </div>
  );
};

// Onboarding Page Component
const Onboarding: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h2>Welcome, {user?.name}! Let's get you started with your free trial.</h2>
      {/* Onboarding steps go here */}
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const { isAuthenticated, logout } = useAuth0();

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        {isAuthenticated && (
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log Out
          </button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </Router>
  );
};

export default App;