import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';  
import DemandForecast from './demandforecast';   
import LoadingScreen from './loadscreen';

// Component to require authentication for specific routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const location = window.location.pathname;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    loginWithRedirect({
      appState: {
        returnTo: location,  // Redirect back to the intended page after successful login
      },
    });
    return null;  
  }

  return children;
};

// Handle the callback from Auth0 after login
const CallbackHandler: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;  
  }

  if (isAuthenticated) {
    return <Navigate to="/demandforecast" />;  
  }

  return <Navigate to="/" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route: Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Route: Demand Forecast */}
        <Route
          path="/demandforecast"
          element={
            <RequireAuth>
              <DemandForecast />
            </RequireAuth>
          }
        />

        {/* Handle the callback route explicitly */}
        <Route path="/callback" element={<CallbackHandler />} />

        {/* Fallback Route: Redirect unknown paths to the Landing Page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;