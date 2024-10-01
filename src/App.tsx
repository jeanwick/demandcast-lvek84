import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';  
import DemandForecast from './demandforecast';   
import LoadingScreen from './loadscreen';

// Component to require authentication for specific routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const [loading, setLoading] = useState(true);  // Local loading state to simulate longer load time
  const location = window.location.pathname;

  useEffect(() => {
    // Simulate a delay in loading, for example 3 seconds
    const timeout = setTimeout(() => {
      setLoading(isLoading);  // Once Auth0 loading is done, remove loading screen
    }, 3000);  // You can change 3000ms to however long you want the delay to be

    return () => clearTimeout(timeout);  // Clear timeout on unmount
  }, [isLoading]);  // Re-run the effect when isLoading changes

  if (loading || isLoading) {
    return <LoadingScreen />;  // Custom loading screen component
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
    return <LoadingScreen />;  // Replace with the custom loading screen
  }

  if (isAuthenticated) {
    return <Navigate to="/demandforecast" />;  // Navigate to demandforecast page after login
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